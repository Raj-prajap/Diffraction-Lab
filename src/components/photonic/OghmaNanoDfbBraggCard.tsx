import React, { useState } from 'react';
import { Layers, Radio, RefreshCw, BarChart2 } from 'lucide-react';

export const OghmaNanoDfbBraggCard: React.FC = () => {
  const [lambdaBNm, setLambdaBNm] = useState<number>(1550); // Target Bragg wavelength
  const [nEff, setNEff] = useState<number>(3.25); // Effective index (InP / GaAs / Silicon)
  const [deltaN, setDeltaN] = useState<number>(0.025); // Index modulation depth
  const [gratingLengthUm, setGratingLengthUm] = useState<number>(450); // Cavity length in um
  const [orderM, setOrderM] = useState<number>(1); // Grating order

  // Bragg grating period: Lambda = m * lambda_B / (2 * n_eff)
  const pitchNm = (orderM * lambdaBNm) / (2 * nEff);

  // Coupling coefficient kappa = (pi * deltaN) / lambda_B (in 1/um)
  const kappaPerUm = (Math.PI * deltaN) / (lambdaBNm * 1e-3);
  const kappaL = kappaPerUm * gratingLengthUm;

  // Maximum peak reflectivity: R_max = tanh^2(kappa * L)
  const maxReflectivity = Math.pow(Math.tanh(kappaL), 2);

  // Stopband bandwidth: Delta lambda = (lambda_B^2 / (pi * n_eff)) * sqrt(kappa^2 + (pi / L)^2)
  const stopbandNm =
    (Math.pow(lambdaBNm, 2) / (Math.PI * nEff)) *
    Math.sqrt(Math.pow(kappaPerUm * 1e-3, 2) + Math.pow(Math.PI / gratingLengthUm, 2));

  return (
    <div className="bg-[#0E1528] border border-purple-500/20 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              DFB Fiber / Waveguide Bragg Grating (FBG) CAD
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700/50">
                TMM & Stopband
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Transfer Matrix Method & Coupled Mode Theory (CMT) for distributed feedback laser & telecom gratings
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setLambdaBNm(1550);
            setNEff(3.25);
            setDeltaN(0.025);
            setGratingLengthUm(450);
            setOrderM(1);
          }}
          className="text-xs text-slate-400 hover:text-purple-400 p-1.5 hover:bg-white/5 rounded transition-colors"
          title="Reset Defaults"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Controls */}
        <div className="space-y-3 bg-[#0A0E1A] p-4 rounded-lg border border-white/5">
          <h4 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Grating & Cavity Parameters
          </h4>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Target Bragg Wavelength (λ_B):</span>
              <span className="font-mono text-purple-300 font-semibold">{lambdaBNm} nm</span>
            </div>
            <input
              type="range"
              min="800"
              max="2000"
              step="5"
              value={lambdaBNm}
              onChange={(e) => setLambdaBNm(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Effective Index (n_eff)</label>
              <input
                type="number"
                min="1.4"
                max="4.0"
                step="0.05"
                value={nEff}
                onChange={(e) => setNEff(parseFloat(e.target.value) || 1.4)}
                className="w-full bg-[#16203A] border border-white/10 rounded px-2.5 py-1 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Index Modulation (Δn)</label>
              <input
                type="number"
                min="0.001"
                max="0.2"
                step="0.005"
                value={deltaN}
                onChange={(e) => setDeltaN(parseFloat(e.target.value) || 0.001)}
                className="w-full bg-[#16203A] border border-white/10 rounded px-2.5 py-1 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Grating Section Length (L):</span>
              <span className="font-mono text-purple-300 font-semibold">{gratingLengthUm} μm</span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="25"
              value={gratingLengthUm}
              onChange={(e) => setGratingLengthUm(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Diffraction Order (m)</label>
            <div className="flex gap-2">
              {[1, 2, 3].map((order) => (
                <button
                  key={order}
                  onClick={() => setOrderM(order)}
                  className={`flex-1 py-1 text-xs font-mono rounded border transition-colors ${
                    orderM === order
                      ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                      : 'bg-[#16203A] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Order {order}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Outputs */}
        <div className="space-y-3 bg-[#0A0E1A] p-4 rounded-lg border border-white/5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <BarChart2 className="w-3.5 h-3.5" /> Spectral Response & Coupling
            </h4>

            <div className="p-3 bg-[#16203A]/60 rounded-lg border border-white/5 space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Required Bragg Pitch (Λ):</span>
                <span className="text-cyan-300 font-bold text-sm">{pitchNm.toFixed(2)} nm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coupling Coefficient (κ):</span>
                <span className="text-purple-300 font-bold">{kappaPerUm.toFixed(4)} μm⁻¹</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coupling Strength (κ · L):</span>
                <span className="text-amber-300 font-bold">{kappaL.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stopband FWHM (Δλ_stop):</span>
                <span className="text-emerald-300 font-bold">{stopbandNm.toFixed(3)} nm</span>
              </div>
            </div>

            {/* Peak reflectivity bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Peak Bragg Reflectivity (R_max):</span>
                <span className="text-emerald-400 font-bold">{(maxReflectivity * 100).toFixed(2)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, maxReflectivity * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-mono block mt-1">
                Transmissivity: {((1 - maxReflectivity) * 100).toFixed(4)}% | Extinction Ratio:{' '}
                {(-10 * Math.log10(Math.max(1e-6, 1 - maxReflectivity))).toFixed(1)} dB
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-white/5">
            Coupling product κL &gt; 3 ensures high reflectivity (&gt;99%) suitable for laser cavity mirrors or dense
            wavelength-division multiplexing (DWDM) telecom filters.
          </div>
        </div>
      </div>
    </div>
  );
};
