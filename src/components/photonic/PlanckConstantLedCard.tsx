import React, { useState } from 'react';
import { Activity, RefreshCw } from 'lucide-react';

interface LedData {
  id: string;
  name: string;
  colorHex: string;
  lambdaNm: number;
  v0: number; // Knee-point voltage in Volts
}

const DEFAULT_LEDS: LedData[] = [
  { id: 'ir', name: 'Infrared LED', colorHex: '#7F1D1D', lambdaNm: 940, v0: 1.25 },
  { id: 'red', name: 'Red LED', colorHex: '#EF4444', lambdaNm: 650, v0: 1.82 },
  { id: 'orange', name: 'Amber LED', colorHex: '#F97316', lambdaNm: 605, v0: 1.98 },
  { id: 'yellow', name: 'Yellow LED', colorHex: '#EAB308', lambdaNm: 585, v0: 2.05 },
  { id: 'green', name: 'Green LED', colorHex: '#10B981', lambdaNm: 525, v0: 2.28 },
  { id: 'blue', name: 'Blue LED', colorHex: '#3B82F6', lambdaNm: 470, v0: 2.56 },
];

export const PlanckConstantLedCard: React.FC = () => {
  const [leds, setLeds] = useState<LedData[]>(DEFAULT_LEDS);
  const c = 2.99792458e8; // speed of light m/s
  const eCharge = 1.602176634e-19; // electron charge in Coulombs
  const hTrue = 6.62607015e-34; // true Planck's constant J*s

  // Compute frequencies: nu = c / (lambda * 1e-9) in 10^14 Hz
  const points = leds.map((led) => {
    const nu = c / (led.lambdaNm * 1e-9); // Hz
    return {
      ...led,
      nu,
      nu14: nu / 1e14, // in units of 10^14 Hz
    };
  });

  // Linear regression of V0 vs nu: V0 = m * nu + c_intercept
  // m = Sum((nu - meanNu)(V0 - meanV0)) / Sum((nu - meanNu)^2)
  const meanNu = points.reduce((acc, p) => acc + p.nu, 0) / points.length;
  const meanV0 = points.reduce((acc, p) => acc + p.v0, 0) / points.length;

  let num = 0;
  let den = 0;
  points.forEach((p) => {
    num += (p.nu - meanNu) * (p.v0 - meanV0);
    den += Math.pow(p.nu - meanNu, 2);
  });

  const slope = den !== 0 ? num / den : 0; // in Volts / Hz = V * s
  // h = e * slope
  const calculatedH = slope * eCharge;
  const errorPercent = Math.abs((calculatedH - hTrue) / hTrue) * 100;

  const handleVoltageChange = (id: string, newV0: number) => {
    setLeds((prev) => prev.map((l) => (l.id === id ? { ...l, v0: newV0 } : l)));
  };

  return (
    <div className="bg-[#0E1528] border border-emerald-500/20 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              Planck's Constant (h) via Multi-Wavelength LED V-I
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                Quantum Optics
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Photoelectric bandgap threshold voltage (eV₀ = hν - Φ) and linear slope analysis
            </p>
          </div>
        </div>
        <button
          onClick={() => setLeds(DEFAULT_LEDS)}
          className="text-xs text-slate-400 hover:text-emerald-400 p-1.5 hover:bg-white/5 rounded transition-colors"
          title="Reset Defaults"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Table of LEDs and threshold voltage sliders */}
        <div className="lg:col-span-7 space-y-2 bg-[#0A0E1A] p-4 rounded-xl border border-white/5">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase mb-2">
            LED Knee-Point Turn-On Voltages (V₀)
          </h4>
          <div className="space-y-2">
            {points.map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-[#16203A]/60 p-2 rounded-lg border border-white/5">
                <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: p.colorHex }} />
                <div className="w-28">
                  <div className="text-xs font-semibold text-white truncate">{p.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">{p.lambdaNm} nm</div>
                </div>
                <div className="text-xs font-mono text-slate-300 w-24">ν = {p.nu14.toFixed(2)}×10¹⁴ Hz</div>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="range"
                    min="1.0"
                    max="3.5"
                    step="0.01"
                    value={p.v0}
                    onChange={(e) => handleVoltageChange(p.id, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <span className="text-xs font-mono text-emerald-300 font-bold w-12 text-right">
                    {p.v0.toFixed(2)} V
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results & Linear Regression */}
        <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
          <div className="bg-[#0A0E1A] p-4 rounded-xl border border-white/5 space-y-3 font-mono text-xs">
            <h4 className="font-bold text-amber-400 uppercase text-xs flex items-center gap-1.5">
              Linear Regression: V₀ = (h/e)·ν - Φ/e
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Slope (dV₀/dν):</span>
                <span className="text-cyan-300 font-bold">{slope.toExponential(4)} V·s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Experimental h (e · slope):</span>
                <span className="text-emerald-300 font-bold text-sm">{calculatedH.toExponential(4)} J·s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CODATA Value (h_true):</span>
                <span className="text-slate-300">{hTrue.toExponential(4)} J·s</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/5">
                <span className="text-slate-300">Percentage Deviation:</span>
                <span className={`font-bold ${errorPercent < 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {errorPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-[11px] text-slate-300">
            By determining the knee-point voltage where the forward current sharply rises above zero, students isolate
            the semiconductor bandgap energy $E_g \approx e V_0 \approx h \nu$.
          </div>
        </div>
      </div>
    </div>
  );
};
