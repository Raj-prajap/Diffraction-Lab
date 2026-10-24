import React, { useState, useRef, useEffect } from 'react';
import { CircleDot, Eye, Compass, RefreshCw } from 'lucide-react';

export const NewtonsRingsCard: React.FC = () => {
  const [wavelengthNm, setWavelengthNm] = useState<number>(589.3); // Sodium doublet mean
  const [radiusR, setRadiusR] = useState<number>(100); // Plano-convex lens radius in cm
  const [mediumMu, setMediumMu] = useState<number>(1.0); // Air = 1.0, Water = 1.33
  const [microscopeX, setMicroscopeX] = useState<number>(0); // mm from center (-6 to +6)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute ring diameters: D_n = sqrt(4 * n * R * lambda / mu)
  // R in cm, lambda in cm: lambda_cm = lambda_nm * 1e-7
  const rCm = radiusR;
  const lambdaCm = wavelengthNm * 1e-7;

  // Let's compute first 12 dark rings
  const ringData = Array.from({ length: 8 }, (_, i) => {
    const n = i + 1;
    const dCm = Math.sqrt((4 * n * rCm * lambdaCm) / mediumMu);
    const dMm = dCm * 10;
    const radiusMm = dMm / 2;
    return { n, dMm, radiusMm };
  });

  // Calculation for p = 4 (e.g. Ring 8 and Ring 4)
  const ring8 = ringData[7]?.dMm || 0;
  const ring4 = ringData[3]?.dMm || 0;
  const diffD2 = Math.pow(ring8, 2) - Math.pow(ring4, 2); // mm^2
  // lambda = diffD2 / (4 * p * R) in mm -> * 1e6 for nm
  const calculatedLambdaNm = (diffD2 / (4 * 4 * (rCm * 10))) * 1e6;

  // Render Newton's rings on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    // Background
    ctx.fillStyle = '#060A14';
    ctx.fillRect(0, 0, width, height);

    // Coordinate scale: 1 mm = (width * 0.4) / 6 mm
    const pxPerMm = (width * 0.42) / 6;

    // Center dark spot (phase shift pi on reflection from denser glass)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
    ctx.fill();

    // Render concentric rings
    ringData.forEach(({ n, radiusMm }) => {
      const rPx = radiusMm * pxPerMm;

      // Bright ring halfway between
      const brightRPx = Math.sqrt(((4 * (n - 0.5) * rCm * lambdaCm) / mediumMu)) * 10 * pxPerMm;

      ctx.strokeStyle = '#FACC15'; // Sodium yellow fringe
      ctx.lineWidth = Math.max(1, 4 / Math.sqrt(n));
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(cx, cy, brightRPx, 0, 2 * Math.PI);
      ctx.stroke();

      // Dark fringe
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = Math.max(1.5, 5 / Math.sqrt(n));
      ctx.globalAlpha = 1.0;
      ctx.beginPath();
      ctx.arc(cx, cy, rPx, 0, 2 * Math.PI);
      ctx.stroke();
    });

    // Traveling microscope crosshair
    const crossX = cx + microscopeX * pxPerMm;
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(crossX, 0);
    ctx.lineTo(crossX, height);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Eyepiece circular aperture mask
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, width / 2 - 6, 0, 2 * Math.PI);
    ctx.stroke();
  }, [wavelengthNm, radiusR, mediumMu, microscopeX]);

  return (
    <div className="bg-[#0E1528] border border-amber-500/20 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <CircleDot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              Newton's Rings & Traveling Microscope Simulator
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/50">
                PH3001 Core Exp
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interference in thin wedge air/liquid film between plano-convex lens and glass plate
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setWavelengthNm(589.3);
            setRadiusR(100);
            setMediumMu(1.0);
            setMicroscopeX(0);
          }}
          className="text-xs text-slate-400 hover:text-amber-400 p-1.5 hover:bg-white/5 rounded transition-colors"
          title="Reset Defaults"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Canvas Eyepiece */}
        <div className="lg:col-span-5 flex flex-col items-center bg-[#070B16] p-4 rounded-xl border border-white/5">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Eyepiece Field of View
            </span>
            <span className="text-xs font-mono text-cyan-300">
              Crosshair: {microscopeX >= 0 ? `+${microscopeX.toFixed(2)}` : microscopeX.toFixed(2)} mm
            </span>
          </div>

          <div className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-amber-500/40 shadow-inner">
            <canvas ref={canvasRef} width={256} height={256} className="w-full h-full cursor-crosshair" />
          </div>

          {/* Traveling microscope traverse slider */}
          <div className="w-full mt-4 space-y-1">
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>Left -6 mm</span>
              <span className="text-amber-400 font-semibold">Traverse Crosshair</span>
              <span>Right +6 mm</span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="0.05"
              value={microscopeX}
              onChange={(e) => setMicroscopeX(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        {/* Controls & Math Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-3 gap-3 bg-[#0A0E1A] p-3 rounded-lg border border-white/5">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Source (λ nm)</label>
              <input
                type="number"
                min="400"
                max="750"
                step="1"
                value={wavelengthNm}
                onChange={(e) => setWavelengthNm(parseFloat(e.target.value) || 589.3)}
                className="w-full bg-[#16203A] border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Lens Radius R (cm)</label>
              <input
                type="number"
                min="20"
                max="250"
                step="5"
                value={radiusR}
                onChange={(e) => setRadiusR(parseFloat(e.target.value) || 100)}
                className="w-full bg-[#16203A] border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Film Medium (μ)</label>
              <select
                value={mediumMu}
                onChange={(e) => setMediumMu(parseFloat(e.target.value))}
                className="w-full bg-[#16203A] border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
              >
                <option value={1.0}>Air (μ = 1.000)</option>
                <option value={1.333}>Water (μ = 1.333)</option>
                <option value={1.47}>Glycerol (μ = 1.470)</option>
              </select>
            </div>
          </div>

          {/* Table of Diameters */}
          <div className="bg-[#0A0E1A] p-3 rounded-lg border border-white/5">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" /> Ring Diameters: D_n² = 4nRλ / μ
            </h4>
            <div className="max-h-36 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="pb-1">Order (n)</th>
                    <th className="pb-1">Diameter (D_n mm)</th>
                    <th className="pb-1">Radius (r_n mm)</th>
                    <th className="pb-1">D_n² (mm²)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {ringData.map(({ n, dMm, radiusMm }) => (
                    <tr key={n} className="hover:bg-white/5">
                      <td className="py-1 text-amber-400 font-semibold">{n}</td>
                      <td className="py-1 text-cyan-300">{dMm.toFixed(3)}</td>
                      <td className="py-1 text-slate-300">{radiusMm.toFixed(3)}</td>
                      <td className="py-1 text-emerald-300">{Math.pow(dMm, 2).toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Calculated wavelength confirmation */}
          <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[11px]">Calculated λ via (D₈² - D₄²) / (4 · 4 · R):</span>
              <span className="text-amber-300 font-bold text-sm">{calculatedLambdaNm.toFixed(1)} nm</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Theoretical Input λ:</span>
              <span className="text-emerald-400 font-bold">{wavelengthNm} nm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
