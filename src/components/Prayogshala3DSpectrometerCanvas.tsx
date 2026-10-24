import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDiffractionLab } from '../context/DiffractionLabContext';
import { wavelengthToColor } from '../utils/diffractionPhysics';
import { RotateCw, ZoomIn, ZoomOut, Move, Eye, Info, Sparkles } from 'lucide-react';

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPt {
  x: number;
  y: number;
  zDepth: number;
  scale: number;
}

interface Poly3D {
  points: Vec3[];
  fillColor: string;
  strokeColor?: string;
  strokeWidth?: number;
}

type DragControlMode = 'ORBIT_CAMERA' | 'PAN_CAMERA' | 'SWING_TELESCOPE';

export const Prayogshala3DSpectrometerCanvas: React.FC = () => {
  const {
    uiState,
    setTelescopeAngleDeg,
    toggleLampPower,
    principalPeaks,
    vernierWindowA,
    vernierWindowB,
    activeSpectralLines,
    opticalDefocusAmount,
  } = useDiffractionLab();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera State
  const [camYawDeg, setCamYawDeg] = useState(-38);
  const [camPitchDeg, setCamPitchDeg] = useState(26);
  const [camZoom, setCamZoom] = useState(1.12);
  const [camPanX, setCamPanX] = useState(0);
  const [camPanY, setCamPanY] = useState(0);

  // UI Toggles
  const [dragMode, setDragMode] = useState<DragControlMode>('ORBIT_CAMERA');
  const [showFig51bAnatomy, setShowFig51bAnatomy] = useState(true);
  const [xRayMode, setXRayMode] = useState(true);
  const [showPipEyepiece, setShowPipEyepiece] = useState(true);
  const [showCurvedScreenArc, setShowCurvedScreenArc] = useState(true);
  const [autoOrbit, setAutoOrbit] = useState(false);

  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  // Auto-orbit animation
  useEffect(() => {
    let animId: number;
    let lastT = performance.now();
    const loop = (t: number) => {
      const dt = (t - lastT) / 1000;
      lastT = t;
      if (autoOrbit) {
        setCamYawDeg((y) => ((y + dt * 20) % 360));
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [autoOrbit]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };

    if (dragMode === 'ORBIT_CAMERA') {
      setAutoOrbit(false);
      setCamYawDeg((y) => (y + dx * 0.52) % 360);
      setCamPitchDeg((p) => Math.min(88, Math.max(-88, p + dy * 0.48)));
    } else if (dragMode === 'PAN_CAMERA') {
      setAutoOrbit(false);
      setCamPanX((px) => Math.min(280, Math.max(-280, px + dx * 1.15)));
      setCamPanY((py) => Math.min(220, Math.max(-220, py + dy * 1.15)));
    } else if (dragMode === 'SWING_TELESCOPE') {
      setTelescopeAngleDeg(Math.min(72, Math.max(-72, uiState.telescopeAngleDeg - dx * 0.25)));
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

  const resetCamera = useCallback(() => {
    setAutoOrbit(false);
    setCamYawDeg(-38);
    setCamPitchDeg(26);
    setCamZoom(1.12);
    setCamPanX(0);
    setCamPanY(0);
  }, []);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomDelta = -e.deltaY * 0.001;
    setCamZoom((z) => Math.min(3.2, Math.max(0.45, z + zoomDelta)));
  };

  // 3D Engine Projection & Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w * 0.5 + camPanX;
    const cy = h * 0.56 + camPanY;

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#050914');
    bgGrad.addColorStop(0.5, '#0B1328');
    bgGrad.addColorStop(1, '#060A17');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const yawRad = (camYawDeg * Math.PI) / 180;
    const pitchRad = (camPitchDeg * Math.PI) / 180;
    const cosY = Math.cos(yawRad);
    const sinY = Math.sin(yawRad);
    const cosP = Math.cos(pitchRad);
    const sinP = Math.sin(pitchRad);

    const fovScale = Math.min(w, h) * 0.92 * camZoom;
    const cameraDist = 420;

    const project = (v: Vec3): ProjectedPt => {
      const rx1 = v.x * cosY - v.z * sinY;
      const rz1 = v.x * sinY + v.z * cosY;
      const ry1 = v.y * cosP - rz1 * sinP;
      const rz = v.y * sinP + rz1 * cosP;
      const rx = rx1;
      const ry = ry1;

      const denom = Math.max(60, cameraDist + rz);
      const persp = fovScale / denom;
      return {
        x: cx + rx * persp,
        y: cy - ry * persp,
        zDepth: rz,
        scale: persp,
      };
    };

    // 1. Table Grid
    const tableY = -72;
    const gridExtent = 180;
    const gridStep = 30;
    ctx.strokeStyle = '#16223D';
    ctx.lineWidth = 1;

    for (let g = -gridExtent; g <= gridExtent; g += gridStep) {
      const p1 = project({ x: g, y: tableY, z: -gridExtent });
      const p2 = project({ x: g, y: tableY, z: gridExtent });
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      const p3 = project({ x: -gridExtent, y: tableY, z: g });
      const p4 = project({ x: gridExtent, y: tableY, z: g });
      ctx.beginPath();
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.stroke();
    }

    const polys: Poly3D[] = [];

    const addCylinder3D = (
      start: Vec3,
      end: Vec3,
      rStart: number,
      rEnd: number,
      segments: number,
      baseColor: string,
      edgeColor?: string
    ) => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dz = end.z - start.z;
      const len = Math.max(0.001, Math.sqrt(dx * dx + dy * dy + dz * dz));
      const ux = dx / len;
      const uy = dy / len;
      const uz = dz / len;

      let vx: number, vy: number, vz: number;
      if (Math.abs(uy) < 0.9) {
        const l = Math.max(0.001, Math.sqrt(ux * ux + uz * uz));
        vx = -uz / l;
        vy = 0;
        vz = ux / l;
      } else {
        const l = Math.max(0.001, Math.sqrt(ux * ux + uy * uy));
        vx = -uy / l;
        vy = ux / l;
        vz = 0;
      }

      const wx = uy * vz - uz * vy;
      const wy = uz * vx - ux * vz;
      const wz = ux * vy - uy * vx;

      for (let i = 0; i < segments; i++) {
        const a0 = (2.0 * Math.PI * i) / segments;
        const a1 = (2.0 * Math.PI * (i + 1)) / segments;
        const c0 = Math.cos(a0);
        const s0 = Math.sin(a0);
        const c1 = Math.cos(a1);
        const s1 = Math.sin(a1);

        const p00: Vec3 = {
          x: start.x + rStart * (c0 * vx + s0 * wx),
          y: start.y + rStart * (c0 * vy + s0 * wy),
          z: start.z + rStart * (c0 * vz + s0 * wz),
        };
        const p01: Vec3 = {
          x: start.x + rStart * (c1 * vx + s1 * wx),
          y: start.y + rStart * (c1 * vy + s1 * wy),
          z: start.z + rStart * (c1 * vz + s1 * wz),
        };
        const p11: Vec3 = {
          x: end.x + rEnd * (c1 * vx + s1 * wx),
          y: end.y + rEnd * (c1 * vy + s1 * wy),
          z: end.z + rEnd * (c1 * vz + s1 * wz),
        };
        const p10: Vec3 = {
          x: end.x + rEnd * (c0 * vx + s0 * wx),
          y: end.y + rEnd * (c0 * vy + s0 * wy),
          z: end.z + rEnd * (c0 * vz + s0 * wz),
        };

        polys.push({
          points: [p00, p01, p11, p10],
          fillColor: baseColor,
          strokeColor: edgeColor,
          strokeWidth: 0.8,
        });
      }
    };

    const addHorizontalDisc3D = (
      y: number,
      rInner: number,
      rOuter: number,
      segments: number,
      fillColor: string,
      strokeColor?: string
    ) => {
      for (let i = 0; i < segments; i++) {
        const a0 = (2.0 * Math.PI * i) / segments;
        const a1 = (2.0 * Math.PI * (i + 1)) / segments;
        const p0: Vec3 = { x: rInner * Math.cos(a0), y, z: rInner * Math.sin(a0) };
        const p1: Vec3 = { x: rOuter * Math.cos(a0), y, z: rOuter * Math.sin(a0) };
        const p2: Vec3 = { x: rOuter * Math.cos(a1), y, z: rOuter * Math.sin(a1) };
        const p3: Vec3 = { x: rInner * Math.cos(a1), y, z: rInner * Math.sin(a1) };
        polys.push({ points: [p0, p1, p2, p3], fillColor, strokeColor, strokeWidth: 0.8 });
      }
    };

    // 2. Spectrometer Base & Tripod Legs
    addHorizontalDisc3D(-70, 0, 54, 20, '#1E293B', '#334155');
    for (const legAng of [0, 120, 240]) {
      const rad = (legAng * Math.PI) / 180;
      addCylinder3D(
        { x: 14 * Math.cos(rad), y: -64, z: 14 * Math.sin(rad) },
        { x: 68 * Math.cos(rad), y: -71, z: 68 * Math.sin(rad) },
        7,
        5,
        8,
        '#1E293B',
        '#475569'
      );
    }
    addCylinder3D({ x: 0, y: -70, z: 0 }, { x: 0, y: -22, z: 0 }, 18, 14, 14, '#334155');

    // Lock Screw on pillar
    addCylinder3D({ x: 0, y: -42, z: 14 }, { x: 0, y: -42, z: 32 }, 3.5, 5.5, 8, '#FBBF24');

    // Magnifying glass stand
    addCylinder3D({ x: -36, y: -71, z: 68 }, { x: -36, y: -38, z: 68 }, 3, 2, 6, '#64748B');
    addCylinder3D({ x: -36, y: -38, z: 66 }, { x: -36, y: -38, z: 70 }, 9, 9, 12, 'rgba(56, 189, 248, 0.45)', '#FBBF24');

    // 3. Main Scale & Vernier Scale (y = -22, r = 64)
    addHorizontalDisc3D(-22, 14, 64, 28, '#1E293B', '#475569');
    addHorizontalDisc3D(-21.2, 50, 64, 28, '#334155', 'rgba(56, 189, 248, 0.45)');

    // 3 Leveling screws
    for (const screwAng of [30, 150, 270]) {
      const rad = (screwAng * Math.PI) / 180;
      addCylinder3D(
        { x: 24 * Math.cos(rad), y: -21, z: 24 * Math.sin(rad) },
        { x: 24 * Math.cos(rad), y: -6, z: 24 * Math.sin(rad) },
        3.2,
        3.2,
        6,
        '#FBBF24'
      );
    }

    // 4. Spectrometer Table (y = -6, r = 34)
    addHorizontalDisc3D(-6, 0, 34, 22, '#0F172A', 'rgba(56, 189, 248, 0.7)');

    // 5. Diffraction Grating and Mount
    const gratingRotRad = ((uiState.prismTableAngleDeg === 45 || uiState.prismTableAngleDeg === 135 ? 0 : uiState.prismTableAngleDeg - 45) * Math.PI) / 180;
    const gCos = Math.cos(gratingRotRad);
    const gSin = Math.sin(gratingRotRad);
    const gHalfW = 22;
    const gBottomY = -5;
    const gTopY = 26;
    const gp0 = { x: -gHalfW * gSin, y: gBottomY, z: -gHalfW * gCos };
    const gp1 = { x: gHalfW * gSin, y: gBottomY, z: gHalfW * gCos };
    const gp2 = { x: gHalfW * gSin, y: gTopY, z: gHalfW * gCos };
    const gp3 = { x: -gHalfW * gSin, y: gTopY, z: -gHalfW * gCos };
    polys.push({
      points: [gp0, gp1, gp2, gp3],
      fillColor: 'rgba(56, 189, 248, 0.28)',
      strokeColor: '#38BDF8',
      strokeWidth: 2,
    });
    // Grating clamp top
    polys.push({
      points: [
        gp3,
        gp2,
        { x: gHalfW * gSin, y: gTopY + 5, z: gHalfW * gCos },
        { x: -gHalfW * gSin, y: gTopY + 5, z: -gHalfW * gCos },
      ],
      fillColor: '#475569',
      strokeColor: '#FBBF24',
      strokeWidth: 1.2,
    });

    // 6. Collimator Tube + Focus Knob
    const tubeAlpha = xRayMode ? 'rgba(51, 65, 85, 0.55)' : '#334155';
    addCylinder3D({ x: -130, y: 10, z: 0 }, { x: -38, y: 10, z: 0 }, 9.5, 10.5, 12, tubeAlpha, 'rgba(100, 116, 139, 0.6)');
    addCylinder3D({ x: -96, y: 10, z: 9 }, { x: -96, y: 10, z: 19 }, 4.5, 5.5, 8, '#FBBF24');
    addCylinder3D({ x: -126, y: 10, z: 9 }, { x: -126, y: 10, z: 16 }, 2.8, 3.8, 8, '#38BDF8');
    addCylinder3D({ x: -82, y: -22, z: 0 }, { x: -82, y: 2, z: 0 }, 4.5, 4.5, 8, '#475569');

    // 7. Mercury Lamp Housing
    const lampCol = uiState.lampPowerOn ? wavelengthToColor(uiState.wavelengthNm) : '#475569';
    addCylinder3D({ x: -168, y: -68, z: 0 }, { x: -168, y: 34, z: 0 }, 18, 16, 12, '#1E293B', uiState.lampPowerOn ? lampCol : '#334155');

    // 8. Swinging Telescope
    const teleRad = (uiState.telescopeAngleDeg * Math.PI) / 180;
    const tCos = Math.cos(teleRad);
    const tSin = Math.sin(teleRad);

    const teleStart = { x: 40 * tCos, y: 10, z: -40 * tSin };
    const teleEnd = { x: 124 * tCos, y: 10, z: -124 * tSin };
    const graticuleEnd = { x: 132 * tCos, y: 10, z: -132 * tSin };
    const eyepieceEnd = { x: 148 * tCos, y: 10, z: -148 * tSin };

    addCylinder3D(teleStart, teleEnd, 11, 9.5, 12, tubeAlpha, 'rgba(251, 191, 36, 0.75)');
    addCylinder3D(teleEnd, graticuleEnd, 8.2, 8.2, 10, '#64748B', '#38BDF8');
    addCylinder3D(graticuleEnd, eyepieceEnd, 6.5, 5.5, 10, '#FBBF24');

    // Telescope Focus Knob
    addCylinder3D(
      { x: 98 * tCos, y: 10, z: -98 * tSin },
      { x: 98 * tCos + 16 * tSin, y: 10, z: -98 * tSin + 16 * tCos },
      3.5,
      5.5,
      8,
      '#FBBF24'
    );
    // Telescope support arm
    addCylinder3D({ x: 74 * tCos, y: -21, z: -74 * tSin }, { x: 74 * tCos, y: 1, z: -74 * tSin }, 5, 5, 8, '#FBBF24');

    // Sort polygons by painter's algorithm (furthest z first)
    const sortedPolys = polys
      .map((poly) => {
        const projPts = poly.points.map(project);
        const avgZ = projPts.reduce((acc, p) => acc + p.zDepth, 0) / projPts.length;
        return { poly, projPts, avgZ };
      })
      .sort((a, b) => b.avgZ - a.avgZ);

    for (const { poly, projPts } of sortedPolys) {
      ctx.fillStyle = poly.fillColor;
      ctx.beginPath();
      projPts.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
      ctx.fill();

      if (poly.strokeColor) {
        ctx.strokeStyle = poly.strokeColor;
        ctx.lineWidth = poly.strokeWidth || 1;
        ctx.stroke();
      }
    }

    // 9. Curved Spectrum Arc & Volumetric Beams
    const arcRadius3D = 152;
    if (showCurvedScreenArc) {
      const arcSteps = 44;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      for (let i = 0; i <= arcSteps; i++) {
        const deg = -68 + (136 * i) / arcSteps;
        const r = (deg * Math.PI) / 180;
        const ptTop = project({ x: arcRadius3D * Math.cos(r), y: 24, z: -arcRadius3D * Math.sin(r) });
        if (i === 0) ctx.moveTo(ptTop.x, ptTop.y);
        else ctx.lineTo(ptTop.x, ptTop.y);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i <= arcSteps; i++) {
        const deg = -68 + (136 * i) / arcSteps;
        const r = (deg * Math.PI) / 180;
        const ptBot = project({ x: arcRadius3D * Math.cos(r), y: -2, z: -arcRadius3D * Math.sin(r) });
        if (i === 0) ctx.moveTo(ptBot.x, ptBot.y);
        else ctx.lineTo(ptBot.x, ptBot.y);
      }
      ctx.stroke();
    }

    if (uiState.lampPowerOn) {
      const incidentColor = activeSpectralLines.length === 1 ? wavelengthToColor(uiState.wavelengthNm) : '#E0F2FE';
      const pLamp = project({ x: -152, y: 10, z: 0 });
      const pGratCenter = project({ x: 0, y: 10, z: 0 });

      // Incident beam glow & core
      ctx.strokeStyle = incidentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pLamp.x, pLamp.y);
      ctx.lineTo(pGratCenter.x, pGratCenter.y);
      ctx.stroke();

      // Diffracted orders
      for (const peak of principalPeaks) {
        if (Math.abs(peak.angleDeg) <= 68) {
          const pr = (peak.angleDeg * Math.PI) / 180;
          const hit3D = { x: arcRadius3D * Math.cos(pr), y: 10, z: -arcRadius3D * Math.sin(pr) };
          const pHit = project(hit3D);
          const col = wavelengthToColor(peak.spectralLine.wavelengthNm, 0.35 + 0.65 * peak.relativeIntensity);

          ctx.strokeStyle = col;
          ctx.lineWidth = peak.order === 0 ? 3.2 : 2.0;
          ctx.beginPath();
          ctx.moveTo(pGratCenter.x, pGratCenter.y);
          ctx.lineTo(pHit.x, pHit.y);
          ctx.stroke();

          if (showCurvedScreenArc) {
            const pTop = project({ x: arcRadius3D * Math.cos(pr), y: 24, z: -arcRadius3D * Math.sin(pr) });
            const pBot = project({ x: arcRadius3D * Math.cos(pr), y: -2, z: -arcRadius3D * Math.sin(pr) });
            ctx.strokeStyle = col;
            ctx.lineWidth = peak.order === 0 ? 4.5 : 3.0;
            ctx.beginPath();
            ctx.moveTo(pTop.x, pTop.y);
            ctx.lineTo(pBot.x, pBot.y);
            ctx.stroke();
          }
        }
      }
    }

    // 10. Fig 5.1(b) Anatomy Callouts
    if (showFig51bAnatomy) {
      const drawCallout = (anchor: Vec3, offX: number, offY: number, text: string, accent: string) => {
        const p = project(anchor);
        const tx = Math.min(w - 110, Math.max(10, p.x + offX));
        const ty = Math.min(h - 14, Math.max(14, p.y + offY));

        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(tx + 6, ty + 2);
        ctx.stroke();

        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillText(text, tx, ty);
      };

      drawCallout({ x: -130, y: 14, z: 0 }, -36, -26, 'Slit plate & screw', '#38BDF8');
      drawCallout({ x: -85, y: 18, z: 0 }, -24, -32, 'Collimator + Focus', '#38BDF8');
      drawCallout({ x: 0, y: 29, z: 0 }, -42, -26, 'Grating & Clamp', '#34D399');
      drawCallout({ x: 0, y: -6, z: 28 }, -38, 14, 'Spectrometer table', '#34D399');
      drawCallout({ x: -36, y: -38, z: 68 }, -45, 18, 'Magnifying glass', '#38BDF8');
      drawCallout({ x: 0, y: -42, z: 26 }, 14, 18, 'Table lock & fine knob', '#FBBF24');
      drawCallout({ x: 88 * tCos, y: 16, z: -88 * tSin }, 10, -26, 'Telescope + Focus knob', '#FBBF24');
      drawCallout({ x: 142 * tCos, y: 12, z: -142 * tSin }, 8, 14, 'Graticule & Eyepiece', '#FBBF24');
    }
  }, [
    camYawDeg,
    camPitchDeg,
    camZoom,
    camPanX,
    camPanY,
    uiState,
    principalPeaks,
    activeSpectralLines,
    showFig51bAnatomy,
    xRayMode,
    showCurvedScreenArc,
  ]);

  return (
    <div className="w-full rounded-2xl bg-[#0E1528] border border-[#283963] p-3 space-y-3 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold font-mono text-[#38BDF8] flex items-center gap-1.5 uppercase">
            <Sparkles className="w-4 h-4" />
            PrayogShala 3D Spectrometer (Fig 5.1b Anatomy)
          </h2>
          <p className="text-xs text-[#94A3B8]">
            360° Interactive 3D Apparatus • Drag to Orbit or Swing Telescope
          </p>
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

      {/* Control Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        {(
          [
            ['ORBIT_CAMERA', '1-Finger: Orbit 360°'],
            ['PAN_CAMERA', '1-Finger: Pan (X/Y)'],
            ['SWING_TELESCOPE', '1-Finger: Swing Telescope (θ)'],
          ] as const
        ).map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => setDragMode(mode)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              dragMode === mode
                ? 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]'
                : 'bg-[#16203A] text-[#94A3B8] border-transparent hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}

        <button
          onClick={() => setShowFig51bAnatomy(!showFig51bAnatomy)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
            showFig51bAnatomy
              ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]'
              : 'bg-[#16203A] text-[#94A3B8] border-transparent hover:text-white'
          }`}
        >
          Fig 5.1(b) Callouts
        </button>

        <button
          onClick={() => setXRayMode(!xRayMode)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
            xRayMode
              ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]'
              : 'bg-[#16203A] text-[#94A3B8] border-transparent hover:text-white'
          }`}
        >
          X-Ray Optics
        </button>

        <button
          onClick={() => setShowPipEyepiece(!showPipEyepiece)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
            showPipEyepiece
              ? 'bg-[#34D399]/20 text-[#34D399] border-[#34D399]'
              : 'bg-[#16203A] text-[#94A3B8] border-transparent hover:text-white'
          }`}
        >
          PiP Eyepiece
        </button>

        <button
          onClick={() => setShowCurvedScreenArc(!showCurvedScreenArc)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
            showCurvedScreenArc
              ? 'bg-[#A78BFA]/20 text-[#A78BFA] border-[#A78BFA]'
              : 'bg-[#16203A] text-[#94A3B8] border-transparent hover:text-white'
          }`}
        >
          3D Spectrum Arc
        </button>

        <button
          onClick={() => setAutoOrbit(!autoOrbit)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
            autoOrbit
              ? 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]'
              : 'bg-[#16203A] text-[#94A3B8] border-transparent hover:text-white'
          }`}
        >
          Auto-Rotate 3D
        </button>
      </div>

      {/* 3D Canvas Box */}
      <div className="relative w-full rounded-xl overflow-hidden border border-[#24355C] bg-[#050914] select-none">
        <canvas
          ref={canvasRef}
          width={840}
          height={340}
          className="w-full h-[340px] block cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          onDoubleClick={resetCamera}
        />

        {/* Top-Left Telemetry & Quick Reset */}
        <div
          onClick={resetCamera}
          className="absolute top-2.5 left-2.5 bg-[#070C1A]/85 backdrop-blur-sm border border-[#283963] rounded-lg px-2.5 py-1 text-xs font-mono flex items-center gap-2 cursor-pointer hover:border-[#38BDF8] transition-all"
        >
          <span className="text-[#38BDF8]">
            Yaw {Math.round(camYawDeg)}° • Pitch {Math.round(camPitchDeg)}° • Zoom {camZoom.toFixed(1)}x
          </span>
          <span className="text-[#FBBF24]">↺ Reset 3D</span>
        </div>

        {/* Top-Right Mini Eyepiece PiP */}
        {showPipEyepiece && (
          <div className="absolute top-2.5 right-2.5 w-24 h-24 rounded-full bg-[#03050C]/90 border-2 border-[#FBBF24]/80 shadow-xl overflow-hidden flex items-center justify-center pointer-events-none">
            <EyepiecePipPreview />
          </div>
        )}

        {/* Bottom-Left Vernier V1 / V2 HUD */}
        <div className="absolute bottom-2.5 left-2.5 bg-[#070C1A]/85 backdrop-blur-sm border border-[#283963] rounded-lg px-3 py-1.5 text-xs font-mono space-y-0.5">
          <div className="text-[#FBBF24] font-semibold">V₁: {vernierWindowA.formattedDMS}</div>
          <div className="text-[#34D399]">V₂: {vernierWindowB.formattedDMS}</div>
        </div>

        {/* Bottom-Right Gimbal Buttons */}
        <div className="absolute bottom-2.5 right-2.5 bg-[#070C1A]/85 backdrop-blur-sm border border-[#283963] rounded-lg p-1 flex items-center gap-1">
          <button
            onClick={() => setCamPanX((px) => px - 24)}
            className="w-7 h-7 bg-[#16203A] hover:bg-[#283963] text-white rounded text-xs flex items-center justify-center font-bold"
          >
            ◀
          </button>
          <button
            onClick={() => setCamPanY((py) => py - 20)}
            className="w-7 h-7 bg-[#16203A] hover:bg-[#283963] text-white rounded text-xs flex items-center justify-center font-bold"
          >
            ▲
          </button>
          <button
            onClick={() => setCamPanY((py) => py + 20)}
            className="w-7 h-7 bg-[#16203A] hover:bg-[#283963] text-white rounded text-xs flex items-center justify-center font-bold"
          >
            ▼
          </button>
          <button
            onClick={() => setCamPanX((px) => px + 24)}
            className="w-7 h-7 bg-[#16203A] hover:bg-[#283963] text-white rounded text-xs flex items-center justify-center font-bold"
          >
            ▶
          </button>
          <button
            onClick={() => setCamZoom((z) => Math.max(0.45, z - 0.18))}
            className="w-7 h-7 bg-[#16203A] hover:bg-[#283963] text-white rounded text-xs flex items-center justify-center font-bold"
          >
            −
          </button>
          <button
            onClick={() => setCamZoom((z) => Math.min(3.2, z + 0.18))}
            className="w-7 h-7 bg-[#16203A] hover:bg-[#283963] text-white rounded text-xs flex items-center justify-center font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Preset Viewpoints Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(
          [
            ['Iso 3D (Fig 5.1b)', -38, 26, 1.12],
            ['Top Turntable (90°)', 0, 85, 1.12],
            ['Bottom Up (-45°)', -30, -45, 1.12],
            ['Grating Close-Up', -85, 14, 1.65],
            ['Telescope POV', -uiState.telescopeAngleDeg - 12, 18, 1.12],
            ['Slit & Collimator', 15, 22, 1.12],
            ['Rear Lamp View', 180, 20, 1.12],
          ] as const
        ).map(([label, yaw, pitch, zoom]) => (
          <button
            key={label}
            onClick={() => {
              setAutoOrbit(false);
              setCamYawDeg(yaw);
              setCamPitchDeg(pitch);
              setCamZoom(zoom);
              setCamPanX(0);
              setCamPanY(0);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap bg-[#16203A] text-[#38BDF8] border border-[#283963] hover:border-[#38BDF8] hover:bg-[#38BDF8]/10 transition-all"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Direct Angle & Swing Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <div className="flex justify-between text-xs font-mono text-[#38BDF8] mb-1">
            <span>3D Camera Yaw ({Math.round(camYawDeg)}°) & Pitch ({Math.round(camPitchDeg)}°)</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={camYawDeg}
            onChange={(e) => {
              setAutoOrbit(false);
              setCamYawDeg(parseFloat(e.target.value));
            }}
            className="w-full accent-[#38BDF8]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-[#FBBF24] mb-1">
            <span>Swing 3D Telescope (θ = {uiState.telescopeAngleDeg.toFixed(1)}°)</span>
          </div>
          <input
            type="range"
            min="-68"
            max="68"
            step="0.1"
            value={uiState.telescopeAngleDeg}
            onChange={(e) => setTelescopeAngleDeg(parseFloat(e.target.value))}
            className="w-full accent-[#FBBF24]"
          />
        </div>
      </div>
    </div>
  );
};

const EyepiecePipPreview: React.FC = () => {
  const { uiState, principalPeaks, opticalDefocusAmount } = useDiffractionLab();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
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
      const defocusBlur = opticalDefocusAmount * 16;
      const slitW = Math.min(16, Math.max(2, uiState.collimatorSlitOpeningMm * 9));

      for (const peak of principalPeaks) {
        const relDeg = peak.angleDeg - uiState.telescopeAngleDeg;
        if (Math.abs(relDeg) <= fovHalfDeg) {
          const lineX = cx + (relDeg / fovHalfDeg) * r;
          const col = wavelengthToColor(peak.spectralLine.wavelengthNm);

          ctx.strokeStyle = wavelengthToColor(peak.spectralLine.wavelengthNm, 0.45);
          ctx.lineWidth = slitW + defocusBlur + 6;
          ctx.beginPath();
          ctx.moveTo(lineX, 0);
          ctx.lineTo(lineX, h);
          ctx.stroke();

          ctx.strokeStyle = col;
          ctx.lineWidth = slitW;
          ctx.beginPath();
          ctx.moveTo(lineX, 0);
          ctx.lineTo(lineX, h);
          ctx.stroke();
        }
      }
    }

    // Crosshairs
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
    ctx.lineWidth = 1.3;

    if (uiState.crosswireStyle === 'MULTIPLICATION_X') {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, h);
      ctx.moveTo(w, 0);
      ctx.lineTo(0, h);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();
    }
  }, [uiState, principalPeaks]);

  return <canvas ref={canvasRef} width={96} height={96} className="w-full h-full block" />;
};
