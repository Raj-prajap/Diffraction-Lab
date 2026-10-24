import React, { useRef, useEffect, useCallback } from 'react';
import { useDiffractionLab } from '../context/DiffractionLabContext';
import { DiffractionPhysics, wavelengthToColor } from '../utils/diffractionPhysics';

const MAX_DISPLAY_ANGLE_DEG = 68;

export const InterferenceFringeScreenStrip: React.FC = () => {
  const {
    uiState,
    setTelescopeAngleDeg,
    activeSpectralLines,
    principalPeaks,
    vernierWindowA,
    heisenbergFirstMinAngleDeg,
  } = useDiffractionLab();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);

  const linearXCm = uiState.screenDistanceM * 100 * Math.tan((uiState.telescopeAngleDeg * Math.PI) / 180);

  const updateAngleFromPointer = useCallback(
    (clientX: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const deg = (frac * 2 - 1) * MAX_DISPLAY_ANGLE_DEG;
      setTelescopeAngleDeg(deg);
    },
    [setTelescopeAngleDeg]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateAngleFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      updateAngleFromPointer(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;

    ctx.fillStyle = '#04060E';
    ctx.fillRect(0, 0, width, height);

    if (!uiState.lampPowerOn) {
      ctx.fillStyle = '#F87171';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('LAMP POWER OFF — SWITCH ON SOURCE TO OBSERVE FRINGES', centerX, height / 2);
      return;
    }

    // Sample continuous vertical stripes across [-68°, +68°]
    const columns = 220;
    const colWidth = width / columns;
    const effectiveSlits = uiState.benchMode === 'DIFFRACTION_GRATING' ? uiState.numSlits : 1;
    const effectiveWidthUm =
      uiState.benchMode === 'WIRE_THICKNESS_LASER'
        ? Math.min(4.0, Math.max(0.6, uiState.wireThicknessMm * 15))
        : uiState.slitWidthUm;

    for (let i = 0; i < columns; i++) {
      const norm = (i + 0.5) / columns;
      const deg = (norm * 2 - 1) * MAX_DISPLAY_ANGLE_DEG;
      const rad = (deg * Math.PI) / 180;

      for (const line of activeSpectralLines) {
        let intensity = 0;
        if (!uiState.isGratingInsertedOnBench) {
          if (Math.abs(deg) < 2.2) {
            intensity = line.relativeIntensity * (1 - Math.abs(deg) / 2.2);
          }
        } else {
          intensity = line.relativeIntensity * DiffractionPhysics.calculateIntensityAtAngle(
            rad,
            line.wavelengthNm,
            uiState.slitSpacingUm,
            effectiveWidthUm,
            effectiveSlits,
            uiState.showEnvelope || uiState.benchMode !== 'DIFFRACTION_GRATING'
          );
        }

        if (intensity > 0.012) {
          const visualAlpha = Math.min(1, Math.max(0, Math.sqrt(intensity) * 0.88));
          ctx.fillStyle = wavelengthToColor(line.wavelengthNm, visualAlpha);
          ctx.fillRect(i * colWidth, 6, colWidth + 1.2, height - 32);
        }
      }
    }

    // Draw sharp principal peak cores & order badges when in Grating Mode
    if (uiState.benchMode === 'DIFFRACTION_GRATING') {
      for (const peak of principalPeaks) {
        if (Math.abs(peak.angleDeg) <= MAX_DISPLAY_ANGLE_DEG) {
          const x = centerX + (peak.angleDeg / MAX_DISPLAY_ANGLE_DEG) * (width / 2);
          const lineCol = wavelengthToColor(peak.spectralLine.wavelengthNm);

          // Soft glow
          const grad = ctx.createLinearGradient(x - 14, 0, x + 14, 0);
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(0.5, wavelengthToColor(peak.spectralLine.wavelengthNm, 0.55 * peak.relativeIntensity));
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(x - 14, 4, 28, height - 28);

          // Core ray
          ctx.strokeStyle = wavelengthToColor(peak.spectralLine.wavelengthNm, 0.4 + 0.6 * peak.relativeIntensity);
          ctx.lineWidth = peak.order === 0 ? 3.5 : 2.5;
          ctx.beginPath();
          ctx.moveTo(x, 4);
          ctx.lineTo(x, height - 24);
          ctx.stroke();

          // Badge
          if (activeSpectralLines.length === 1 || peak.spectralLine.wavelengthNm === 546.1 || peak.order === 0) {
            const labelStr = peak.order > 0 ? `+${peak.order}` : `${peak.order}`;
            ctx.fillStyle = '#F1F5F9';
            ctx.font = 'bold 9px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(labelStr, Math.min(width - 12, Math.max(12, x)), height - 16);
          }
        }
      }
    } else {
      // Single Slit or Wire Diffraction: mark 1st minima (±b)
      const firstMinDeg =
        uiState.benchMode === 'SINGLE_SLIT_HEISENBERG'
          ? heisenbergFirstMinAngleDeg
          : Math.min(45, Math.max(8, 18 / (uiState.wireThicknessMm * 10)));

      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([5, 5]);
      for (const sign of [-1, 1]) {
        const mx = centerX + ((sign * firstMinDeg) / MAX_DISPLAY_ANGLE_DEG) * (width / 2);
        ctx.beginPath();
        ctx.moveTo(mx, 4);
        ctx.lineTo(mx, height - 24);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Ruler along bottom edge
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - 6);
    ctx.lineTo(width, height - 6);
    ctx.stroke();

    for (let t = -6; t <= 6; t++) {
      const tx = centerX + (t / 6) * (width * 0.46);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = t === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(tx, height - 12);
      ctx.lineTo(tx, height - 4);
      ctx.stroke();
    }

    // Active crosshair cursor
    const cursorX = Math.min(width - 4, Math.max(4, centerX + (uiState.telescopeAngleDeg / MAX_DISPLAY_ANGLE_DEG) * (width / 2)));
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(cursorX, 0);
    ctx.lineTo(cursorX, height);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(cursorX, 10, 5, 0, Math.PI * 2);
    ctx.fill();
  }, [uiState, activeSpectralLines, principalPeaks]);

  return (
    <div className="w-full rounded-2xl bg-[#070B16] border border-[#283963] p-3 space-y-2 shadow-lg">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono font-medium text-[#94A3B8] uppercase tracking-wider">
          Observation Screen & Metric Ruler (Drag θ / x)
        </span>
        <span className="font-mono font-bold text-[#38BDF8]">
          θ = {vernierWindowA.formattedDMS} &nbsp;|&nbsp; x = {linearXCm.toFixed(1)} cm
        </span>
      </div>

      <div className="w-full relative rounded-xl overflow-hidden border border-[#1F2D4D] bg-[#04060E] cursor-ew-resize select-none">
        <canvas
          ref={canvasRef}
          width={800}
          height={110}
          className="w-full h-[110px] block"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
    </div>
  );
};
