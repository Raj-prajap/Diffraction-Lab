import React from 'react';
import { useDiffractionLab } from '../context/DiffractionLabContext';
import { wavelengthToColor } from '../utils/diffractionPhysics';

interface LabHeaderHudBarProps {
  onOpenApkModal?: () => void;
}

export const LabHeaderHudBar: React.FC<LabHeaderHudBarProps> = ({ onOpenApkModal }) => {
  const { uiState, linesPerInch, gratingElementCm } = useDiffractionLab();
  const wlColor = wavelengthToColor(uiState.wavelengthNm);

  return (
    <div className="w-full rounded-2xl bg-[#0E1528] border border-[#283963] p-3.5 shadow-lg shadow-black/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20 transition-colors duration-300"
            style={{ backgroundColor: wlColor }}
          />
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#F1F5F9] flex items-center gap-2">
              Diffraction Lab
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#16203A] text-[#38BDF8] border border-[#283963]">
                PH3001(P)
              </span>
            </h1>
            <p className="text-xs text-[#94A3B8]">
              PrayogShala & Amrita VLab Physics Spectrometer Simulator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center bg-[#16203A] border border-[#283963] rounded-lg px-3 py-1.5 shadow-inner">
            <span className="font-mono text-sm font-semibold text-[#38BDF8]">
              e · sin θ = n · λ
            </span>
          </div>
          {onOpenApkModal && (
            <button
              onClick={onOpenApkModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
              </svg>
              <span>Android & iOS App</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-[#16203A] rounded-xl px-3 py-2 border border-[#283963]/60 flex flex-col">
          <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">λ (Å / nm)</span>
          <span className="text-sm font-mono font-bold mt-0.5" style={{ color: wlColor }}>
            {Math.round(uiState.wavelengthNm * 10)} Å ({uiState.wavelengthNm.toFixed(1)} nm)
          </span>
        </div>

        <div className="bg-[#16203A] rounded-xl px-3 py-2 border border-[#283963]/60 flex flex-col">
          <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">Element e</span>
          <span className="text-sm font-mono font-bold text-[#38BDF8] mt-0.5">
            {uiState.slitSpacingUm.toFixed(3)} µm
          </span>
        </div>

        <div className="bg-[#16203A] rounded-xl px-3 py-2 border border-[#283963]/60 flex flex-col">
          <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">Grating N</span>
          <span className="text-sm font-mono font-bold text-[#34D399] mt-0.5">
            {linesPerInch.toLocaleString()} LPI
          </span>
        </div>

        <div className="bg-[#16203A] rounded-xl px-3 py-2 border border-[#283963]/60 flex flex-col">
          <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">Angle θ</span>
          <span className="text-sm font-mono font-bold text-[#FBBF24] mt-0.5">
            {uiState.telescopeAngleDeg.toFixed(2)}°
          </span>
        </div>
      </div>
    </div>
  );
};
