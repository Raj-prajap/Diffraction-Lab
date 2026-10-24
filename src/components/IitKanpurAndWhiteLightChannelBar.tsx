import React from 'react';
import { useDiffractionLab } from '../context/DiffractionLabContext';
import { wavelengthToColor } from '../utils/diffractionPhysics';
import { Power, Layers, Crosshair, Sparkles } from 'lucide-react';

export const IitKanpurAndWhiteLightChannelBar: React.FC = () => {
  const {
    uiState,
    toggleLampPower,
    toggleGratingInsertedOnBench,
    setLightSourceMode,
    setWhiteLightFilterBand,
    setTelescopeAngleDeg,
    principalPeaks,
  } = useDiffractionLab();

  const colorBands: Array<{ key: string | null; label: string; wl: number }> = [
    { key: null, label: 'All Colors', wl: 535 },
    { key: 'Violet', label: 'Violet (410 nm)', wl: 410 },
    { key: 'Blue', label: 'Blue (455 nm)', wl: 455 },
    { key: 'Cyan', label: 'Cyan (495 nm)', wl: 495 },
    { key: 'Green', label: 'Green (540 nm)', wl: 540 },
    { key: 'Yellow', label: 'Yellow (580 nm)', wl: 580 },
    { key: 'Orange', label: 'Orange (615 nm)', wl: 615 },
    { key: 'Red', label: 'Red (660 nm)', wl: 660 },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#0E1528] border border-[#283963] p-3.5 space-y-3 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span className="text-xs font-mono font-semibold text-[#38BDF8] tracking-wider uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          IIT-Kanpur VLab Setup & VisuPhy White-Light Channel Filter
        </span>
        <span
          className={`text-xs font-mono font-semibold ${
            uiState.isGratingInsertedOnBench ? 'text-[#34D399]' : 'text-[#FBBF24]'
          }`}
        >
          {uiState.isGratingInsertedOnBench ? 'Grating: IN PATH (Diffraction Active)' : 'Grating: REMOVED (n=0 Central Beam Only)'}
        </span>
      </div>

      {/* Assembly Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={toggleLampPower}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            uiState.lampPowerOn
              ? 'bg-[#34D399]/20 text-[#34D399] border-[#34D399]/60 hover:bg-[#34D399]/30'
              : 'bg-[#F87171]/20 text-[#F87171] border-[#F87171]/60 hover:bg-[#F87171]/30'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {uiState.lampPowerOn ? '1. Laser / Lamp: ON ✓' : '1. Add Laser Source'}
        </button>

        <button
          onClick={toggleGratingInsertedOnBench}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            uiState.isGratingInsertedOnBench
              ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/60 hover:bg-[#38BDF8]/30'
              : 'bg-[#16203A] text-[#94A3B8] border-[#283963] hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          {uiState.isGratingInsertedOnBench ? '2. Grating: Placed ✓' : '2. Place Grating'}
        </button>

        <button
          onClick={() => {
            const firstPositive = principalPeaks.find((p) => p.order === 1);
            setTelescopeAngleDeg(firstPositive ? firstPositive.angleDeg : 18.82);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#16203A] text-[#FBBF24] border border-[#283963] hover:border-[#FBBF24]/60 hover:bg-[#FBBF24]/10 transition-all"
        >
          <Crosshair className="w-3.5 h-3.5" />
          3. Snap +1st Order Screen
        </button>

        <button
          onClick={() => setLightSourceMode('WHITE_CONTINUUM')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            uiState.lightSourceMode === 'WHITE_CONTINUUM'
              ? 'bg-[#A78BFA]/25 text-[#F1F5F9] border-[#A78BFA] shadow-sm'
              : 'bg-[#16203A] text-[#94A3B8] border-[#283963] hover:text-white'
          }`}
        >
          4. White Light Dispersion
        </button>
      </div>

      {/* VisuPhy Color Filter Bands */}
      {uiState.lightSourceMode !== 'MONOCHROMATIC' && (
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
          <span className="text-[11px] font-mono text-[#64748B] whitespace-nowrap">
            Isolate Color Filter:
          </span>
          {colorBands.map((band) => {
            const isSelected = uiState.whiteLightFilterBand === band.key;
            const swatch = wavelengthToColor(band.wl);
            return (
              <button
                key={band.label}
                onClick={() => setWhiteLightFilterBand(band.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap border transition-all ${
                  isSelected
                    ? 'bg-white/15 text-white border-white/60 shadow-sm'
                    : 'bg-[#070B16] text-[#94A3B8] border-[#283963] hover:text-white hover:bg-white/5'
                }`}
              >
                {band.key !== null && (
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: swatch }}
                  />
                )}
                {band.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
