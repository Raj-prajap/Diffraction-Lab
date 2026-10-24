import React, { useState } from 'react';
import { GdCalcLumericalCard } from '../photonic/GdCalcLumericalCard';
import { OghmaNanoDfbBraggCard } from '../photonic/OghmaNanoDfbBraggCard';
import { NewtonsRingsCard } from '../photonic/NewtonsRingsCard';
import { OpticalFiberNaCard } from '../photonic/OpticalFiberNaCard';
import { PlanckConstantLedCard } from '../photonic/PlanckConstantLedCard';
import { ScrewGaugeCard } from '../photonic/ScrewGaugeCard';
import { Cpu, Radio, CircleDot, Target, Activity, Sliders, Layers } from 'lucide-react';

export const Ph3001LabsTab: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('all');

  const modules = [
    { id: 'all', label: 'All Experiments', icon: Layers },
    { id: 'gdcalc', label: 'GD-Calc & RCWA', icon: Cpu },
    { id: 'dfb', label: 'DFB Bragg Grating', icon: Radio },
    { id: 'newton', label: "Newton's Rings", icon: CircleDot },
    { id: 'fiber', label: 'Optical Fiber NA', icon: Target },
    { id: 'planck', label: "Planck's Constant", icon: Activity },
    { id: 'screw', label: 'Screw Gauge & LC', icon: Sliders },
  ];

  return (
    <div className="space-y-6">
      {/* Module Selector Bar */}
      <div className="bg-[#0E1528] border border-white/5 rounded-xl p-3 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              PH3001 Applied Physics Companion Lab Deck
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800/40">
              6 Modules
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Interactive simulators for optical instruments, quantum constants & photonic CAD
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {modules.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveModule(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeModule === id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-[#16203A]/60 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Modules */}
      {(activeModule === 'all' || activeModule === 'gdcalc') && <GdCalcLumericalCard />}
      {(activeModule === 'all' || activeModule === 'dfb') && <OghmaNanoDfbBraggCard />}
      {(activeModule === 'all' || activeModule === 'newton') && <NewtonsRingsCard />}
      {(activeModule === 'all' || activeModule === 'fiber') && <OpticalFiberNaCard />}
      {(activeModule === 'all' || activeModule === 'planck') && <PlanckConstantLedCard />}
      {(activeModule === 'all' || activeModule === 'screw') && <ScrewGaugeCard />}
    </div>
  );
};
