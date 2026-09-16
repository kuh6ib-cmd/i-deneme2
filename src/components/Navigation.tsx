import React from 'react';
import { 
  LayoutDashboard, 
  Car,
  Tag, 
  Building2, 
  Wrench, 
  TrendingUp, 
  PieChart, 
  AlertOctagon, 
  Grid, 
  ShieldAlert, 
  TableProperties,
  PackageCheck
} from 'lucide-react';

export type TabId = 
  | 'summary'
  | 'vehicle_spend'
  | 'suppliers'
  | 'parts'
  | 'brands'
  | 'expenses'
  | 'km_age'
  | 'pareto'
  | 'risks'
  | 'crosstabs'
  | 'quality'
  | 'records';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  anomalyCount: number;
  criticalRiskCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  anomalyCount,
  criticalRiskCount,
}) => {
  const tabs = [
    { id: 'summary' as TabId, label: 'Yönetici Özeti & KPI', icon: LayoutDashboard },
    { id: 'vehicle_spend' as TabId, label: 'Plaka & Araç Harcamaları', icon: Car },
    { id: 'suppliers' as TabId, label: 'Servis & Tedarikçi Harcamaları', icon: Building2 },
    { 
      id: 'parts' as TabId, 
      label: 'Parça & Katalog Analizi', 
      icon: PackageCheck,
    },
    { id: 'brands' as TabId, label: 'Marka & Motor Arıza Analizi', icon: Tag },
    { id: 'expenses' as TabId, label: 'Hizmet Türü & Gider', icon: Wrench },
    { id: 'km_age' as TabId, label: 'KM & Yaş Segmenti', icon: TrendingUp },
    { id: 'pareto' as TabId, label: 'Pareto (%80/20)', icon: PieChart },
    { 
      id: 'risks' as TabId, 
      label: 'Risk Değerlendirme Matrisi', 
      icon: AlertOctagon,
      badge: criticalRiskCount > 0 ? criticalRiskCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'crosstabs' as TabId, label: 'Çapraz Analizler', icon: Grid },
    { 
      id: 'quality' as TabId, 
      label: 'Veri Kalitesi & Anomali', 
      icon: ShieldAlert,
      badge: anomalyCount > 0 ? anomalyCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    { id: 'records' as TabId, label: 'Ham / Normalize Veri', icon: TableProperties },
  ];


  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white text-blue-700' : tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
