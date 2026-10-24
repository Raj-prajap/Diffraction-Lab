import React from 'react';
import { LabTab } from '../types/diffraction';
import { useDiffractionLab } from '../context/DiffractionLabContext';
import { FlaskConical, Eye, Table, Cpu, BookOpen } from 'lucide-react';

export const DiffractionBottomNavBar: React.FC = () => {
  const { uiState, selectTab } = useDiffractionLab();

  const tabs: Array<{ id: LabTab; label: string; icon: React.ReactNode; color: string }> = [
    {
      id: 'OPTICAL_BENCH',
      label: 'Optical Bench',
      icon: <FlaskConical className="w-5 h-5" />,
      color: '#38BDF8',
    },
    {
      id: 'SPECTROMETER',
      label: 'Spectrometer',
      icon: <Eye className="w-5 h-5" />,
      color: '#FBBF24',
    },
    {
      id: 'LAB_LOG',
      label: `Lab Log (${uiState.observations.length})`,
      icon: <Table className="w-5 h-5" />,
      color: '#34D399',
    },
    {
      id: 'PH3001_LABS',
      label: 'PH3001 Labs',
      icon: <Cpu className="w-5 h-5" />,
      color: '#38BDF8',
    },
    {
      id: 'THEORY_VIVA',
      label: 'Theory & Viva',
      icon: <BookOpen className="w-5 h-5" />,
      color: '#A78BFA',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0E1528]/95 backdrop-blur-md border-t border-[#283963] px-2 py-1 shadow-2xl">
      <div className="max-w-5xl mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = uiState.selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => selectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2.5 sm:px-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white font-semibold scale-105'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5 font-normal'
              }`}
              style={{ color: isActive ? tab.color : undefined }}
            >
              <div className="relative">
                {tab.icon}
                {tab.id === 'LAB_LOG' && uiState.observations.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#34D399] text-[#070B16] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {uiState.observations.length}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs mt-1 tracking-tight truncate max-w-[80px] sm:max-w-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
