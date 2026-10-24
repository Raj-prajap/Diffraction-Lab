import React, { useState, useRef, useEffect } from 'react';
import { Target, RefreshCw, Zap } from 'lucide-react';

export const OpticalFiberNaCard: React.FC = () => {
  const [nCore, setNCore] = useState<number>(1.48); // Silica core
  const [nClad, setNClad] = useState<number>(1.46); // Cladding
  const [screenDistCm, setScreenDistCm] = useState<number>(5.0); // Distance D in cm
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Theoretical NA = sqrt(n1^2 - n2^2)
  const theoreticalNA = Math.sqrt(Math.max(0, Math.pow(nCore, 2) - Math.pow(nClad, 2)));
  const acceptanceAngleRad = Math.asin(Math.min(1, theoreticalNA));
  const acceptanceAngleDeg = (acceptanceAngleRad * 180) / Math.PI;

  // Emerging cone diameter on screen: W = 2 * D * tan(acceptanceAngle)
  const spotDiameterCm = 2 * screenDistCm * Math.tan(acceptanceAngleRad);

  // Experimental NA reconstructed from W and D: NA = W / sqrt(4D^2 + W^2)
  const experimentalNA = spotDiameterCm / Math.sqrt(4 * Math.pow(screenDistCm, 2) + Math.pow(spotDiameterCm, 2));

  // Critical angle for TIR inside fiber: theta_c = arcsin(n2 / n1)
  const criticalAngleDeg = (Math.asin(nClad / nCore) * 180) / Math.PI;

  // Canvas visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#060A14';
    ctx.fillRect(0, 0, width, height);

    const fiberStartX = 20;
    const fiberEndX = width * 0.38;
    const cy = height / 2;
    const fiberRadius = 18;

    // Cladding
    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.fillRect(fiberStartX, cy - fiberRadius - 8, fiberEndX - fiberStartX, (fiberRadius + 8) * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.strokeRect(fiberStartX, cy - fiberRadius - 8, fiberEndX - fiberStartX, (fiberRadius + 8) * 2);

    // Core
    ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
    ctx.fillRect(fiberStartX, cy - fiberRadius, fiberEndX - fiberStartX, fiberRadius * 2);
    ctx.strokeStyle = '#A855F7';
    ctx.strokeRect(fiberStartX, cy - fiberRadius, fiberEndX - fiberStartX, fiberRadius * 2);

    // Zig-zag ray inside fiber showing TIR
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fiberStartX, cy);
    ctx.lineTo(fiberStartX + 30, cy - fiberRadius + 2);
    ctx.lineTo(fiberStartX + 65, cy + fiberRadius - 2);
    ctx.lineTo(fiberStartX + 100, cy - fiberRadius + 2);
    ctx.lineTo(fiberEndX, cy);
    ctx.stroke();

    // Diverging light cone from fiber tip
    const screenX = fiberEndX + (width * 0.52 * screenDistCm) / 10;
    const coneRadiusPx = Math.min(height * 0.45, (spotDiameterCm * 15 * width) / 400);

    const gradient = ctx.createRadialGradient(screenX, cy, 5, screenX, cy, coneRadiusPx);
    gradient.addColorStop(0, 'rgba(244, 63, 94, 0.85)');
    gradient.addColorStop(0.7, 'rgba(244, 63, 94, 0.3)');
    gradient.addColorStop(1, 'rgba(244, 63, 94, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(fiberEndX, cy);
    ctx.lineTo(screenX, cy - coneRadiusPx);
    ctx.lineTo(screenX, cy + coneRadiusPx);
    ctx.closePath();
    ctx.fill();

    // Screen line
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(screenX, 20);
    ctx.lineTo(screenX, height - 20);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('Optical Fiber', fiberStartX + 10, cy - fiberRadius - 12);
    ctx.fillText(`D = ${screenDistCm.toFixed(1)} cm`, (fiberEndX + screenX) / 2 - 25, height - 15);
    ctx.fillText(`W = ${spotDiameterCm.toFixed(2)} cm`, screenX + 8, cy);
  }, [nCore, nClad, screenDistCm, spotDiameterCm]);

  return (
    <div className="bg-[#0E1528] border border-rose-500/20 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              Optical Fiber Numerical Aperture (N.A.) & Acceptance Angle
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700/50">
                PH3001 Fiber Optics
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Laser beam emergence cone, acceptance cone, and total internal reflection (TIR)
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setNCore(1.48);
            setNClad(1.46);
            setScreenDistCm(5.0);
          }}
          className="text-xs text-slate-400 hover:text-rose-400 p-1.5 hover:bg-white/5 rounded transition-colors"
          title="Reset Defaults"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 bg-[#070B16] p-4 rounded-xl border border-white/5 flex flex-col justify-between">
          <canvas ref={canvasRef} width={420} height={200} className="w-full h-44 rounded-lg bg-[#060A14]" />
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Fiber-to-Screen Distance (D):</span>
              <span className="font-mono text-rose-300 font-semibold">{screenDistCm.toFixed(1)} cm</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={screenDistCm}
              onChange={(e) => setScreenDistCm(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-3">
          <div className="grid grid-cols-2 gap-3 bg-[#0A0E1A] p-3 rounded-lg border border-white/5">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Core Index (n₁)</label>
              <input
                type="number"
                min="1.42"
                max="1.70"
                step="0.01"
                value={nCore}
                onChange={(e) => setNCore(parseFloat(e.target.value) || 1.48)}
                className="w-full bg-[#16203A] border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Cladding Index (n₂)</label>
              <input
                type="number"
                min="1.40"
                max={nCore - 0.005}
                step="0.01"
                value={nClad}
                onChange={(e) => setNClad(parseFloat(e.target.value) || 1.46)}
                className="w-full bg-[#16203A] border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-[#0A0E1A] rounded-lg border border-white/5 font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Theoretical NA (√(n₁² - n₂²)):</span>
              <span className="text-rose-300 font-bold">{theoreticalNA.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Acceptance Half-Angle (θ_a):</span>
              <span className="text-amber-300 font-bold">{acceptanceAngleDeg.toFixed(2)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Acceptance Cone (2θ_a):</span>
              <span className="text-cyan-300 font-bold">{(2 * acceptanceAngleDeg).toFixed(2)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">TIR Critical Angle (θ_c):</span>
              <span className="text-purple-300 font-bold">{criticalAngleDeg.toFixed(2)}°</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-white/5">
              <span className="text-slate-300">Screen Spot Diameter (W):</span>
              <span className="text-emerald-400 font-bold">{spotDiameterCm.toFixed(2)} cm</span>
            </div>
          </div>

          <div className="p-2.5 bg-rose-950/20 border border-rose-500/30 rounded-lg text-xs font-mono flex justify-between items-center">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-rose-400" /> NA Reconstructed from (W, D):
            </span>
            <span className="text-rose-300 font-bold">{experimentalNA.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
