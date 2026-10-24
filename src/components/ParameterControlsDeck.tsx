import React from 'react';
import { useDiffractionLab } from '../context/DiffractionLabContext';
import {
  BENCH_MODE_CONFIGS,
  BenchExperimentMode,
  LIGHT_SOURCE_CONFIGS,
  LightSourceMode,
} from '../types/diffraction';
import {
  DiffractionPhysics,
  PRESET_GRATINGS_LPI,
  PRESET_LASER_WAVELENGTHS,
  wavelengthToColor,
} from '../utils/diffractionPhysics';
import {
  Crosshair,
  ListPlus,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Atom,
} from 'lucide-react';

export const ParameterControlsDeck: React.FC = () => {
  const {
    uiState,
    linesPerInch,
    linesPerMm,
    maxObservableOrder,
    nearestPeak,
    resolvingPowerFirstOrder,
    wireCentralMaxHalfWidthMm,
    heisenbergFirstMinAngleDeg,
    heisenbergFirstMinScreenYmm,
    vernierWindowA,
    activeSpectralLines,
    setBenchExperimentMode,
    setLightSourceMode,
    setWavelengthNm,
    setSlitSpacingUm,
    setGratingLpi,
    setSlitWidthUm,
    setNumSlits,
    setScreenDistanceM,
    setTelescopeAngleDeg,
    nudgeTelescopeAngle,
    snapToNearestPeak,
    lockLeftSpectrumReading,
    lockRightSpectrumReading,
    recordCurrentObservation,
    selectWirePreset,
    setWireThicknessMm,
    toggleEnvelope,
    toggleWaveAnimation,
    resetApparatus,
  } = useDiffractionLab();

  const currentColor = wavelengthToColor(uiState.wavelengthNm);
  const maxSlitWidth =
    uiState.benchMode === 'SINGLE_SLIT_HEISENBERG'
      ? 4.5
      : Math.max(0.25, uiState.slitSpacingUm * 0.85);

  return (
    <div className="w-full space-y-4">
      {/* 0. Experiment Mode Selector Card */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 space-y-3 shadow-md">
        <span className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider block">
          Diffraction Experiment Setup (PH3001 Manual & VLab)
        </span>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(BENCH_MODE_CONFIGS) as BenchExperimentMode[]).map((mode) => {
            const isSelected = uiState.benchMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setBenchExperimentMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]'
                    : 'bg-[#16203A] text-[#94A3B8] border-[#283963] hover:text-white'
                }`}
              >
                {BENCH_MODE_CONFIGS[mode].shortTitle}
              </button>
            );
          })}
        </div>

        <p className="text-xs font-mono text-[#FBBF24]">
          {BENCH_MODE_CONFIGS[uiState.benchMode].manualExpRef} • {BENCH_MODE_CONFIGS[uiState.benchMode].formulaSummary}
        </p>

        {/* Exp 1 Wire Telemetry Box */}
        {uiState.benchMode === 'WIRE_THICKNESS_LASER' && (
          <div className="rounded-xl bg-[#070B16] border border-[#22335A] p-3 space-y-2 text-xs">
            <span className="font-mono font-semibold text-[#38BDF8] block">
              EXP 1: THICKNESS OF THIN WIRE USING He-Ne LASER (6328 Å)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => selectWirePreset(0)}
                className={`px-2.5 py-1 rounded text-[11px] border ${
                  uiState.wirePresetIndex === 0 ? 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]' : 'bg-[#16203A] text-[#94A3B8] border-[#283963]'
                }`}
              >
                Wire 1 (Std 0.12 mm)
              </button>
              <button
                onClick={() => selectWirePreset(1)}
                className={`px-2.5 py-1 rounded text-[11px] border ${
                  uiState.wirePresetIndex === 1 ? 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]' : 'bg-[#16203A] text-[#94A3B8] border-[#283963]'
                }`}
              >
                Wire 2 (Std 0.18 mm)
              </button>
            </div>
            <div className="flex justify-between font-mono text-white">
              <span>Wire Thickness d = {uiState.wireThicknessMm.toFixed(3)} mm</span>
              <span>Screen D = {Math.round(uiState.screenDistanceM * 1000)} mm</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.35"
              step="0.005"
              value={uiState.wireThicknessMm}
              onChange={(e) => setWireThicknessMm(parseFloat(e.target.value))}
              className="w-full accent-[#FBBF24]"
            />
            <p className="text-[#34D399] font-mono">
              Central Max Width W = 2b = {(wireCentralMaxHalfWidthMm * 2).toFixed(2)} mm ⟹ Half-width b = {wireCentralMaxHalfWidthMm.toFixed(2)} mm
            </p>
            <p className="text-[#FBBF24] text-[11px] font-mono">
              Formula Check: d = (D · λ) / b = ({Math.round(uiState.screenDistanceM * 1000)} × 6.328×10⁻⁴) / {wireCentralMaxHalfWidthMm.toFixed(2)} = {uiState.wireThicknessMm.toFixed(3)} mm
            </p>
          </div>
        )}

        {/* Exp 9 Heisenberg Uncertainty Box */}
        {uiState.benchMode === 'SINGLE_SLIT_HEISENBERG' && (
          <div className="rounded-xl bg-[#070B16] border border-[#22335A] p-3 space-y-2 text-xs">
            <span className="font-mono font-semibold text-[#A78BFA] block">
              EXP 9: HEISENBERG UNCERTAINTY PRINCIPLE (SINGLE SLIT)
            </span>
            <div className="font-mono text-white space-y-1">
              <p>Position Uncertainty Δy = a = {uiState.slitWidthUm.toFixed(2)} µm | 1st Minima θ₁ = {heisenbergFirstMinAngleDeg.toFixed(2)}°</p>
              <p className="text-[#38BDF8]">Detector 1st Minima Position y₁ = D · tan θ₁ = {heisenbergFirstMinScreenYmm.toFixed(1)} mm</p>
              <p className="text-[#34D399] text-[11px]">
                Momentum Uncertainty Δp_y = (h / λ) sin θ₁ ⟹ Δy · Δp_y = a · (h / λ) · (λ / a) = h ≥ h / 4π (Verified!)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 1. Telescope / Detector Angle & Fine Adjustment Card */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider block">
              Telescope / Detector Angle (θ)
            </span>
            <span className="text-base font-mono font-bold text-[#FBBF24]">
              {uiState.telescopeAngleDeg.toFixed(2)}° ({vernierWindowA.formattedDMS})
            </span>
          </div>
          {nearestPeak && (
            <div className="bg-[#16203A] border border-[#283963] rounded-lg px-2.5 py-1 text-xs font-mono text-[#38BDF8]">
              Nearest: m={nearestPeak.order > 0 ? `+${nearestPeak.order}` : nearestPeak.order} ({nearestPeak.angleDeg.toFixed(1)}°)
            </div>
          )}
        </div>

        <input
          type="range"
          min="-68"
          max="68"
          step="0.05"
          value={uiState.telescopeAngleDeg}
          onChange={(e) => setTelescopeAngleDeg(parseFloat(e.target.value))}
          className="w-full accent-[#FBBF24]"
        />

        {/* Nudge Buttons */}
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => nudgeTelescopeAngle(-0.5)}
            className="py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#16203A] text-white border border-[#283963] hover:border-[#38BDF8] transition-all"
          >
            -30′
          </button>
          <button
            onClick={() => nudgeTelescopeAngle(-1 / 60)}
            className="py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#16203A] text-[#FBBF24] border border-[#283963] hover:border-[#FBBF24] transition-all"
          >
            -1′
          </button>
          <button
            onClick={() => nudgeTelescopeAngle(1 / 60)}
            className="py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#16203A] text-[#FBBF24] border border-[#283963] hover:border-[#FBBF24] transition-all"
          >
            +1′
          </button>
          <button
            onClick={() => nudgeTelescopeAngle(0.5)}
            className="py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#16203A] text-white border border-[#283963] hover:border-[#38BDF8] transition-all"
          >
            +30′
          </button>
        </div>

        {/* Left & Right Lock Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={lockLeftSpectrumReading}
            className="py-2 px-3 rounded-lg text-xs font-mono font-semibold bg-[#16203A] text-[#38BDF8] border border-[#38BDF8]/40 hover:bg-[#38BDF8]/20 transition-all text-center"
          >
            Lock Left (a)
          </button>
          <button
            onClick={lockRightSpectrumReading}
            className="py-2 px-3 rounded-lg text-xs font-mono font-semibold bg-[#16203A] text-[#34D399] border border-[#34D399]/40 hover:bg-[#34D399]/20 transition-all text-center"
          >
            Lock Right (b)
          </button>
        </div>

        {/* Snap & Record */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={snapToNearestPeak}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#16203A] text-[#38BDF8] border border-[#38BDF8]/50 hover:bg-[#38BDF8]/20 transition-all"
          >
            <Crosshair className="w-4 h-4 text-[#38BDF8]" />
            Snap Peak
          </button>
          <button
            onClick={recordCurrentObservation}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#38BDF8] text-[#041326] hover:bg-[#0284C7] hover:text-white transition-all shadow-md"
          >
            <ListPlus className="w-4 h-4" />
            Record Reading
          </button>
        </div>
      </div>

      {/* 2. Slit Spacing (d) & Grating Density (N) Card */}
      {uiState.benchMode === 'DIFFRACTION_GRATING' && (
        <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider block">
                Slit Spacing (d) & Grating Element (e = 2.54/N)
              </span>
              <span className="text-sm font-mono font-bold text-[#38BDF8]">
                d = {uiState.slitSpacingUm.toFixed(3)} µm ({(uiState.slitSpacingUm * 1e-4).toExponential(3)} cm)
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono font-bold text-[#34D399] block">
                {linesPerInch.toLocaleString()} lines/in
              </span>
              <span className="text-[11px] font-mono text-[#64748B]">
                {Math.round(linesPerMm)} lines/mm
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0.80"
            max="15.00"
            step="0.05"
            value={uiState.slitSpacingUm}
            onChange={(e) => setSlitSpacingUm(parseFloat(e.target.value))}
            className="w-full accent-[#38BDF8]"
          />

          <span className="text-[11px] font-mono text-[#64748B] block">
            Standard Laboratory Gratings (Tap to Load):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_GRATINGS_LPI.map(([lpi, label]) => {
              const isSelected = Math.abs(linesPerInch - lpi) < 120;
              return (
                <button
                  key={lpi}
                  onClick={() => setGratingLpi(lpi)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                    isSelected
                      ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]'
                      : 'bg-[#16203A] text-[#94A3B8] border-[#283963] hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Light Source & Wavelength (λ) Card */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 space-y-3 shadow-md">
        <span className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider block">
          Light Source & Wavelength (λ)
        </span>

        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(LIGHT_SOURCE_CONFIGS) as LightSourceMode[]).map((mode) => {
            const isSelected = uiState.lightSourceMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setLightSourceMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-[#A78BFA]/25 text-[#F1F5F9] border-[#A78BFA]'
                    : 'bg-[#16203A] text-[#94A3B8] border-[#283963] hover:text-white'
                }`}
              >
                {LIGHT_SOURCE_CONFIGS[mode].shortName}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-[#94A3B8]">
          {LIGHT_SOURCE_CONFIGS[uiState.lightSourceMode].description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className="w-4 h-4 rounded-full border border-white/60 inline-block shadow-sm"
              style={{ backgroundColor: currentColor }}
            />
            <span className="font-mono font-bold text-sm" style={{ color: currentColor }}>
              λ = {uiState.wavelengthNm.toFixed(1)} nm ({Math.round(uiState.wavelengthNm * 10)} Å)
            </span>
          </div>
          <span className="text-xs font-mono text-[#94A3B8]">
            Max Order n_max = ±{maxObservableOrder}
          </span>
        </div>

        {/* Visible rainbow track */}
        <div
          className="w-full h-2 rounded-full"
          style={{
            background: 'linear-gradient(to right, #8B5CF6, #3B82F6, #06B6D4, #10B981, #EAB308, #F97316, #EF4444)',
          }}
        />

        <input
          type="range"
          min="380"
          max="700"
          step="0.5"
          value={uiState.wavelengthNm}
          onChange={(e) => setWavelengthNm(parseFloat(e.target.value))}
          className="w-full accent-white"
        />

        {/* Preset wavelength buttons */}
        <div className="flex flex-wrap gap-1.5">
          {(uiState.lightSourceMode === 'MONOCHROMATIC' ? PRESET_LASER_WAVELENGTHS : activeSpectralLines).map((line) => {
            const isMatch = Math.abs(uiState.wavelengthNm - line.wavelengthNm) < 2;
            const lineCol = wavelengthToColor(line.wavelengthNm);
            return (
              <button
                key={line.name}
                onClick={() => setWavelengthNm(line.wavelengthNm)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                  isMatch ? 'bg-white/10 text-white border-white/60' : 'bg-[#16203A] text-[#94A3B8] border-[#283963] hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lineCol }} />
                {line.name} ({Math.round(line.wavelengthNm * 10)} Å)
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Secondary Optics & Bench Settings Card */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 space-y-3 shadow-md">
        <span className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider block">
          Aperture Geometry & Bench Settings
        </span>

        {uiState.benchMode === 'DIFFRACTION_GRATING' && (
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-white">Illuminated Slits (M): {uiState.numSlits}</span>
              <span className="text-[#A78BFA]">Resolving Power R₁ = {resolvingPowerFirstOrder}</span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              value={uiState.numSlits}
              onChange={(e) => setNumSlits(parseInt(e.target.value))}
              className="w-full accent-[#A78BFA]"
            />
          </div>
        )}

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-white">Single Slit Width (a): {uiState.slitWidthUm.toFixed(2)} µm</span>
            <span className="text-[#34D399]">Ratio d/a = {(uiState.slitSpacingUm / uiState.slitWidthUm).toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.15"
            max={maxSlitWidth}
            step="0.05"
            value={Math.min(maxSlitWidth, uiState.slitWidthUm)}
            onChange={(e) => setSlitWidthUm(parseFloat(e.target.value))}
            className="w-full accent-[#34D399]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-white">Screen Distance (D): {uiState.screenDistanceM.toFixed(2)} m</span>
            <span className="text-[#38BDF8]">{Math.round(uiState.screenDistanceM * 100)} cm</span>
          </div>
          <input
            type="range"
            min="0.30"
            max="2.00"
            step="0.05"
            value={uiState.screenDistanceM}
            onChange={(e) => setScreenDistanceM(parseFloat(e.target.value))}
            className="w-full accent-[#38BDF8]"
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center space-x-2 cursor-pointer text-xs font-mono text-[#94A3B8]">
            <input
              type="checkbox"
              checked={uiState.showEnvelope}
              onChange={toggleEnvelope}
              className="rounded accent-[#38BDF8]"
            />
            <span>Slit Envelope</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer text-xs font-mono text-[#94A3B8]">
            <input
              type="checkbox"
              checked={uiState.animateWaves}
              onChange={toggleWaveAnimation}
              className="rounded accent-[#34D399]"
            />
            <span>Wavefronts</span>
          </label>
        </div>

        <button
          onClick={resetApparatus}
          className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#16203A] text-[#94A3B8] border border-[#283963] hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4 text-[#94A3B8]" />
          Reset Apparatus to Standard Defaults
        </button>
      </div>
    </div>
  );
};
