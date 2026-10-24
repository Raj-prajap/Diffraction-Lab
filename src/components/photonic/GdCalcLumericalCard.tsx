import React, { useState } from 'react';
import { Cpu, Zap, Activity, Info, RefreshCw } from 'lucide-react';

export const GdCalcLumericalCard: React.FC = () => {
  const [pitchNm, setPitchNm] = useState<number>(380); // Lambda in nm
  const [dutyCycle, setDutyCycle] = useState<number>(0.5); // Fill factor f
  const [nRidge, setNRidge] = useState<number>(2.45); // TiO2 or SiN
  const [nSub, setNSub] = useState<number>(1.46); // Fused silica
  const [wavelengthNm, setWavelengthNm] = useState<number>(632.8); // He-Ne laser
  const [incidentAngleDeg, setIncidentAngleDeg] = useState<number>(0);

  // Effective Medium Theory (EMT / Zero-order RCWA approximation)
  // TE polarization: electric field parallel to grating grooves (ordinary)
  // eps_TE = f * n_ridge^2 + (1 - f) * 1.0^2
  const epsTE = dutyCycle * Math.pow(nRidge, 2) + (1 - dutyCycle) * 1.0;
  const nEffTE = Math.sqrt(epsTE);

  // TM polarization: electric field perpendicular to grooves (extraordinary)
  // 1 / eps_TM = f / n_ridge^2 + (1 - f) / 1.0^2
  const invEpsTM = dutyCycle / Math.pow(nRidge, 2) + (1 - dutyCycle) / 1.0;
  const nEffTM = Math.sqrt(1 / invEpsTM);

  // Subwavelength criterion: Lambda < lambda / max(n_ridge, n_sub)
  const cutoffPitch = wavelengthNm / Math.max(nRidge, nSub);
  const isSubwavelength = pitchNm < cutoffPitch;

  // Form birefringence: Delta n = n_TE - n_TM
  const deltaN = nEffTE - nEffTM;

  // Approximate 0th-order specular transmittance (Fresnel with effective index film)
  const rTE = Math.pow((1 - nEffTE) / (1 + nEffTE), 2);
  const tTE = 1 - rTE;
  const rTM = Math.pow((1 - nEffTM) / (1 + nEffTM), 2);
  const tTM = 1 - rTM;

  return (
    <div className="bg-[#0E1528] border border-cyan-500/20 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              GD-Calc & Lumerical Sub-λ RCWA / EMT Solver
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                Rigorous Wave
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Rigorous Coupled-Wave Analysis & 0th-order Effective Medium Theory for subwavelength dielectric gratings
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setPitchNm(380);
            setDutyCycle(0.5);
            setNRidge(2.45);
            setNSub(1.46);
            setWavelengthNm(632.8);
            setIncidentAngleDeg(0);
          }}
          className="text-xs text-slate-400 hover:text-cyan-400 p-1.5 hover:bg-white/5 rounded transition-colors"
          title="Reset Defaults"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Controls */}
        <div className="space-y-3 bg-[#0A0E1A] p-4 rounded-lg border border-white/5">
          <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Grating Geometry & Materials
          </h4>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Grating Pitch (Λ):</span>
              <span className="font-mono text-cyan-300 font-semibold">{pitchNm} nm</span>
            </div>
            <input
              type="range"
              min="100"
              max="1200"
              step="10"
              value={pitchNm}
              onChange={(e) => setPitchNm(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Duty Cycle / Fill Fraction (f):</span>
              <span className="font-mono text-cyan-300 font-semibold">{dutyCycle.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={dutyCycle}
              onChange={(e) => setDutyCycle(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Ridge Index (n_ridge)</label>
              <input
                type="number"
                min="1.0"
                max="4.0"
                step="0.05"
                value={nRidge}
                onChange={(e) => setNRidge(parseFloat(e.target.value) || 1.0)}
                className="w-full bg-[#16203A] border border-white/10 rounded px-2.5 py-1 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Substrate (n_sub)</label>
              <input
                type="number"
                min="1.0"
                max="3.5"
                step="0.05"
                value={nSub}
                onChange={(e) => setNSub(parseFloat(e.target.value) || 1.0)}
                className="w-full bg-[#16203A] border border-white/10 rounded px-2.5 py-1 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Wavelength (λ nm)</label>
              <input
                type="number"
                min="350"
                max="1600"
                step="1"
                value={wavelengthNm}
                onChange={(e) => setWavelengthNm(parseFloat(e.target.value) || 350)}
                className="w-full bg-[#16203A] border border-white/10 rounded px-2.5 py-1 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Incidence Angle (°)</label>
              <input
                type="number"
                min="0"
                max="80"
                step="1"
                value={incidentAngleDeg}
                onChange={(e) => setIncidentAngleDeg(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#16203A] border border-white/10 rounded px-2.5 py-1 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Results & EMT Calculations */}
        <div className="space-y-3 bg-[#0A0E1A] p-4 rounded-lg border border-white/5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Activity className="w-3.5 h-3.5" /> Effective Medium & Regimes
            </h4>

            {/* Regime badge */}
            <div
              className={`p-2.5 rounded-lg border text-xs mb-3 ${
                isSubwavelength
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              }`}
            >
              <div className="font-semibold flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${isSubwavelength ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}
                />
                {isSubwavelength ? 'Subwavelength Regime (Zero Order Only)' : 'Diffraction Regime (Higher Orders Propagate)'}
              </div>
              <p className="text-[11px] mt-1 text-slate-300 font-mono">
                Cutoff Pitch: Λ_crit = λ / max(n) = {cutoffPitch.toFixed(1)} nm
                {isSubwavelength
                  ? ` (Λ = ${pitchNm} nm < ${cutoffPitch.toFixed(1)} nm: All higher diffracted orders are evanescent)`
                  : ` (Λ = ${pitchNm} nm ≥ ${cutoffPitch.toFixed(1)} nm: Multiple diffracted beams emerge)`}
              </p>
            </div>

            {/* EMT Indices */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2 bg-[#16203A]/60 rounded border border-white/5">
                <span className="text-[11px] text-slate-400 block">n_TE (Ordinary):</span>
                <span className="text-cyan-300 text-sm font-bold">{nEffTE.toFixed(4)}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">T_TE ≈ {(tTE * 100).toFixed(1)}%</span>
              </div>
              <div className="p-2 bg-[#16203A]/60 rounded border border-white/5">
                <span className="text-[11px] text-slate-400 block">n_TM (Extraordinary):</span>
                <span className="text-cyan-300 text-sm font-bold">{nEffTM.toFixed(4)}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">T_TM ≈ {(tTM * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="mt-3 p-2 bg-[#16203A]/40 rounded border border-white/5 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Form Birefringence (Δn = n_TE - n_TM):</span>
                <span className="text-amber-300 font-bold">+{deltaN.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px] mt-1">
                <span>Phase Retardance per μm thickness:</span>
                <span className="text-slate-200">{((2 * Math.PI * deltaN * 1000) / wavelengthNm).toFixed(2)} rad/μm</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-2 border-t border-white/5">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              In GD-Calc and Lumerical FDTD/RCWA, Maxwell's curl equations are resolved using Fourier harmonics. When
              Λ &lt;&lt; λ, the grating acts as an artificial uniaxial anisotropic crystal without scattering.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
