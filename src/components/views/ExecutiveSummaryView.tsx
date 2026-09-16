import React, { useMemo } from 'react';
import { AnalyticsResult } from '../../services/analyticsEngine';
import { DataQualityMetrics, FleetGroupStat } from '../../types';
import { 
  Wallet, 
  Car, 
  Wrench, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  CheckCircle2,
  PieChart as PieIcon,
  Award,
  Building2,
  ArrowRight,
  PackageCheck,
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface ExecutiveSummaryViewProps {
  analytics: AnalyticsResult;
  quality: DataQualityMetrics;
  onOpenAiInsights: () => void;
  onSelectTab: (tab: any) => void;
  onInspectFleet?: (fleet: FleetGroupStat) => void;
}

const COLORS = ['#2563eb', '#38bdf8', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

export const ExecutiveSummaryView: React.FC<ExecutiveSummaryViewProps> = ({
  analytics,
  quality,
  onOpenAiInsights,
  onSelectTab,
  onInspectFleet,
}) => {
  const { summary, brandStats, supplierStats, fleetStats = [], vehicleSpendStats, expenseTypeStats, riskRecords, strategicRoadmap } = analytics;

  const criticalRisksCount = useMemo(() => {
    return (riskRecords || []).filter(r => r.riskLevel === 'Kritik Risk').length;
  }, [riskRecords]);

  const costRisksCount = useMemo(() => {
    return (riskRecords || []).filter(r => r.riskLevel === 'Maliyet Riski').length;
  }, [riskRecords]);

  const topBrandData = useMemo(() => {
    return (brandStats || []).slice(0, 5).map(b => ({
      name: b.name,
      cost: b.totalCost,
      vehicleCount: b.vehicleCount,
    }));
  }, [brandStats]);

  const expensePieData = useMemo(() => {
    return (expenseTypeStats || []).slice(0, 5).map(e => ({
      name: e.name,
      value: e.totalCost,
    }));
  }, [expenseTypeStats]);

  const topSuppliers = useMemo(() => (supplierStats || []).slice(0, 3), [supplierStats]);
  const topVehicles = useMemo(() => (vehicleSpendStats || []).slice(0, 3), [vehicleSpendStats]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Action */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Yönetici Paneli (C-Level Executive)
            </span>
            <span className="text-xs text-slate-400">
              Veri Kalite Güveni: %{quality.overallScore}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Filo Sağlık, Maliyet ve Stratejik Karar Özeti
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            {summary.totalVehicles} adet aktif aracın {summary.totalRecords} adet bakım/onarım hareketi analiz edildi. 
            Filo toplam harcaması <span className="font-bold text-emerald-400">{summary.totalCost.toLocaleString('tr-TR')} ₺</span> olarak gerçekleşti.
          </p>
        </div>

        <button
          onClick={onOpenAiInsights}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>AI Yönetici Raporunu Aç</span>
        </button>
      </div>

      {/* Bento Grid - Row 1: Key Executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Spend */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Toplam Filo Harcaması
            </span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {summary.totalCost.toLocaleString('tr-TR')} ₺
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100">
              <span>İşlem Başına:</span>
              <span className="font-semibold text-slate-700">{summary.avgTicketCost.toLocaleString('tr-TR')} ₺</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Cost Per Vehicle */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Araç Başı Ortalama
            </span>
            <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Car className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {summary.avgCostPerVehicle.toLocaleString('tr-TR')} ₺
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100">
              <span>Toplam Araç:</span>
              <span className="font-semibold text-slate-700">{summary.totalVehicles} Araç</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Cost Per KM */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              KM Başına Bakım Yükü
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-700">
              {summary.costPerKm} ₺ <span className="text-xs font-normal text-slate-500">/ KM</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100">
              <span>Ortalama Filo KM:</span>
              <span className="font-semibold text-slate-700">{summary.avgVehicleKm.toLocaleString('tr-TR')} KM</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Maintenance vs Repair Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Planlı / Plansız Oranı
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              %{summary.maintenanceSharePct} <span className="text-xs font-normal text-slate-400">Planlı Bakım</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100">
              <span>Plansız / Arıza Onarım:</span>
              <span className="font-semibold text-amber-700">%{summary.repairSharePct}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid - Row 1.5: Servis & Plaka Harcama Odaklı Konsolidasyon */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card A: Servis & Tedarikçi Bazlı Toplam Harcamalar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Servis Bazlı Toplam Harcamalar
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    En çok bütçe harcanan servisler (A Servisi toplam ... ₺)
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectTab('suppliers')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
              >
                <span>Tüm Servisler</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-2">
              {topSuppliers.map((s, idx) => (
                <div 
                  key={s.name}
                  onClick={() => onSelectTab('suppliers')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 truncate max-w-[170px]">{s.name}</div>
                      <div className="text-[10px] text-slate-500">{s.vehicleCount} Araç • {s.operationCount} Fatura</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">{s.totalCost.toLocaleString('tr-TR')} ₺</div>
                    <span className="text-[10px] font-bold text-indigo-600">%{s.costSharePct} Pay</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card B: Araç & Plaka Bazlı Toplam Harcamalar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Car className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Plaka Bazlı Toplam Harcamalar
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    En çok bakım/onarım harcayan araçlar (Şu plakalı araç toplam ... ₺)
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectTab('vehicle_spend')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
              >
                <span>Tüm Plakalar</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-2">
              {topVehicles.map((v, idx) => (
                <div 
                  key={v.plate}
                  onClick={() => onSelectTab('vehicle_spend')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-black text-slate-900">{v.plate}</div>
                      <div className="text-[10px] text-slate-500">{v.brand} {v.model} • {v.primaryService}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">{v.totalCost.toLocaleString('tr-TR')} ₺</div>
                    <span className="text-[10px] font-bold text-blue-600">%{v.costSharePct} Pay</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid - Row 1.7: Filo Bazlı Karar Destek & Öneri Kartları */}
      {fleetStats && fleetStats.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Car className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Filo Bazlı Harcama & Stratejik Öneri Kartları
                </h3>
                <p className="text-xs text-slate-500">
                  Filoların üzerine tıklayarak filo özelinde analiz sonuçlarını, parça harcama dağılımını ve aksiyon önerilerini inceleyin
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
              {fleetStats.length} Filo Grubu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fleetStats.map(fleet => (
              <div
                key={fleet.name}
                onClick={() => onInspectFleet && onInspectFleet(fleet)}
                className="group p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-slate-900 text-sm truncate max-w-[180px]" title={fleet.name}>
                      {fleet.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800">
                      {fleet.vehicleCount} Araç
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-lg font-black text-slate-900">
                      {fleet.totalCost.toLocaleString('tr-TR')} ₺
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Filo Payı: %{fleet.costSharePct}
                    </span>
                  </div>

                  {/* Mini metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200/80">
                    <div>Araç Bş: <strong className="text-slate-900">{fleet.costPerVehicle.toLocaleString('tr-TR')} ₺</strong></div>
                    <div>KM Bş: <strong className="text-blue-700">{fleet.costPerKm.toFixed(2)} ₺</strong></div>
                    <div>Bosch Payı: <strong className="text-emerald-700">%{fleet.boschSharePct}</strong></div>
                    <div>Kritik Risk: <strong className={fleet.criticalVehiclesCount > 0 ? "text-rose-700" : "text-slate-600"}>{fleet.criticalVehiclesCount} Araç</strong></div>
                  </div>

                  {/* Recommendations summary badge */}
                  <div className="mt-2.5">
                    <div className="text-[11px] text-purple-800 font-semibold bg-purple-50 px-2 py-1 rounded-lg border border-purple-100 flex items-center justify-between">
                      <span className="truncate max-w-[200px]">💡 {fleet.recommendations[0]?.title || 'Stratejik Öneriler Hazır'}</span>
                      <span className="text-[10px] font-bold text-purple-600">({fleet.recommendations.length})</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                    <span>Filo Analizini & Önerilerini İncele</span>
                  </span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bento Grid - Row 2: Charts & Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bar Chart: Top 5 Brands Spend */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Markalara Göre Toplam Bakım Harcaması
              </h3>
              <p className="text-xs text-slate-500">
                Filoda en yüksek maliyet yükü oluşturan ilk 5 marka
              </p>
            </div>
            <button
              onClick={() => onSelectTab('brands')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Detaylı Marka Analizi →
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBrandData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={val => `${(val / 1000).toFixed(0)}k ₺`} />
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString('tr-TR')} ₺`, 'Toplam Harcama']}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="cost" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Top Expense Types */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Gider Türü Dağılımı
              </h3>
              <p className="text-xs text-slate-500">
                Ana maliyet kalemleri payı
              </p>
            </div>
            <button
              onClick={() => onSelectTab('expenses')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Detay →
            </button>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {expensePieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => `${val.toLocaleString('tr-TR')} ₺`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-2">
            {expensePieData.slice(0, 4).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-slate-600 truncate max-w-[120px]">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{item.value.toLocaleString('tr-TR')} ₺</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Grid - Row 3: Risk Summary & Strategic Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Alerts Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Riskli Araç Uyarıları
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('risks')}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
              >
                Risk Matrisi →
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-rose-900">Kritik Riskli Araçlar</div>
                  <div className="text-[11px] text-rose-700">&gt;8 Yaş ve &gt;150k KM üstü</div>
                </div>
                <span className="text-base font-extrabold text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-rose-200">
                  {criticalRisksCount} Araç
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-900">Maliyet Kara Deliği Araçlar</div>
                  <div className="text-[11px] text-amber-700">Filo ortalamasının %50+ üzerinde</div>
                </div>
                <span className="text-base font-extrabold text-amber-700 bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                  {costRisksCount} Araç
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-blue-900">Veri Kalitesi Anomali Kayıtları</div>
                  <div className="text-[11px] text-blue-700">Yazım hataları, 1911 yılı, KM hataları</div>
                </div>
                <span className="text-base font-extrabold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                  {quality.brandTyposFixed + quality.invalidYearsCount + quality.invalidKmCount} Kayıt
                </span>
              </div>

              <div 
                onClick={() => onSelectTab('parts')}
                className="p-3 rounded-xl bg-indigo-50/90 border border-indigo-200 flex items-center justify-between cursor-pointer hover:bg-indigo-100/80 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-indigo-900 flex items-center space-x-1">
                    <span>Parça Kataloğu & Eşleştirme</span>
                    <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-100 px-1.5 py-0.2 rounded">Yeni</span>
                  </div>
                  <div className="text-[11px] text-indigo-700">OEM fiyat benchmarkı & parça analizi</div>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-1 rounded-lg border border-indigo-200">
                  İncele →
                </span>
              </div>
            </div>
          </div>


          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center">
              <ShieldCheck className="h-4 w-4 text-emerald-600 mr-1" />
              Sistem Güvenilirlik: %{quality.overallScore}
            </span>
            <button
              onClick={() => onSelectTab('quality')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Anomalileri İncele
            </button>
          </div>
        </div>

        {/* Strategic Action Roadmap (0-3 Ay, 3-12 Ay, 12+ Ay) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Stratejik Aksiyon Yol Haritası (Executive Action Plan)
                </h3>
                <p className="text-xs text-slate-500">
                  Filo yönetim uzmanı metodolojisiyle zaman kademeli öneriler
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              5 Temel Aksiyon
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto flex-1 max-h-80 pr-1">
            {strategicRoadmap.map(action => (
              <div
                key={action.id}
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    action.timeframe.includes('0-3')
                      ? 'bg-rose-100 text-rose-800'
                      : action.timeframe.includes('3-12')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {action.timeframe}
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {action.potentialSavingsEstimate}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs mt-1">
                  {action.title}
                </h4>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
