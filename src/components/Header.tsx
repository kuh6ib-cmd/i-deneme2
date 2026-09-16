import React, { useRef } from 'react';
import { 
  Car, 
  FileSpreadsheet, 
  Upload, 
  Sparkles, 
  Settings2, 
  ShieldCheck, 
  RotateCcw,
  AlertTriangle,
  PackageCheck,
  Building,
  ChevronDown
} from 'lucide-react';
import { DataQualityMetrics, FleetGroupStat } from '../types';

interface HeaderProps {
  dataQuality: DataQualityMetrics;
  onFileUpload: (file: File) => void;
  onLoadSample: () => void;
  onOpenColumnMapper: () => void;
  onOpenAiInsights: () => void;
  onOpenPartsCatalog?: () => void;
  catalogItemCount?: number;
  onExportExcel: () => void;
  activeDatasetName: string;
  totalVehicles: number;
  totalRecords: number;
  totalCost: number;
  fleetStats?: FleetGroupStat[];
  selectedFleet?: string;
  onSelectFleet?: (fleetName: string) => void;
  onInspectFleet?: (fleet: FleetGroupStat) => void;
}

export const Header: React.FC<HeaderProps> = ({
  dataQuality,
  onFileUpload,
  onLoadSample,
  onOpenColumnMapper,
  onOpenAiInsights,
  onOpenPartsCatalog,
  catalogItemCount = 0,
  onExportExcel,
  activeDatasetName,
  totalVehicles,
  totalRecords,
  totalCost,
  fleetStats = [],
  selectedFleet = 'ALL',
  onSelectFleet,
  onInspectFleet,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFleetStat = fleetStats.find(f => f.name === selectedFleet);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = '';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Main Title */}
          <div className="flex items-center space-x-3.5">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Filo Analiz ve Karar Destek Paneli
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Kurumsal v2.4
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {activeDatasetName} • <span className="font-semibold text-slate-700">{totalVehicles}</span> Araç • <span className="font-semibold text-slate-700">{totalRecords}</span> İşlem • <span className="font-semibold text-emerald-700">{totalCost.toLocaleString('tr-TR')} ₺</span>
              </p>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />

            {/* Fleet Filter Quick Dropdown & Analysis Trigger */}
            {fleetStats.length > 0 && onSelectFleet && (
              <div className="inline-flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <div className="flex items-center pl-2 pr-1 space-x-1 text-slate-700">
                  <Building className="h-3.5 w-3.5 text-blue-600" />
                  <select
                    id="header-fleet-selector"
                    value={selectedFleet}
                    onChange={(e) => {
                      const fleet = e.target.value;
                      onSelectFleet(fleet);
                    }}
                    className="text-xs bg-transparent border-0 font-bold text-slate-800 focus:ring-0 focus:outline-none cursor-pointer py-1.5 pr-2"
                  >
                    <option value="ALL">Tüm Filolar ({fleetStats.length})</option>
                    {fleetStats.map(f => (
                      <option key={f.name} value={f.name}>
                        {f.name} ({f.vehicleCount} Araç)
                      </option>
                    ))}
                  </select>
                </div>

                {currentFleetStat && onInspectFleet && (
                  <button
                    onClick={() => onInspectFleet(currentFleetStat)}
                    id="btn-inspect-selected-fleet"
                    className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs"
                    title={`${currentFleetStat.name} için analiz ve karar önerilerini aç`}
                  >
                    <Sparkles className="h-3 w-3 text-yellow-300" />
                    <span>Filo Önerileri</span>
                  </button>
                )}
              </div>
            )}

            {/* Load Sample Button */}
            <button
              onClick={onLoadSample}
              id="btn-load-sample"
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Hazır örnek filo bakım verisini yükle"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span>Örnek Filo Verisi</span>
            </button>

            {/* Upload Custom File */}
            <button
              onClick={() => fileInputRef.current?.click()}
              id="btn-upload-file"
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            >
              <Upload className="h-3.5 w-3.5 text-blue-600" />
              <span>Excel/CSV Yükle</span>
            </button>

            {/* Column Mapper */}
            <button
              onClick={onOpenColumnMapper}
              id="btn-open-mapper"
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
              title="Sütun eşleştirme ayarları"
            >
              <Settings2 className="h-3.5 w-3.5 text-slate-500" />
              <span>Sütun Eşleştirici</span>
            </button>

            {/* Parts Catalog */}
            {onOpenPartsCatalog && (
              <button
                onClick={onOpenPartsCatalog}
                id="btn-open-parts-catalog"
                className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                title="Parça Kataloğunu Görüntüle / Özel Katalog Yükle"
              >
                <PackageCheck className="h-3.5 w-3.5 text-indigo-600" />
                <span>Parça Kataloğu</span>
                {catalogItemCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-indigo-200 text-indigo-800 text-[10px] font-bold">
                    {catalogItemCount}
                  </span>
                )}
              </button>
            )}

            {/* AI Advisor */}
            <button
              onClick={onOpenAiInsights}
              id="btn-ai-insights"
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-600 animate-pulse" />
              <span>AI Yönetici Brifingi</span>
            </button>

            {/* Export Excel */}
            <button
              onClick={onExportExcel}
              id="btn-export-excel"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Raporu İndir (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Quality Banner if Anomalies detected */}
        {(dataQuality.brandTyposFixed > 0 || dataQuality.invalidYearsCount > 0 || dataQuality.outliersCount > 0) && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center space-x-3">
              <span className="flex items-center text-emerald-700 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                Kalite Skoru: %{dataQuality.overallScore}
              </span>
              {dataQuality.brandTyposFixed > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-medium">
                  {dataQuality.brandTyposFixed} Marka Yazım Hatası Düzeltildi
                </span>
              )}
              {dataQuality.invalidYearsCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[11px] font-medium">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {dataQuality.invalidYearsCount} Hatalı Model Yılı (1911 vb.)
                </span>
              )}
              {dataQuality.outliersCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[11px] font-medium">
                  {dataQuality.outliersCount} Uç Değer (Outlier) Fatura
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">
              Standartlaştırma ve Anomali Motoru Aktif
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
