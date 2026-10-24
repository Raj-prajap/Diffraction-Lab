import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDiffractionLab } from '../context/DiffractionLabContext';
import { wavelengthToColor } from '../utils/diffractionPhysics';
import { BenchVisualStyle } from '../types/diffraction';

const MAX_DISPLAY_ANGLE_DEG = 68;

export const OpticalBenchRayCanvas: React.FC = () => {
  const {
    uiState,
    setTelescopeAngleDeg,
    setBenchVisualStyle,
    toggleLampPower,
    principalPeaks,
  } = useDiffractionLab();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);
  const [phase, setPhase] = useState(0);

  // Animation loop for wave phase
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      if (uiState.animateWaves && uiState.lampPowerOn) {
        setPhase((p) => (p + dt * 0.85) % 1.0);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [uiState.animateWaves, uiState.lampPowerOn]);

  const updateAngleFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * canvas.width;
      const y = ((clientY - rect.top) / rect.height) * canvas.height;

      const gratingX = canvas.width * 0.36;
      const centerY = canvas.height * 0.5;

      if (x > gratingX + 10) {
        const dx = x - gratingX;
        const dy = centerY - y;
        const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
        setTelescopeAngleDeg(Math.min(MAX_DISPLAY_ANGLE_DEG, Math.max(-MAX_DISPLAY_ANGLE_DEG, deg)));
      }
    },
    [setTelescopeAngleDeg]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateAngleFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      updateAngleFromPointer(e.clientX, e.clientY);
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

    ctx.fillStyle = '#070B16';
    ctx.fillRect(0, 0, w, h);

    if (uiState.benchVisualStyle === 'PERSPECTIVE_3D_LAB') {
      // 3D Isometric Perspective Optical Bench
      // Table surface
      ctx.fillStyle = '#0E172A';
      ctx.strokeStyle = '#283963';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.03, h * 0.72);
      ctx.lineTo(w * 0.76, h * 0.24);
      ctx.lineTo(w * 0.97, h * 0.36);
      ctx.lineTo(w * 0.24, h * 0.88);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Optical Rail
      const laserPos = { x: w * 0.14, y: h * 0.68 };
      const gratingPos = { x: w * 0.44, y: h * 0.48 };
      const screenCenter = { x: w * 0.78, y: h * 0.26 };

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(laserPos.x, laserPos.y);
      ctx.lineTo(screenCenter.x, screenCenter.y);
      ctx.stroke();

      // Angled 3D Screen
      const screenHalfVec = { x: w * 0.14, y: h * 0.18 };
      ctx.fillStyle = '#050811';
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(screenCenter.x - screenHalfVec.x, screenCenter.y - screenHalfVec.y - 26);
      ctx.lineTo(screenCenter.x + screenHalfVec.x, screenCenter.y + screenHalfVec.y - 26);
      ctx.lineTo(screenCenter.x + screenHalfVec.x, screenCenter.y + screenHalfVec.y + 26);
      ctx.lineTo(screenCenter.x - screenHalfVec.x, screenCenter.y - screenHalfVec.y + 26);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const primaryColor = wavelengthToColor(uiState.wavelengthNm);

      if (uiState.lampPowerOn) {
        // Incident 3D laser beam
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(laserPos.x, laserPos.y - 16);
        ctx.lineTo(gratingPos.x, gratingPos.y - 16);
        ctx.stroke();

        // Diffracted 3D rays
        for (const peak of principalPeaks) {
          if (Math.abs(peak.angleDeg) <= MAX_DISPLAY_ANGLE_DEG) {
            const frac = Math.min(1, Math.max(-1, peak.angleDeg / MAX_DISPLAY_ANGLE_DEG));
            const hitPoint = {
              x: screenCenter.x + frac * screenHalfVec.x,
              y: screenCenter.y + frac * screenHalfVec.y - 16,
            };
            const col = wavelengthToColor(peak.spectralLine.wavelengthNm, 0.35 + 0.65 * peak.relativeIntensity);
            ctx.strokeStyle = col;
            ctx.lineWidth = peak.order === 0 ? 3.8 : 2.2;
            ctx.beginPath();
            ctx.moveTo(gratingPos.x, gratingPos.y - 16);
            ctx.lineTo(hitPoint.x, hitPoint.y);
            ctx.stroke();

            ctx.fillStyle = wavelengthToColor(peak.spectralLine.wavelengthNm);
            ctx.beginPath();
            ctx.arc(hitPoint.x, hitPoint.y, peak.order === 0 ? 6 : 4.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 3D Grating Mount
      const mountVec = { x: w * 0.045, y: h * 0.06 };
      ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gratingPos.x - mountVec.x, gratingPos.y - mountVec.y - 32);
      ctx.lineTo(gratingPos.x + mountVec.x, gratingPos.y + mountVec.y - 32);
      ctx.lineTo(gratingPos.x + mountVec.x, gratingPos.y + mountVec.y + 4);
      ctx.lineTo(gratingPos.x - mountVec.x, gratingPos.y - mountVec.y + 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 3D Laser Emitter Box
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = uiState.lampPowerOn ? primaryColor : '#475569';
      ctx.lineWidth = 2;
      ctx.fillRect(laserPos.x - 28, laserPos.y - 28, 48, 24);
      ctx.strokeRect(laserPos.x - 28, laserPos.y - 28, 48, 24);

      // Active detector target
      const detFrac = Math.min(1, Math.max(-1, uiState.telescopeAngleDeg / MAX_DISPLAY_ANGLE_DEG));
      const detHit = {
        x: screenCenter.x + detFrac * screenHalfVec.x,
        y: screenCenter.y + detFrac * screenHalfVec.y - 16,
      };
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(detHit.x, detHit.y, 7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(
        `3D Optical Bench • D = ${uiState.screenDistanceM.toFixed(2)} m • Grating Element e = ${uiState.slitSpacingUm.toFixed(2)} µm`,
        12,
        20
      );
    } else {
      // 2D Top-Down Ray Bench with Wavefronts
      const centerY = h / 2;
      const sourceX = w * 0.06;
      const gratingX = w * 0.34;
      const screenX = w * 0.90;

      // Optical Axis
      ctx.strokeStyle = '#233256';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.moveTo(sourceX, centerY);
      ctx.lineTo(screenX, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      const primaryBeamColor = wavelengthToColor(uiState.wavelengthNm);

      if (uiState.lampPowerOn) {
        // Parallel beam gradient
        const beamGrad = ctx.createLinearGradient(0, centerY - 26, 0, centerY + 26);
        beamGrad.addColorStop(0, 'rgba(0,0,0,0)');
        beamGrad.addColorStop(0.2, wavelengthToColor(uiState.wavelengthNm, 0.22));
        beamGrad.addColorStop(0.5, wavelengthToColor(uiState.wavelengthNm, 0.78));
        beamGrad.addColorStop(0.8, wavelengthToColor(uiState.wavelengthNm, 0.22));
        beamGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = beamGrad;
        ctx.fillRect(sourceX + 24, centerY - 26, gratingX - sourceX - 24, 52);

        // Animated wavefront lines
        const waveSpacingPx = Math.min(24, Math.max(10, 10 + (uiState.wavelengthNm - 380) / 28));
        let wx = sourceX + 28 + phase * waveSpacingPx;
        ctx.strokeStyle = wavelengthToColor(uiState.wavelengthNm, 0.55);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        while (wx < gratingX - 4) {
          ctx.beginPath();
          ctx.moveTo(wx, centerY - 22);
          ctx.lineTo(wx, centerY + 22);
          ctx.stroke();
          wx += waveSpacingPx;
        }

        // Diffracted rays
        for (const peak of principalPeaks) {
          if (Math.abs(peak.angleDeg) <= MAX_DISPLAY_ANGLE_DEG) {
            const rayColor = wavelengthToColor(peak.spectralLine.wavelengthNm, 0.3 + 0.65 * peak.relativeIntensity);
            const screenY = centerY - (peak.angleDeg / MAX_DISPLAY_ANGLE_DEG) * (h * 0.44);
            const strokeW = peak.order === 0 ? 4.0 : Math.max(1.4, 2.8 * peak.relativeIntensity);

            ctx.strokeStyle = rayColor;
            ctx.lineWidth = strokeW;
            ctx.beginPath();
            ctx.moveTo(gratingX, centerY);
            ctx.lineTo(screenX, screenY);
            ctx.stroke();

            ctx.fillStyle = rayColor;
            ctx.beginPath();
            ctx.arc(screenX, screenY, peak.order === 0 ? 6 : 4.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Circular diffracted wavefront arcs from grating center
        const numArcs = 5;
        const maxRadius = (screenX - gratingX) * 0.55;
        for (let i = 0; i < numArcs; i++) {
          const r = ((i + phase) / numArcs) * maxRadius;
          if (r > 8) {
            const arcAlpha = (1 - r / maxRadius) * 0.25;
            ctx.strokeStyle = wavelengthToColor(uiState.wavelengthNm, arcAlpha);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(gratingX, centerY, r, -0.9, 0.9);
            ctx.stroke();
          }
        }
      }

      // Emitter housing
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.fillRect(8, centerY - 20, sourceX + 18, 40);
      ctx.strokeRect(8, centerY - 20, sourceX + 18, 40);

      ctx.fillStyle = uiState.lampPowerOn ? primaryBeamColor : '#475569';
      ctx.fillRect(sourceX + 18, centerY - 8, 6, 16);

      // Grating / Aperture at gratingX
      const plateTop = centerY - h * 0.36;
      const plateBottom = centerY + h * 0.36;

      if (uiState.benchMode === 'DIFFRACTION_GRATING') {
        const visualSlits = Math.min(18, Math.max(3, uiState.numSlits));
        const totalPlateLen = plateBottom - plateTop;
        const step = totalPlateLen / visualSlits;
        const gapFraction = Math.min(0.55, Math.max(0.18, uiState.slitWidthUm / uiState.slitSpacingUm));

        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 5;
        ctx.lineCap = 'butt';
        for (let s = 0; s < visualSlits; s++) {
          const segStart = plateTop + s * step;
          const solidLen = step * (1 - gapFraction);
          ctx.beginPath();
          ctx.moveTo(gratingX, segStart);
          ctx.lineTo(gratingX, segStart + solidLen);
          ctx.stroke();
        }
      } else if (uiState.benchMode === 'SINGLE_SLIT_HEISENBERG') {
        const gapHalf = Math.min(28, Math.max(6, uiState.slitWidthUm * 6));
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(gratingX, plateTop);
        ctx.lineTo(gratingX, centerY - gapHalf);
        ctx.moveTo(gratingX, centerY + gapHalf);
        ctx.lineTo(gratingX, plateBottom);
        ctx.stroke();
      } else {
        const wireRad = Math.min(18, Math.max(4, uiState.wireThicknessMm * 45));
        ctx.fillStyle = '#FBBF24';
        ctx.beginPath();
        ctx.arc(gratingX, centerY, wireRad, 0, Math.PI * 2);
        ctx.fill();
      }

      // Observation Wall
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(screenX, h * 0.05);
      ctx.lineTo(screenX, h * 0.95);
      ctx.stroke();

      // Detector Angle Vector
      const targetScreenY = Math.min(h * 0.94, Math.max(h * 0.06, centerY - (uiState.telescopeAngleDeg / MAX_DISPLAY_ANGLE_DEG) * (h * 0.44)));
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2;
      ctx.setLineDash([9, 6]);
      ctx.beginPath();
      ctx.moveTo(gratingX, centerY);
      ctx.lineTo(screenX, targetScreenY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(screenX, targetScreenY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Labels
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      const apLabel =
        uiState.benchMode === 'DIFFRACTION_GRATING'
          ? `Grating (M=${uiState.numSlits})`
          : uiState.benchMode === 'SINGLE_SLIT_HEISENBERG'
          ? `Slit (a=${uiState.slitWidthUm.toFixed(2)}µm)`
          : `Wire (d=${uiState.wireThicknessMm.toFixed(2)}mm)`;
      ctx.fillText(apLabel, gratingX, h - 14);
      ctx.fillText(`Screen D = ${uiState.screenDistanceM.toFixed(2)} m`, screenX - 45, h - 14);
    }
  }, [uiState, principalPeaks, phase]);

  return (
    <div className="w-full rounded-2xl bg-[#0E1528] border border-[#283963] p-3 space-y-2 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setBenchVisualStyle('RAY_BENCH_2D')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              uiState.benchVisualStyle === 'RAY_BENCH_2D'
                ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]'
                : 'bg-[#16203A] text-[#94A3B8] border-transparent hover:text-white'
            }`}
          >
            2D Ray Bench
          </button>
          <button
            onClick={() => setBenchVisualStyle('PERSPECTIVE_3D_LAB')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              uiState.benchVisualStyle === 'PERSPECTIVE_3D_LAB'
                ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]'
                : 'bg-[#16203A] text-[#94A3B8] border-transparent hover:text-white'
            }`}
          >
            3D Perspective Lab
          </button>
        </div>

        <button
          onClick={toggleLampPower}
          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
            uiState.lampPowerOn
              ? 'bg-[#34D399]/20 text-[#34D399] border-[#34D399]'
              : 'bg-[#F87171]/20 text-[#F87171] border-[#F87171]'
          }`}
        >
          {uiState.lampPowerOn ? '● LAMP ON' : '○ LAMP OFF'}
        </button>
      </div>

      <div className="w-full relative rounded-xl overflow-hidden border border-[#1B2848] bg-[#070B16] cursor-crosshair select-none">
        <canvas
          ref={canvasRef}
          width={800}
          height={230}
          className="w-full h-[230px] block"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
    </div>
  );
};
