import React, { useRef, useEffect, useCallback } from 'react';
import { useDiffractionLab } from '../context/DiffractionLabContext';
import { DiffractionPhysics, wavelengthToColor } from '../utils/diffractionPhysics';

const MAX_DISPLAY_ANGLE_DEG = 68;

export const IntensityProfileCurveCanvas: React.FC = () => {
  const {
    uiState,
    setTelescopeAngleDeg,
    activeSpectralLines,
    currentDetectorIntensity,
  } = useDiffractionLab();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);

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

    const w = canvas.width;
    const h = canvas.height;
    const baseLineY = h - 18;
    const usableHeight = h - 28;
    const centerX = w / 2;

    ctx.fillStyle = '#070B16';
    ctx.fillRect(0, 0, w, h);

    // Grid lines at 25%, 50%, 75%, 100%
    ctx.strokeStyle = '#162038';
    ctx.lineWidth = 1;
    for (const frac of [0.25, 0.5, 0.75, 1.0]) {
      const gy = baseLineY - usableHeight * frac;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(w, gy);
      ctx.stroke();
    }

    // Center vertical axis
    ctx.strokeStyle = '#283963';
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, baseLineY);
    ctx.stroke();

    if (!uiState.lampPowerOn) return;

    const samples = 360;
    const effectiveSlits = uiState.benchMode === 'DIFFRACTION_GRATING' ? uiState.numSlits : 1;
    const effectiveWidthUm =
      uiState.benchMode === 'WIRE_THICKNESS_LASER'
        ? Math.min(4.0, Math.max(0.6, uiState.wireThicknessMm * 15))
        : uiState.slitWidthUm;

    // Envelope curve
    if (uiState.showEnvelope || uiState.benchMode !== 'DIFFRACTION_GRATING') {
      const refWl = activeSpectralLines[0]?.wavelengthNm || 546.1;
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.65)';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();

      for (let i = 0; i <= samples; i++) {
        const frac = i / samples;
        const deg = (frac * 2 - 1) * MAX_DISPLAY_ANGLE_DEG;
        const rad = (deg * Math.PI) / 180;
        const env = DiffractionPhysics.calculateEnvelopeAtAngle(rad, refWl, effectiveWidthUm);
        const x = frac * w;
        const y = baseLineY - env * usableHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Intensity profile for each spectral line
    for (const line of activeSpectralLines) {
      ctx.strokeStyle = wavelengthToColor(line.wavelengthNm);
      ctx.lineWidth = 2.2;
      ctx.beginPath();

      for (let i = 0; i <= samples; i++) {
        const frac = i / samples;
        const deg = (frac * 2 - 1) * MAX_DISPLAY_ANGLE_DEG;
        const rad = (deg * Math.PI) / 180;
        const intensity =
          line.relativeIntensity *
          DiffractionPhysics.calculateIntensityAtAngle(
            rad,
            line.wavelengthNm,
            uiState.slitSpacingUm,
            effectiveWidthUm,
            effectiveSlits,
            uiState.showEnvelope || uiState.benchMode !== 'DIFFRACTION_GRATING'
          );
        const x = frac * w;
        const y = baseLineY - intensity * usableHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Active cursor indicator
    const cursorX = Math.min(w - 2, Math.max(2, centerX + (uiState.telescopeAngleDeg / MAX_DISPLAY_ANGLE_DEG) * (w / 2)));
    const cursorY = baseLineY - currentDetectorIntensity * usableHeight;

    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(cursorX, 4);
    ctx.lineTo(cursorX, baseLineY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, 5.5, 0, Math.PI * 2);
    ctx.fill();
  }, [uiState, activeSpectralLines, currentDetectorIntensity]);

  return (
    <div className="w-full rounded-2xl bg-[#0E1528] border border-[#283963] p-3 space-y-2 shadow-lg">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono font-medium text-[#94A3B8] uppercase tracking-wider">
          Intensity Distribution I(θ) & Envelope
        </span>
        <span className="font-mono font-bold text-[#FBBF24]">
          I(θ) = {(currentDetectorIntensity * 100).toFixed(1)}%
        </span>
      </div>

      <div className="w-full relative rounded-xl overflow-hidden border border-[#1B2848] bg-[#070B16] cursor-ew-resize select-none">
        <canvas
          ref={canvasRef}
          width={800}
          height={145}
          className="w-full h-[145px] block"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
    </div>
  );
};
