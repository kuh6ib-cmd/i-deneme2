import React from 'react';
import { 
  Building, 
  Car, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { FleetGroupStat } from '../types';

interface FleetFilterBarProps {
  fleetStats: FleetGroupStat[];
  selectedFleet: string;
  onSelectFleet: (fleetName: string) => void;
  onInspectFleet: (fleetStat: FleetGroupStat) => void;
}

export const FleetFilterBar: React.FC<FleetFilterBarProps> = ({
  fleetStats,
  selectedFleet,
  onSelectFleet,
  onInspectFleet,
}) => {
  if (!fleetStats || fleetStats.length === 0) return null;

  return (
    <div className="bg-white border-b border-slate-200 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 mb-2.5">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <span>Filo Bazlı Filtreleme & Karar Destek Paneli</span>
                <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  Tıkla & Filo Önerilerini İncele
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Filonun üzerine tıklayarak o filoya özel harcama analizi, Bosch dönüşüm potansiyeli ve öneri raporunu görüntüleyin.
              </p>
            </div>
          </div>

          {/* All Fleets Toggle Button */}
          <button
            onClick={() => onSelectFleet('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all self-start md:self-auto ${
              selectedFleet === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tüm Filoları Göster ({fleetStats.reduce((acc, f) => acc + f.vehicleCount, 0)} Araç)
          </button>
        </div>

        {/* Fleet Badges / Cards Horizontal Scroll */}
        <div className="flex items-stretch space-x-3 overflow-x-auto pb-1 scrollbar-none">
          {fleetStats.map(fleet => {
            const isSelected = selectedFleet === fleet.name;

            return (
              <div
                key={fleet.name}
                className={`group min-w-[260px] p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-400 shadow-sm'
                    : 'bg-slate-50/80 border-slate-200 hover:border-blue-300 hover:bg-white shadow-xs'
                }`}
                onClick={() => {
                  onSelectFleet(fleet.name);
                  onInspectFleet(fleet);
                }}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-extrabold text-slate-900 truncate max-w-[160px]" title={fleet.name}>
                      {fleet.name}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200">
                      {fleet.vehicleCount} Araç
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-1.5">
                    <span className="text-sm font-black text-slate-900">
                      {fleet.totalCost.toLocaleString('tr-TR')} ₺
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Pay: %{fleet.costSharePct}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-200/60">
                    <span>Araç Bş: <strong>{fleet.costPerVehicle.toLocaleString('tr-TR')} ₺</strong></span>
                    <span className="text-emerald-700 font-medium">Bosch: %{fleet.boschSharePct}</span>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-bold text-blue-600 group-hover:text-blue-700">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="h-3 w-3 text-purple-600" />
                    <span>Filo Analizi & Öneriler</span>
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
