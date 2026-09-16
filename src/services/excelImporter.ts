import * as XLSX from 'xlsx';
import { RawFleetRecord } from '../types';

export interface ParseProgress {
  stage: 'reading' | 'detecting_sheet' | 'detecting_headers' | 'normalizing' | 'complete' | 'error';
  percent: number;
  message: string;
  totalRows?: number;
  sheetName?: string;
}

export interface ParseResult {
  records: RawFleetRecord[];
  headers: string[];
  sheetName: string;
  totalRows: number;
  headerRowIndex: number;
}

/**
 * Known column keywords to identify the real header row in corporate Excel sheets.
 */
const KNOWN_HEADER_KEYWORDS = [
  'plaka', 'plate', 'plk', 'arac', 'araç',
  'marka', 'brand', 'make',
  'model', 'tip', 'versiyon',
  'yil', 'yıl', 'model yili', 'model yılı', 'year',
  'km', 'kilometre', 'odo', 'sayac', 'sayaç',
  'servis', 'tedarikci', 'tedarikçi', 'supplier', 'bayi', 'usta',
  'hizmet', 'masraf', 'gider', 'islem', 'işlem', 'kategori',
  'tutar', 'fiyat', 'bedel', 'toptutar', 'toplam', 'net', 'kdv', 'cost', 'amount', 'price',
  'yp', 'y.p', 'parca', 'parça', 'yedek parca', 'yedek parça', 'mensei', 'menşei',
  'firma', 'filo', 'departman', 'bolge', 'bölge', 'cr kod',
  'tarih', 'talep tarihi', 'fatura tarihi', 'date'
];

/**
 * Score a candidate header row based on how many fleet-related keywords it contains.
 */
function scoreHeaderRow(row: any[]): number {
  if (!Array.isArray(row) || row.length === 0) return 0;
  let score = 0;
  for (const cell of row) {
    if (!cell) continue;
    const str = String(cell).toLowerCase().trim();
    if (str.length === 0) continue;
    for (const kw of KNOWN_HEADER_KEYWORDS) {
      if (str === kw) {
        score += 10;
      } else if (str.includes(kw)) {
        score += 5;
      }
    }
  }
  return score;
}

/**
 * Fast asynchronous CSV parser for massive files to avoid memory overhead and UI freeze.
 */
async function parseFastCSV(
  file: File,
  onProgress?: (progress: ParseProgress) => void
): Promise<ParseResult> {
  onProgress?.({
    stage: 'reading',
    percent: 20,
    message: `${file.name} metin olarak okunuyor...`
  });

  const text = await file.text();
  await new Promise(r => setTimeout(r, 10));

  onProgress?.({
    stage: 'detecting_headers',
    percent: 40,
    message: 'CSV başlık ve sütun yapısı çözümleniyor...'
  });

  // Detect delimiter: semicolon (common in Turkish/EU Excel) or comma or tab
  const sampleFirstLines = text.slice(0, 5000).split(/\r?\n/);
  let delimiter = ',';
  let semiCount = 0;
  let commaCount = 0;
  let tabCount = 0;

  for (let i = 0; i < Math.min(10, sampleFirstLines.length); i++) {
    const line = sampleFirstLines[i];
    semiCount += (line.match(/;/g) || []).length;
    commaCount += (line.match(/,/g) || []).length;
    tabCount += (line.match(/\t/g) || []).length;
  }

  if (semiCount > commaCount && semiCount > tabCount) delimiter = ';';
  else if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';

  // Split lines
  const lines = text.split(/\r?\n/);
  if (lines.length === 0) {
    throw new Error('CSV dosyası boş.');
  }

  // Find best header row in first 30 lines
  let bestHeaderRowIndex = 0;
  let highestScore = -1;
  const maxScan = Math.min(30, lines.length);

  for (let i = 0; i < maxScan; i++) {
    const rawCells = lines[i].split(delimiter).map(c => c.replace(/^["']|["']$/g, '').trim());
    const score = scoreHeaderRow(rawCells);
    if (score > highestScore) {
      highestScore = score;
      bestHeaderRowIndex = i;
    }
  }

  const rawHeaderRow = lines[bestHeaderRowIndex].split(delimiter).map(c => c.replace(/^["']|["']$/g, '').trim());
  const headerKeys: string[] = [];
  const usedKeysCount: Record<string, number> = {};

  for (let c = 0; c < rawHeaderRow.length; c++) {
    let key = rawHeaderRow[c] || `Sütun_${c + 1}`;
    if (usedKeysCount[key]) {
      usedKeysCount[key]++;
      headerKeys.push(`${key}_${usedKeysCount[key]}`);
    } else {
      usedKeysCount[key] = 1;
      headerKeys.push(key);
    }
  }

  const totalLines = lines.length;
  const rawRecords: RawFleetRecord[] = [];
  const startRow = bestHeaderRowIndex + 1;
  const chunkSize = 3000;

  for (let r = startRow; r < totalLines; r += chunkSize) {
    const end = Math.min(totalLines, r + chunkSize);

    for (let i = r; i < end; i++) {
      const line = lines[i];
      if (!line || !line.trim()) continue;

      const cells = line.split(delimiter);
      const recordObj: Record<string, any> = {};
      let hasVal = false;

      for (let c = 0; c < headerKeys.length; c++) {
        const rawCell = cells[c] !== undefined ? cells[c].replace(/^["']|["']$/g, '').trim() : '';
        recordObj[headerKeys[c]] = rawCell;
        if (rawCell) hasVal = true;
      }

      if (hasVal) {
        rawRecords.push(recordObj as RawFleetRecord);
      }
    }

    const pct = Math.min(95, 45 + Math.round(((end - startRow) / Math.max(1, totalLines - startRow)) * 50));
    onProgress?.({
      stage: 'normalizing',
      percent: pct,
      message: `${rawRecords.length.toLocaleString('tr-TR')} CSV kaydı ayrıştırılıyor...`,
      totalRows: totalLines - startRow
    });

    await new Promise(res => setTimeout(res, 0));
  }

  onProgress?.({
    stage: 'complete',
    percent: 100,
    message: `${rawRecords.length.toLocaleString('tr-TR')} kayıt başarıyla aktarıldı.`,
    totalRows: rawRecords.length
  });

  return {
    records: rawRecords,
    headers: headerKeys,
    sheetName: 'CSV_Verisi',
    totalRows: rawRecords.length,
    headerRowIndex: bestHeaderRowIndex
  };
}

/**
 * Asynchronously read and parse large Excel/CSV files with smart sheet and header detection.
 */
export async function parseLargeFleetFile(
  file: File,
  onProgress?: (progress: ParseProgress) => void
): Promise<ParseResult> {
  const fileNameLower = file.name.toLowerCase();

  // Fast path for CSV files
  if (fileNameLower.endsWith('.csv') || file.type === 'text/csv') {
    return parseFastCSV(file, onProgress);
  }

  // Step 1: Read file as ArrayBuffer
  onProgress?.({
    stage: 'reading',
    percent: 15,
    message: `${file.name} belleğe alınıyor ve taranıyor...`
  });

  const arrayBuffer = await file.arrayBuffer();

  // Yield to main thread
  await new Promise(r => setTimeout(r, 10));

  onProgress?.({
    stage: 'detecting_sheet',
    percent: 30,
    message: 'Excel çalışma sayfaları analiz ediliyor...'
  });

  // Step 2: Parse Workbook with dense & low-memory flags
  const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
    type: 'array',
    dense: true,
    cellDates: false, // Much faster and uses 80% less memory on huge files
    raw: false,
  });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('Yüklenen Excel dosyasında geçerli bir çalışma sayfası bulunamadı.');
  }

  // Step 3: Find the best sheet (the sheet with the most rows / highest quality data)
  let bestSheetName = workbook.SheetNames[0];
  let maxRows = 0;
  let bestWorksheet: XLSX.WorkSheet = workbook.Sheets[bestSheetName];

  for (const name of workbook.SheetNames) {
    const ws = workbook.Sheets[name];
    if (!ws) continue;
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
    const rowCount = range.e.r - range.s.r + 1;
    if (rowCount > maxRows) {
      maxRows = rowCount;
      bestSheetName = name;
      bestWorksheet = ws;
    }
  }

  onProgress?.({
    stage: 'detecting_headers',
    percent: 45,
    message: `'${bestSheetName}' sayfası taranıyor (${maxRows.toLocaleString('tr-TR')} satır)...`,
    sheetName: bestSheetName,
    totalRows: maxRows
  });

  // Yield to main thread
  await new Promise(r => setTimeout(r, 10));

  // Step 4: Convert worksheet to 2D array
  const rows2D = XLSX.utils.sheet_to_json<any[]>(bestWorksheet, {
    header: 1,
    defval: '',
    blankrows: false
  });

  if (rows2D.length === 0) {
    throw new Error(`'${bestSheetName}' sayfası boş veya veri içermiyor.`);
  }

  // Scan first 30 rows to identify the real column header row
  let bestHeaderRowIndex = 0;
  let highestHeaderScore = -1;

  const maxHeaderSearchRows = Math.min(30, rows2D.length);
  for (let r = 0; r < maxHeaderSearchRows; r++) {
    const row = rows2D[r];
    const score = scoreHeaderRow(row);
    if (score > highestHeaderScore) {
      highestHeaderScore = score;
      bestHeaderRowIndex = r;
    }
  }

  // Extract raw header names from the identified header row
  const rawHeaderRow = rows2D[bestHeaderRowIndex] || [];
  const headerKeys: string[] = [];
  const usedKeysCount: Record<string, number> = {};

  for (let c = 0; c < rawHeaderRow.length; c++) {
    let key = String(rawHeaderRow[c] || '').trim();
    if (!key) {
      key = `Sütun_${c + 1}`;
    }
    if (usedKeysCount[key]) {
      usedKeysCount[key]++;
      headerKeys.push(`${key}_${usedKeysCount[key]}`);
    } else {
      usedKeysCount[key] = 1;
      headerKeys.push(key);
    }
  }

  const rawRecords: RawFleetRecord[] = [];
  const dataRowsStart = bestHeaderRowIndex + 1;
  const totalRowsCount = rows2D.length;
  const chunkSize = 2500;

  for (let r = dataRowsStart; r < totalRowsCount; r += chunkSize) {
    const end = Math.min(totalRowsCount, r + chunkSize);

    for (let curr = r; curr < end; curr++) {
      const row = rows2D[curr];
      if (!Array.isArray(row) || row.length === 0) continue;

      let hasContent = false;
      const recordObj: Record<string, any> = {};

      for (let c = 0; c < headerKeys.length; c++) {
        const val = row[c];
        const headerName = headerKeys[c];
        recordObj[headerName] = val !== undefined && val !== null ? val : '';
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          hasContent = true;
        }
      }

      if (hasContent) {
        rawRecords.push(recordObj as RawFleetRecord);
      }
    }

    const pct = Math.min(95, 50 + Math.round(((end - dataRowsStart) / Math.max(1, totalRowsCount - dataRowsStart)) * 45));
    onProgress?.({
      stage: 'normalizing',
      percent: pct,
      message: `${rawRecords.length.toLocaleString('tr-TR')} satır ayrıştırıldı...`,
      sheetName: bestSheetName,
      totalRows: totalRowsCount - dataRowsStart
    });

    // Yield to keep UI smooth
    await new Promise(res => setTimeout(res, 0));
  }

  if (rawRecords.length === 0) {
    throw new Error('Dosyada işlenebilecek geçerli veri satırı bulunamadı.');
  }

  onProgress?.({
    stage: 'complete',
    percent: 100,
    message: `${rawRecords.length.toLocaleString('tr-TR')} satır başarıyla okundu.`,
    sheetName: bestSheetName,
    totalRows: rawRecords.length
  });

  return {
    records: rawRecords,
    headers: headerKeys,
    sheetName: bestSheetName,
    totalRows: rawRecords.length,
    headerRowIndex: bestHeaderRowIndex
  };
}
