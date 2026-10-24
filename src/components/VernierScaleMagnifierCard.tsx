import React, { useRef, useEffect } from 'react';
import { useDiffractionLab } from '../context/DiffractionLabContext';

export const VernierScaleMagnifierCard: React.FC = () => {
  const { uiState, vernierWindowA, vernierWindowB } = useDiffractionLab();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const midY = h * 0.48;

    // Backgrounds: Upper half = Main Scale, Lower half = Vernier
    ctx.fillStyle = '#111B30';
    ctx.fillRect(0, 0, w, midY);

    ctx.fillStyle = '#0A1120';
    ctx.fillRect(0, midY, w, h - midY);

    // Dividing line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    const absDeg = Math.abs(uiState.telescopeAngleDeg);
    const baseDeg = Math.floor(absDeg);
    const pxPerHalfDeg = w / 12;
    const zeroVernierX = w * 0.22;

    const fractionalHalfDeg = (absDeg - baseDeg) * 2;

    // Main Scale Ticks (Every 0.5° = 30′)
    ctx.fillStyle = '#F1F5F9';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';

    for (let i = -3; i <= 12; i++) {
      const tickHalfDeg = i;
      const tickDegVal = baseDeg + tickHalfDeg * 0.5;
      if (tickDegVal >= 0) {
        const x = zeroVernierX + (tickHalfDeg - fractionalHalfDeg) * pxPerHalfDeg;
        if (x >= 4 && x <= w - 4) {
          const isFullDegree = tickHalfDeg % 2 === 0;
          const tickH = isFullDegree ? 18 : 11;

          ctx.strokeStyle = '#F1F5F9';
          ctx.lineWidth = isFullDegree ? 2 : 1.2;
          ctx.beginPath();
          ctx.moveTo(x, midY - tickH);
          ctx.lineTo(x, midY);
          ctx.stroke();

          if (isFullDegree) {
            ctx.fillText(`${Math.floor(tickDegVal)}°`, x, 14);
          }
        }
      }
    }

    // Vernier Scale Ticks
    const maxVsd = uiState.vernierDivisions;
    const vsdStepPx = (pxPerHalfDeg * (29 / 30)) / (maxVsd === 60 ? 6.4 : 3.2);
    const stepInc = maxVsd === 60 ? 4 : 2;

    for (let v = 0; v <= maxVsd; v += stepInc) {
      const vx = zeroVernierX + v * vsdStepPx;
      if (vx >= 6 && vx <= w - 6) {
        const isCoincident = Math.abs(v - vernierWindowA.vernierCoincidence) <= stepInc / 2;
        const isMajor = v % 10 === 0;
        const tickH = isMajor ? 18 : 11;

        ctx.strokeStyle = isCoincident ? '#FBBF24' : '#38BDF8';
        ctx.lineWidth = isCoincident ? 2.6 : 1.3;
        ctx.beginPath();
        ctx.moveTo(vx, midY);
        ctx.lineTo(vx, midY + tickH);
        ctx.stroke();

        if (isMajor) {
          ctx.fillStyle = isCoincident ? '#FBBF24' : '#38BDF8';
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillText(`${v}`, vx, midY + 28);
        }
      }
    }
  }, [uiState, vernierWindowA]);

  return (
    <div className="w-full rounded-2xl bg-[#0E1528] border border-[#283963] p-4 space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider">
          Magnified Vernier Scale (Vernier V₁ & V₂)
        </span>
        <span className="text-sm font-mono font-bold text-[#FBBF24]">
          V₁ = {vernierWindowA.formattedDMS}
        </span>
      </div>

      <div className="w-full rounded-xl overflow-hidden border border-[#24345A] bg-[#060A14] select-none">
        <canvas ref={canvasRef} width={800} height={96} className="w-full h-[96px] block" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="bg-[#16203A] rounded-xl px-3 py-2 border border-[#283963]/60 flex flex-col">
          <span className="text-[11px] font-mono text-[#64748B] uppercase">MSR (Main Scale)</span>
          <span className="text-sm font-mono font-bold text-[#38BDF8] mt-0.5">
            {vernierWindowA.mainScaleDeg.toFixed(1)}°
          </span>
        </div>

        <div className="bg-[#16203A] rounded-xl px-3 py-2 border border-[#283963]/60 flex flex-col">
          <span className="text-[11px] font-mono text-[#64748B] uppercase">VSC × LC</span>
          <span className="text-sm font-mono font-bold text-[#FBBF24] mt-0.5">
            {vernierWindowA.vernierCoincidence} × {uiState.vernierDivisions === 60 ? '30″' : '1′'}
          </span>
        </div>

        <div className="bg-[#16203A] rounded-xl px-3 py-2 border border-[#283963]/60 flex flex-col">
          <span className="text-[11px] font-mono text-[#64748B] uppercase">Vernier V₂ (+180°)</span>
          <span className="text-sm font-mono font-bold text-[#34D399] mt-0.5">
            {vernierWindowB.formattedDMS}
          </span>
        </div>
      </div>
    </div>
  );
};
