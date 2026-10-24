import React, { useState, useRef, useEffect } from 'react';
import { Sliders, RefreshCw, CheckCircle2 } from 'lucide-react';

export const ScrewGaugeCard: React.FC = () => {
  const [pitchMm, setPitchMm] = useState<number>(1.0); // 1.0 mm pitch
  const [csDivisions, setCsDivisions] = useState<number>(100); // 100 divisions
  const [targetMm, setTargetMm] = useState<number>(3.64); // Interactive target dimension to read
  const [zeroErrorDiv, setZeroErrorDiv] = useState<number>(2); // +2 divisions zero error
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Least count: LC = Pitch / CS divisions
  const lcMm = pitchMm / csDivisions;

  // Breakdown targetMm:
  // PSR = Math.floor(targetMm / pitchMm) * pitchMm
  const psrMm = Math.floor(targetMm / pitchMm) * pitchMm;
  const remainderMm = targetMm - psrMm;
  const hsrDiv = Math.round(remainderMm / lcMm);
  const totalObserved = psrMm + hsrDiv * lcMm;
  const correctedMm = totalObserved - zeroErrorDiv * lcMm;

  // Render Micrometer / Screw Gauge Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.fillStyle = '#070B16';
    ctx.fillRect(0, 0, width, height);

    const cy = height / 2;

    // Sleeve barrel (fixed cylinder)
    const sleeveWidth = 240;
    const sleeveHeight = 50;
    const sleeveStartX = 40;

    ctx.fillStyle = '#1E293B';
    ctx.fillRect(sleeveStartX, cy - sleeveHeight / 2, sleeveWidth, sleeveHeight);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sleeveStartX, cy - sleeveHeight / 2, sleeveWidth, sleeveHeight);

    // Baseline on sleeve
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sleeveStartX, cy);
    ctx.lineTo(sleeveStartX + sleeveWidth, cy);
    ctx.stroke();

    // Pitch scale graduations (0, 1, 2, 3, 4, 5, 6, 7 mm)
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '10px JetBrains Mono, monospace';
    const pxPerMm = 18;

    for (let m = 0; m <= 10; m++) {
      const gx = sleeveStartX + 20 + m * pxPerMm;
      if (gx < sleeveStartX + sleeveWidth - 10) {
        // Upper main marks (0, 1, 2, 3...)
        ctx.beginPath();
        ctx.moveTo(gx, cy);
        ctx.lineTo(gx, cy - 14);
        ctx.stroke();

        ctx.fillText(m.toString(), gx - 3, cy - 18);

        // Half mm marks if pitch is 0.5 or for sub-divisions
        const halfGx = gx + pxPerMm / 2;
        ctx.beginPath();
        ctx.moveTo(halfGx, cy);
        ctx.lineTo(halfGx, cy + 10);
        ctx.stroke();
      }
    }

    // Rotating Thimble (movable bevel cylinder)
    const thimbleX = sleeveStartX + 20 + targetMm * pxPerMm;
    const thimbleWidth = 140;
    const thimbleHeight = 70;

    // Bevel front
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(thimbleX, cy - thimbleHeight / 2);
    ctx.lineTo(thimbleX + 20, cy - sleeveHeight / 2);
    ctx.lineTo(thimbleX + thimbleWidth, cy - sleeveHeight / 2);
    ctx.lineTo(thimbleX + thimbleWidth, cy + sleeveHeight / 2);
    ctx.lineTo(thimbleX + 20, cy + thimbleHeight / 2);
    ctx.lineTo(thimbleX, cy + thimbleHeight / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#64748B';
    ctx.stroke();

    // Circular scale markings on thimble bevel
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.strokeStyle = '#F8FAFC';

    // Show circular scale divisions revolving around baseline
    for (let d = -10; d <= 10; d++) {
      const markDiv = (hsrDiv + d + csDivisions) % csDivisions;
      const my = cy - d * 5;

      if (my >= cy - thimbleHeight / 2 + 5 && my <= cy + thimbleHeight / 2 - 5) {
        ctx.beginPath();
        ctx.moveTo(thimbleX, my);
        ctx.lineTo(thimbleX + (markDiv % 5 === 0 ? 10 : 5), my);
        ctx.stroke();

        if (markDiv % 5 === 0) {
          ctx.fillText(markDiv.toString(), thimbleX + 12, my + 3);
        }
      }
    }

    // Coincidence highlight on baseline
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(thimbleX - 5, cy);
    ctx.lineTo(thimbleX + 15, cy);
    ctx.stroke();
  }, [pitchMm, csDivisions, targetMm, hsrDiv]);

  return (
    <div className="bg-[#0E1528] border border-cyan-500/20 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              Screw Gauge (Micrometer) & Vernier LC Simulator
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                Foundational Instrument
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive sleeve & thimble with Least Count (LC), Pitch Scale (PSR), Head Scale (HSC), and Zero Correction
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setPitchMm(1.0);
            setCsDivisions(100);
            setTargetMm(3.64);
            setZeroErrorDiv(2);
          }}
          className="text-xs text-slate-400 hover:text-cyan-400 p-1.5 hover:bg-white/5 rounded transition-colors"
          title="Reset Defaults"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-[#070B16] p-4 rounded-xl border border-white/5 flex flex-col justify-between">
          <canvas ref={canvasRef} width={440} height={180} className="w-full h-40 rounded-lg bg-[#070B16]" />

          {/* Draggable reading thimble */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Rotate Thimble / Adjust Thickness:</span>
              <span className="font-mono text-cyan-300 font-semibold">{targetMm.toFixed(2)} mm</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="8.0"
              step="0.01"
              value={targetMm}
              onChange={(e) => setTargetMm(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* Readout Breakdown */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-3 bg-[#0A0E1A] rounded-lg border border-white/5 font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Screw Pitch:</span>
              <span className="text-white font-bold">{pitchMm.toFixed(1)} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Circular Scale Divisions:</span>
              <span className="text-white font-bold">{csDivisions}</span>
            </div>
            <div className="flex justify-between text-cyan-300 font-semibold">
              <span>Least Count (LC = Pitch / N):</span>
              <span>{lcMm.toFixed(3)} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pitch Scale Reading (PSR):</span>
              <span className="text-amber-300 font-bold">{psrMm.toFixed(1)} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Circular Scale Reading (HSR):</span>
              <span className="text-purple-300 font-bold">{hsrDiv} div</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Observed Total (PSR + HSR×LC):</span>
              <span className="text-slate-200">{totalObserved.toFixed(3)} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Zero Error Correction (±ZC):</span>
              <span className="text-slate-400">{(zeroErrorDiv * lcMm).toFixed(3)} mm</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10 text-emerald-300 font-bold text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> True Thickness:
              </span>
              <span>{correctedMm.toFixed(3)} mm</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setTargetMm(0.14)}
              className="py-1.5 px-2 bg-[#16203A] hover:bg-[#1C294A] text-slate-300 rounded border border-white/5 text-center font-mono"
            >
              Thin Wire (0.14 mm)
            </button>
            <button
              onClick={() => setTargetMm(1.22)}
              className="py-1.5 px-2 bg-[#16203A] hover:bg-[#1C294A] text-slate-300 rounded border border-white/5 text-center font-mono"
            >
              Glass Plate (1.22 mm)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
