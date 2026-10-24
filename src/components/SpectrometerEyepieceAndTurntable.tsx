import React, { useRef, useEffect } from 'react';
import { useDiffractionLab } from '../context/DiffractionLabContext';
import { wavelengthToColor } from '../utils/diffractionPhysics';
import { CrosswireStyle } from '../types/diffraction';

export const SpectrometerEyepieceAndTurntable: React.FC = () => {
  const {
    uiState,
    setTelescopeAngleDeg,
    setCrosswireStyle,
    setCollimatorSlitOpeningMm,
    setTelescopeFocusPercent,
    autoSchusterFocus,
    setPrismTableAngleDeg,
    setVernierDivisions,
    lockLeftSpectrumReading,
    lockRightSpectrumReading,
    recordCurrentObservation,
    principalPeaks,
    opticalDefocusAmount,
  } = useDiffractionLab();

  const eyepieceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const turntableCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Eyepiece Canvas Render
  useEffect(() => {
    const canvas = eyepieceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const r = w / 2;
    const cx = w / 2;
    const cy = h / 2;
    const fovHalfDeg = 3.2;

    ctx.fillStyle = '#03050C';
    ctx.fillRect(0, 0, w, h);

    if (uiState.lampPowerOn) {
      const defocusBlur = opticalDefocusAmount * 28;
      const slitWidthPx = Math.min(26, Math.max(2.5, uiState.collimatorSlitOpeningMm * 14));

      for (const peak of principalPeaks) {
        const relDeg = peak.angleDeg - uiState.telescopeAngleDeg;
        if (Math.abs(relDeg) <= fovHalfDeg) {
          const lineX = cx + (relDeg / fovHalfDeg) * r;
          const col = wavelengthToColor(peak.spectralLine.wavelengthNm);
          const haloRadius = 18 + defocusBlur + slitWidthPx;

          const glowGrad = ctx.createLinearGradient(lineX - haloRadius, 0, lineX + haloRadius, 0);
          glowGrad.addColorStop(0, 'rgba(0,0,0,0)');
          glowGrad.addColorStop(
            0.5,
            wavelengthToColor(peak.spectralLine.wavelengthNm, 0.65 * peak.relativeIntensity * (1 - 0.5 * opticalDefocusAmount))
          );
          glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = glowGrad;
          ctx.fillRect(lineX - haloRadius, 0, haloRadius * 2, h);

          ctx.strokeStyle = wavelengthToColor(peak.spectralLine.wavelengthNm, Math.min(1, Math.max(0.25, 1 - 0.55 * opticalDefocusAmount)));
          ctx.lineWidth = slitWidthPx + defocusBlur * 0.4;
          ctx.beginPath();
          ctx.moveTo(lineX, 0);
          ctx.lineTo(lineX, h);
          ctx.stroke();
        }
      }
    }

    // Selected Crosswire Style
    ctx.strokeStyle = '#FBBF24';
    if (uiState.crosswireStyle === 'MULTIPLICATION_X') {
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, h);
      ctx.moveTo(w, 0);
      ctx.lineTo(0, h);
      ctx.stroke();

      // Subtle vertical dash
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (uiState.crosswireStyle === 'STANDARD_PLUS') {
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();
    } else {
      // DOUBLE_HAIRLINE
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cx - 4, 0);
      ctx.lineTo(cx - 4, h);
      ctx.moveTo(cx + 4, 0);
      ctx.lineTo(cx + 4, h);
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();
    }

    // Outer brass/steel bezel
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
    ctx.stroke();
  }, [uiState, principalPeaks]);

  // Turntable Canvas Render
  useEffect(() => {
    const canvas = turntableCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const outerR = Math.min(w, h) * 0.42;
    const prismTableR = Math.min(w, h) * 0.19;

    ctx.fillStyle = '#070B16';
    ctx.fillRect(0, 0, w, h);

    // Degree dial
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.stroke();

    for (let deg = 0; deg < 360; deg += 15) {
      const rad = (deg * Math.PI) / 180;
      const r1 = outerR - 6;
      const r2 = outerR + 6;
      ctx.strokeStyle = deg % 45 === 0 ? '#94A3B8' : '#64748B';
      ctx.lineWidth = deg % 45 === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + r1 * Math.cos(rad), cy + r1 * Math.sin(rad));
      ctx.lineTo(cx + r2 * Math.cos(rad), cy + r2 * Math.sin(rad));
      ctx.stroke();
    }

    // Collimator tube on left (fixed at 180°)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(4, cy);
    ctx.lineTo(cx - prismTableR, cy);
    ctx.stroke();

    if (uiState.lampPowerOn) {
      ctx.strokeStyle = wavelengthToColor(uiState.wavelengthNm);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(6, cy);
      ctx.lineTo(cx, cy);
      ctx.stroke();
    }

    // Prism / Grating Table
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(cx, cy, prismTableR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, prismTableR, 0, Math.PI * 2);
    ctx.stroke();

    // Grating orientation
    const tableRotDeg = uiState.prismTableAngleDeg === 45 || uiState.prismTableAngleDeg === 135 ? 0 : uiState.prismTableAngleDeg - 45;
    const tableRotRad = (tableRotDeg * Math.PI) / 180;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tableRotRad);
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -prismTableR * 0.75);
    ctx.lineTo(0, prismTableR * 0.75);
    ctx.stroke();
    ctx.restore();

    // Rotating Telescope Arm
    const teleRad = (-uiState.telescopeAngleDeg * Math.PI) / 180;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(teleRad);

    if (uiState.lampPowerOn) {
      ctx.strokeStyle = wavelengthToColor(uiState.wavelengthNm, 0.85);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(outerR + 10, 0);
      ctx.stroke();
    }

    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(prismTableR + 2, 0);
    ctx.lineTo(outerR + 12, 0);
    ctx.stroke();
    ctx.restore();
  }, [uiState]);

  const diff2Theta =
    uiState.lockedLeftAngleDeg !== null && uiState.lockedRightAngleDeg !== null
      ? Math.abs(uiState.lockedRightAngleDeg - uiState.lockedLeftAngleDeg)
      : Math.abs(uiState.telescopeAngleDeg) * 2;

  return (
    <div className="w-full rounded-2xl bg-[#0E1528] border border-[#283963] p-4 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider">
          PrayogShala & Amrita Virtual Spectrometer
        </span>
        <span className="text-xs font-mono font-bold text-[#34D399]">
          LC = {uiState.vernierDivisions === 60 ? '30″' : '1′'} ({uiState.vernierDivisions} VSD)
        </span>
      </div>

      {/* Eyepiece and Turntable side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Eyepiece */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-[#334155] shadow-2xl relative bg-[#03050C]">
            <canvas
              ref={eyepieceCanvasRef}
              width={176}
              height={176}
              className="w-full h-full block cursor-ew-resize"
              onPointerDown={(e) => {
                const startX = e.clientX;
                const startAngle = uiState.telescopeAngleDeg;
                const onMove = (moveEvt: PointerEvent) => {
                  const deltaX = moveEvt.clientX - startX;
                  setTelescopeAngleDeg(startAngle - deltaX * 0.025);
                };
                const onUp = () => {
                  window.removeEventListener('pointermove', onMove);
                  window.removeEventListener('pointerup', onUp);
                };
                window.addEventListener('pointermove', onMove);
                window.addEventListener('pointerup', onUp);
              }}
            />
          </div>
          <span className="text-xs font-mono text-[#94A3B8]">
            Eyepiece ({uiState.crosswireStyle.replace('_', ' ')})
          </span>
        </div>

        {/* Turntable */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-44 h-44 rounded-2xl overflow-hidden border border-[#283963] shadow-2xl relative bg-[#070B16]">
            <canvas
              ref={turntableCanvasRef}
              width={176}
              height={176}
              className="w-full h-full block cursor-pointer"
              onPointerDown={(e) => {
                const canvas = turntableCanvasRef.current;
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;

                const update = (evt: PointerEvent | React.PointerEvent) => {
                  const dx = Math.max(8, evt.clientX - cx);
                  const dy = cy - evt.clientY;
                  const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
                  setTelescopeAngleDeg(Math.min(75, Math.max(-75, deg)));
                };

                update(e);
                const onMove = (moveEvt: PointerEvent) => update(moveEvt);
                const onUp = () => {
                  window.removeEventListener('pointermove', onMove);
                  window.removeEventListener('pointerup', onUp);
                };
                window.addEventListener('pointermove', onMove);
                window.addEventListener('pointerup', onUp);
              }}
            />
          </div>
          <span className="text-xs font-mono text-[#94A3B8]">
            Turntable (Table: {Math.round(uiState.prismTableAngleDeg)}°)
          </span>
        </div>
      </div>

      {/* V1/V2 Lock & Record Action Box */}
      <div className="rounded-xl bg-[#070B16] border border-[#22335A] p-3 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#38BDF8]">
            LEFT (a): {uiState.lockedLeftAngleDeg !== null ? `${uiState.lockedLeftAngleDeg.toFixed(2)}°` : 'Not set'}
          </span>
          <span className="text-[#34D399]">
            RIGHT (b): {uiState.lockedRightAngleDeg !== null ? `+${Math.abs(uiState.lockedRightAngleDeg).toFixed(2)}°` : 'Not set'}
          </span>
          <span className="text-[#FBBF24] font-bold text-sm">
            2θ = {diff2Theta.toFixed(2)}°
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={lockLeftSpectrumReading}
            className="py-2.5 px-3 rounded-lg text-xs font-semibold bg-[#16203A] text-[#38BDF8] border border-[#38BDF8]/40 hover:bg-[#38BDF8]/20 transition-all text-center"
          >
            Lock Left (a)
          </button>
          <button
            onClick={lockRightSpectrumReading}
            className="py-2.5 px-3 rounded-lg text-xs font-semibold bg-[#16203A] text-[#34D399] border border-[#34D399]/40 hover:bg-[#34D399]/20 transition-all text-center"
          >
            Lock Right (b)
          </button>
          <button
            onClick={recordCurrentObservation}
            className="py-2.5 px-3 rounded-lg text-xs font-semibold bg-[#FBBF24] text-[#1F1200] hover:bg-[#F59E0B] transition-all text-center"
          >
            Log V₁/V₂ Row
          </button>
        </div>
      </div>

      {/* Options: Crosswire styles & VSD divisions */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block">
          Spectrometer Alignment, Focus & Crosswire Options
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              ['MULTIPLICATION_X', '× Crosswire (Manual 5.8)'],
              ['STANDARD_PLUS', '+ Crosswire'],
              ['DOUBLE_HAIRLINE', '|| Double Hairline'],
            ] as const
          ).map(([style, label]) => (
            <button
              key={style}
              onClick={() => setCrosswireStyle(style as CrosswireStyle)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                uiState.crosswireStyle === style
                  ? 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]'
                  : 'bg-[#16203A] text-[#94A3B8] border-transparent hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}

          <button
            onClick={() => setVernierDivisions(30)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              uiState.vernierDivisions === 30
                ? 'bg-[#34D399]/20 text-[#34D399] border-[#34D399]'
                : 'bg-[#16203A] text-[#94A3B8] border-transparent hover:text-white'
            }`}
          >
            30 VSD (LC=1′)
          </button>
          <button
            onClick={() => setVernierDivisions(60)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              uiState.vernierDivisions === 60
                ? 'bg-[#34D399]/20 text-[#34D399] border-[#34D399]'
                : 'bg-[#16203A] text-[#94A3B8] border-transparent hover:text-white'
            }`}
          >
            60 VSD (LC=30″)
          </button>
        </div>

        {/* 4-Step Normal Incidence presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {[
            [0, 'Step 2: Direct (0°)'],
            [90, 'Step 3: 90° Mirror'],
            [45, 'Step 5: 45° Normal'],
            [135, 'Step 5: 135° Normal'],
          ].map(([deg, label]) => (
            <button
              key={label}
              onClick={() => setPrismTableAngleDeg(deg as number)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                uiState.prismTableAngleDeg === deg
                  ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]'
                  : 'bg-[#16203A] text-[#94A3B8] border-transparent hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sliders: Slit Opening & Focus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <div className="flex justify-between text-xs font-mono text-[#F1F5F9] mb-1">
              <span>Slit Width: {uiState.collimatorSlitOpeningMm.toFixed(2)} mm</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="1.80"
              step="0.05"
              value={uiState.collimatorSlitOpeningMm}
              onChange={(e) => setCollimatorSlitOpeningMm(parseFloat(e.target.value))}
              className="w-full accent-[#38BDF8]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className={opticalDefocusAmount < 0.08 ? 'text-[#34D399]' : 'text-[#FBBF24]'}>
                Schuster Focus: {Math.round(uiState.telescopeFocusPercent)}%{' '}
                {opticalDefocusAmount < 0.08 ? '(Sharp Parallel)' : '(Blurred)'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={uiState.telescopeFocusPercent}
              onChange={(e) => setTelescopeFocusPercent(parseFloat(e.target.value))}
              className="w-full accent-[#34D399]"
            />
          </div>
        </div>

        <button
          onClick={autoSchusterFocus}
          className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-[#34D399] border border-[#34D399]/50 bg-[#34D399]/10 hover:bg-[#34D399]/20 transition-all text-center"
        >
          Auto-Run Schuster's Parallel Focus & Spirit Level Alignment
        </button>
      </div>
    </div>
  );
};
