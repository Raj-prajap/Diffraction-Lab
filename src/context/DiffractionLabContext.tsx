import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import {
  BenchExperimentMode,
  BenchVisualStyle,
  CrosswireStyle,
  DiffractionLabUiState,
  DiffractionPeak,
  LabTab,
  LightSourceMode,
  ObservationRecord,
  PH3001Module,
  SpectralLine,
  VernierReading,
} from '../types/diffraction';
import { DiffractionPhysics } from '../utils/diffractionPhysics';

interface DiffractionLabContextType {
  uiState: DiffractionLabUiState;
  // Computed values
  linesPerInch: number;
  linesPerMm: number;
  gratingElementCm: number;
  activeSpectralLines: SpectralLine[];
  principalPeaks: DiffractionPeak[];
  maxObservableOrder: number;
  vernierWindowA: VernierReading;
  vernierWindowB: VernierReading;
  opticalDefocusAmount: number;
  currentDetectorIntensity: number;
  nearestPeak: DiffractionPeak | null;
  resolvingPowerFirstOrder: number;
  wireCentralMaxHalfWidthMm: number;
  heisenbergFirstMinAngleDeg: number;
  heisenbergFirstMinScreenYmm: number;

  // Actions
  selectTab: (tab: LabTab) => void;
  setBenchExperimentMode: (mode: BenchExperimentMode) => void;
  setBenchVisualStyle: (style: BenchVisualStyle) => void;
  toggleLampPower: () => void;
  setLightSourceMode: (mode: LightSourceMode) => void;
  setWavelengthNm: (wavelength: number) => void;
  setSlitSpacingUm: (spacingUm: number) => void;
  setGratingLpi: (lpi: number) => void;
  setSlitWidthUm: (widthUm: number) => void;
  setNumSlits: (slits: number) => void;
  setScreenDistanceM: (distanceM: number) => void;
  setTelescopeAngleDeg: (angleDeg: number) => void;
  nudgeTelescopeAngle: (deltaDeg: number) => void;
  setCrosswireStyle: (style: CrosswireStyle) => void;
  setCollimatorSlitOpeningMm: (mm: number) => void;
  setTelescopeFocusPercent: (focus: number) => void;
  autoSchusterFocus: () => void;
  setPrismTableAngleDeg: (angle: number) => void;
  setVernierDivisions: (divisions: number) => void;
  lockLeftSpectrumReading: () => void;
  lockRightSpectrumReading: () => void;
  snapToNearestPeak: () => void;
  snapToSpecificPeak: (peak: DiffractionPeak) => void;
  toggleEnvelope: () => void;
  toggleWaveAnimation: () => void;
  recordCurrentObservation: () => void;
  selectWirePreset: (index: number) => void;
  setWireThicknessMm: (mm: number) => void;
  selectPh3001Module: (module: PH3001Module) => void;
  setNewtonLensRadiusMm: (rMm: number) => void;
  setNewtonMediumIndex: (mu: number) => void;
  setNewtonMicroscopePosMm: (posMm: number) => void;
  setFiberIndices: (core: number, cladding: number) => void;
  setFiberDetectorOffsetMm: (offsetMm: number) => void;
  setFiberDetectorDistanceMm: (distMm: number) => void;
  selectPlanckLed: (index: number) => void;
  setPlanckBiasVoltage: (voltage: number) => void;
  setScrewGaugeReading: (psrMm: number, hscDiv: number, zeroErrorDiv: number) => void;
  setManualPdfPageIndex: (pageIndex: number) => void;
  deleteObservation: (id: number) => void;
  clearObservations: () => void;
  toggleProcedureStep: (stepNumber: number) => void;
  answerVivaQuestion: (questionId: number, optionIndex: number) => void;
  resetVivaQuiz: () => void;
  toggleGratingInsertedOnBench: () => void;
  setWhiteLightFilterBand: (band: string | null) => void;
  resetApparatus: () => void;
}

const DiffractionLabContext = createContext<DiffractionLabContextType | null>(null);

let nextRecordId = 1;

function seedInitialObservations(): ObservationRecord[] {
  const defaultD = 1.6933;
  const sampleLines = [
    { label: 'Violet (Std 4046 Å)', wl: 404.6, order: 1 },
    { label: 'Green (5461 Å)', wl: 546.1, order: 1 },
    { label: 'Yellow I (5770 Å)', wl: 577.0, order: 1 },
    { label: 'Red (Std 6800 Å)', wl: 680.0, order: 1 },
  ];
  return sampleLines.map(({ label, wl, order }) => {
    const sinT = (order * wl) / (defaultD * 1000);
    const exactDeg = (Math.asin(sinT) * 180) / Math.PI;
    return {
      id: nextRecordId++,
      sourceLabel: label,
      order,
      slitSpacingUm: defaultD,
      linesPerInch: 15000,
      v1LeftDeg: -exactDeg,
      v1RightDeg: exactDeg,
      v1TwoThetaDeg: exactDeg * 2,
      v2LeftDeg: 180 - exactDeg,
      v2RightDeg: 180 + exactDeg,
      v2TwoThetaDeg: exactDeg * 2,
      twoThetaDeg: exactDeg * 2,
      meanThetaDeg: exactDeg,
      calculatedWavelengthNm: wl,
      trueWavelengthNm: wl,
      percentError: 0.0,
    };
  });
}

export const DiffractionLabProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uiState, setUiState] = useState<DiffractionLabUiState>(() => ({
    selectedTab: 'OPTICAL_BENCH',
    benchMode: 'DIFFRACTION_GRATING',
    benchVisualStyle: 'RAY_BENCH_2D',
    lightSourceMode: 'MERCURY_VAPOR',
    lampPowerOn: true,
    wavelengthNm: 546.1,
    slitSpacingUm: 1.693,
    slitWidthUm: 0.45,
    numSlits: 24,
    screenDistanceM: 1.0,
    telescopeAngleDeg: 18.82,
    showEnvelope: true,
    animateWaves: true,

    crosswireStyle: 'MULTIPLICATION_X',
    collimatorSlitOpeningMm: 0.25,
    telescopeFocusPercent: 50,
    prismTableAngleDeg: 45,
    isPrismTableLeveled: true,
    vernierDivisions: 30,
    lockedLeftAngleDeg: -18.82,
    lockedRightAngleDeg: 18.82,

    wirePresetIndex: 0,
    wireThicknessMm: 0.12,

    selectedPh3001Module: 'GD_CALC_LUMERICAL',
    isGratingInsertedOnBench: true,
    whiteLightFilterBand: null,
    newtonLensRadiusMm: 550,
    newtonMediumRefractiveIndex: 1.0,
    newtonMicroscopePosMm: 2.65,
    fiberCoreIndex: 1.48,
    fiberCladdingIndex: 1.41,
    fiberDetectorDistanceMm: 20,
    fiberDetectorOffsetMm: 4.5,
    planckSelectedLedIndex: 0,
    planckBiasVoltageV: 1.85,
    screwGaugePitchScaleMm: 4,
    screwGaugeHeadDiv: 56,
    screwGaugeZeroErrorDiv: -3,
    manualPdfPageIndex: 54,

    observations: seedInitialObservations(),
    selectedQuizAnswers: {},
    completedProcedureSteps: [1, 2],
    statusBannerMessage: null,
  }));

  // Computed values
  const linesPerInch = useMemo(() => DiffractionPhysics.slitSpacingUmToLpi(uiState.slitSpacingUm), [uiState.slitSpacingUm]);
  const linesPerMm = useMemo(() => DiffractionPhysics.slitSpacingUmToLinesPerMm(uiState.slitSpacingUm), [uiState.slitSpacingUm]);
  const gratingElementCm = useMemo(() => 2.54 / Math.max(1, linesPerInch), [linesPerInch]);

  const activeSpectralLines = useMemo(() => {
    let rawLines: SpectralLine[];
    switch (uiState.benchMode) {
      case 'DIFFRACTION_GRATING':
        rawLines = DiffractionPhysics.activeLinesForMode(uiState.lightSourceMode, uiState.wavelengthNm);
        break;
      case 'SINGLE_SLIT_HEISENBERG':
        rawLines = [{ name: `Diode Laser (${Math.round(uiState.wavelengthNm)} nm)`, wavelengthNm: uiState.wavelengthNm, relativeIntensity: 1.0 }];
        break;
      case 'WIRE_THICKNESS_LASER':
        rawLines = [{ name: `He-Ne Laser (${Math.round(uiState.wavelengthNm * 10)} Å)`, wavelengthNm: uiState.wavelengthNm, relativeIntensity: 1.0 }];
        break;
    }
    const filter = uiState.whiteLightFilterBand;
    if (!filter || rawLines.length <= 1) return rawLines;
    const filtered = rawLines.filter((l) => l.name.toLowerCase().includes(filter.toLowerCase()));
    return filtered.length > 0 ? filtered : rawLines;
  }, [uiState.benchMode, uiState.lightSourceMode, uiState.wavelengthNm, uiState.whiteLightFilterBand]);

  const principalPeaks = useMemo(() => {
    const allPeaks = DiffractionPhysics.computePrincipalPeaks(
      activeSpectralLines,
      uiState.slitSpacingUm,
      uiState.slitWidthUm,
      uiState.screenDistanceM
    );
    return uiState.isGratingInsertedOnBench ? allPeaks : allPeaks.filter((p) => p.order === 0);
  }, [activeSpectralLines, uiState.slitSpacingUm, uiState.slitWidthUm, uiState.screenDistanceM, uiState.isGratingInsertedOnBench]);

  const maxObservableOrder = useMemo(() => {
    return Math.max(0, Math.floor((uiState.slitSpacingUm * 1000 * 0.98) / uiState.wavelengthNm));
  }, [uiState.slitSpacingUm, uiState.wavelengthNm]);

  const vernierWindowA = useMemo(() => {
    return DiffractionPhysics.toVernierReading(uiState.telescopeAngleDeg, uiState.vernierDivisions);
  }, [uiState.telescopeAngleDeg, uiState.vernierDivisions]);

  const vernierWindowB = useMemo(() => {
    return DiffractionPhysics.toVernierReading(uiState.telescopeAngleDeg + 180, uiState.vernierDivisions);
  }, [uiState.telescopeAngleDeg, uiState.vernierDivisions]);

  const opticalDefocusAmount = useMemo(() => {
    return Math.min(1, Math.max(0, Math.abs(uiState.telescopeFocusPercent - 50) / 50));
  }, [uiState.telescopeFocusPercent]);

  const currentDetectorIntensity = useMemo(() => {
    if (!uiState.lampPowerOn) return 0;
    const angleRad = (uiState.telescopeAngleDeg * Math.PI) / 180;
    const effectiveSlits = uiState.benchMode === 'DIFFRACTION_GRATING' ? uiState.numSlits : 1;
    let maxI = 0;
    for (const line of activeSpectralLines) {
      const i = line.relativeIntensity * DiffractionPhysics.calculateIntensityAtAngle(
        angleRad,
        line.wavelengthNm,
        uiState.slitSpacingUm,
        uiState.slitWidthUm,
        effectiveSlits,
        uiState.showEnvelope || uiState.benchMode !== 'DIFFRACTION_GRATING'
      );
      if (i > maxI) maxI = i;
    }
    return maxI;
  }, [uiState.lampPowerOn, uiState.telescopeAngleDeg, uiState.benchMode, uiState.numSlits, activeSpectralLines, uiState.slitSpacingUm, uiState.slitWidthUm, uiState.showEnvelope]);

  const nearestPeak = useMemo(() => {
    if (principalPeaks.length === 0) return null;
    let closest = principalPeaks[0];
    let minDiff = Math.abs(closest.angleDeg - uiState.telescopeAngleDeg);
    for (let i = 1; i < principalPeaks.length; i++) {
      const diff = Math.abs(principalPeaks[i].angleDeg - uiState.telescopeAngleDeg);
      if (diff < minDiff) {
        minDiff = diff;
        closest = principalPeaks[i];
      }
    }
    return closest;
  }, [principalPeaks, uiState.telescopeAngleDeg]);

  const resolvingPowerFirstOrder = useMemo(() => uiState.numSlits * 1, [uiState.numSlits]);

  const wireCentralMaxHalfWidthMm = useMemo(() => {
    const dMm = Math.max(0.02, uiState.wireThicknessMm);
    const screenDMm = uiState.screenDistanceM * 1000;
    const lambdaMm = uiState.wavelengthNm * 1e-6;
    return (screenDMm * lambdaMm) / dMm;
  }, [uiState.wireThicknessMm, uiState.screenDistanceM, uiState.wavelengthNm]);

  const heisenbergFirstMinAngleDeg = useMemo(() => {
    const sinT = Math.min(0.99, Math.max(0.001, uiState.wavelengthNm / (uiState.slitWidthUm * 1000)));
    return (Math.asin(sinT) * 180) / Math.PI;
  }, [uiState.wavelengthNm, uiState.slitWidthUm]);

  const heisenbergFirstMinScreenYmm = useMemo(() => {
    const rad = (heisenbergFirstMinAngleDeg * Math.PI) / 180;
    return uiState.screenDistanceM * 1000 * Math.tan(rad);
  }, [heisenbergFirstMinAngleDeg, uiState.screenDistanceM]);

  // Actions
  const selectTab = (tab: LabTab) => {
    setUiState((s) => ({ ...s, selectedTab: tab, statusBannerMessage: null }));
  };

  const setBenchExperimentMode = (mode: BenchExperimentMode) => {
    setUiState((state) => {
      switch (mode) {
        case 'DIFFRACTION_GRATING':
          return {
            ...state,
            benchMode: mode,
            numSlits: Math.max(12, state.numSlits),
            statusBannerMessage: 'Mode: Diffraction Grating (Multi-Slit) (e sin θ = n λ)',
          };
        case 'SINGLE_SLIT_HEISENBERG':
          return {
            ...state,
            benchMode: mode,
            lightSourceMode: 'MONOCHROMATIC',
            wavelengthNm: 655,
            slitWidthUm: 1.8,
            showEnvelope: true,
            statusBannerMessage: 'Mode: Exp 9 Single-Slit Heisenberg Uncertainty (λ = 655 nm)',
          };
        case 'WIRE_THICKNESS_LASER':
          return {
            ...state,
            benchMode: mode,
            lightSourceMode: 'MONOCHROMATIC',
            wavelengthNm: 632.8,
            statusBannerMessage: 'Mode: Exp 1 Thin Wire Thickness by He-Ne Laser (λ = 6328 Å)',
          };
      }
    });
  };

  const setBenchVisualStyle = (style: BenchVisualStyle) => {
    setUiState((s) => ({ ...s, benchVisualStyle: style }));
  };

  const toggleLampPower = () => {
    setUiState((state) => {
      const next = !state.lampPowerOn;
      return {
        ...state,
        lampPowerOn: next,
        statusBannerMessage: next ? 'Light source powered ON & stabilized.' : 'Light source switched OFF.',
      };
    });
  };

  const setLightSourceMode = (mode: LightSourceMode) => {
    setUiState((state) => {
      let newWl = state.wavelengthNm;
      switch (mode) {
        case 'MONOCHROMATIC': newWl = state.wavelengthNm; break;
        case 'MERCURY_VAPOR': newWl = 546.1; break;
        case 'SODIUM_DOUBLET': newWl = 589.0; break;
        case 'HYDROGEN_BALMER': newWl = 656.3; break;
        case 'CADMIUM_LAMP': newWl = 643.8; break;
        case 'WHITE_CONTINUUM': newWl = 535.0; break;
      }
      return {
        ...state,
        lightSourceMode: mode,
        wavelengthNm: newWl,
        statusBannerMessage: `Switched source to ${mode.replace('_', ' ')}`,
      };
    });
  };

  const setWavelengthNm = (wavelength: number) => {
    const clamped = Math.min(700, Math.max(380, wavelength));
    setUiState((s) => ({
      ...s,
      lightSourceMode: 'MONOCHROMATIC',
      wavelengthNm: clamped,
      statusBannerMessage: null,
    }));
  };

  const setSlitSpacingUm = (spacingUm: number) => {
    const clamped = Math.min(15.0, Math.max(0.8, spacingUm));
    setUiState((state) => {
      const safeSlitWidth = Math.min(clamped * 0.75, state.slitWidthUm);
      return {
        ...state,
        slitSpacingUm: clamped,
        slitWidthUm: safeSlitWidth,
        statusBannerMessage: null,
      };
    });
  };

  const setGratingLpi = (lpi: number) => {
    const spacingUm = DiffractionPhysics.lpiToSlitSpacingUm(lpi);
    setSlitSpacingUm(spacingUm);
  };

  const setSlitWidthUm = (widthUm: number) => {
    setUiState((state) => {
      const maxAllowed = state.benchMode === 'SINGLE_SLIT_HEISENBERG' ? 4.5 : Math.max(0.2, state.slitSpacingUm * 0.85);
      return {
        ...state,
        slitWidthUm: Math.min(maxAllowed, Math.max(0.15, widthUm)),
        statusBannerMessage: null,
      };
    });
  };

  const setNumSlits = (slits: number) => {
    setUiState((s) => ({
      ...s,
      numSlits: Math.min(60, Math.max(1, slits)),
      statusBannerMessage: null,
    }));
  };

  const setScreenDistanceM = (distanceM: number) => {
    setUiState((s) => ({
      ...s,
      screenDistanceM: Math.min(2.0, Math.max(0.3, distanceM)),
      statusBannerMessage: null,
    }));
  };

  const setTelescopeAngleDeg = (angleDeg: number) => {
    setUiState((s) => ({
      ...s,
      telescopeAngleDeg: Math.min(75, Math.max(-75, angleDeg)),
      statusBannerMessage: null,
    }));
  };

  const nudgeTelescopeAngle = (deltaDeg: number) => {
    setUiState((s) => ({
      ...s,
      telescopeAngleDeg: Math.min(75, Math.max(-75, s.telescopeAngleDeg + deltaDeg)),
      statusBannerMessage: null,
    }));
  };

  const setCrosswireStyle = (style: CrosswireStyle) => {
    setUiState((s) => ({ ...s, crosswireStyle: style }));
  };

  const setCollimatorSlitOpeningMm = (mm: number) => {
    setUiState((s) => ({ ...s, collimatorSlitOpeningMm: Math.min(1.8, Math.max(0.1, mm)) }));
  };

  const setTelescopeFocusPercent = (focus: number) => {
    setUiState((s) => ({ ...s, telescopeFocusPercent: Math.min(100, Math.max(0, focus)) }));
  };

  const autoSchusterFocus = () => {
    setUiState((s) => ({
      ...s,
      telescopeFocusPercent: 50,
      collimatorSlitOpeningMm: 0.2,
      isPrismTableLeveled: true,
      prismTableAngleDeg: 45,
      statusBannerMessage: "Schuster's parallel-ray focus, narrow slit (0.20 mm), & 45° normal grating alignment complete!",
    }));
  };

  const setPrismTableAngleDeg = (angle: number) => {
    setUiState((s) => ({
      ...s,
      prismTableAngleDeg: angle,
      statusBannerMessage: `Prism/Grating table set to ${Math.round(angle)}° (${angle === 45 || angle === 135 ? 'Normal Incidence' : 'Calibration Step'})`,
    }));
  };

  const setVernierDivisions = (divisions: number) => {
    const lcStr = divisions === 60 ? '30″ (0.5′)' : "1′ (0.0167°)";
    setUiState((s) => ({
      ...s,
      vernierDivisions: divisions,
      statusBannerMessage: `Spectrometer Vernier set to ${divisions} divisions (LC = ${lcStr})`,
    }));
  };

  const lockLeftSpectrumReading = () => {
    setUiState((state) => {
      const vA = DiffractionPhysics.toVernierReading(state.telescopeAngleDeg, state.vernierDivisions);
      const vB = DiffractionPhysics.toVernierReading(state.telescopeAngleDeg + 180, state.vernierDivisions);
      return {
        ...state,
        lockedLeftAngleDeg: state.telescopeAngleDeg,
        statusBannerMessage: `Locked Left Reading (a): V₁ = ${vA.formattedDMS}, V₂ = ${vB.formattedDMS}`,
      };
    });
  };

  const lockRightSpectrumReading = () => {
    setUiState((state) => {
      const vA = DiffractionPhysics.toVernierReading(state.telescopeAngleDeg, state.vernierDivisions);
      const vB = DiffractionPhysics.toVernierReading(state.telescopeAngleDeg + 180, state.vernierDivisions);
      return {
        ...state,
        lockedRightAngleDeg: state.telescopeAngleDeg,
        statusBannerMessage: `Locked Right Reading (b): V₁ = ${vA.formattedDMS}, V₂ = ${vB.formattedDMS}`,
      };
    });
  };

  const snapToNearestPeak = () => {
    setUiState((state) => {
      const targetPeak = principalPeaks.filter((p) => p.order !== 0).sort((a, b) => Math.abs(a.angleDeg - state.telescopeAngleDeg) - Math.abs(b.angleDeg - state.telescopeAngleDeg))[0]
        || principalPeaks[0];
      if (targetPeak) {
        return {
          ...state,
          telescopeAngleDeg: targetPeak.angleDeg,
          statusBannerMessage: `Aligned crosshair to m = ${targetPeak.order > 0 ? '+' + targetPeak.order : targetPeak.order} (${targetPeak.spectralLine.name} @ ${targetPeak.angleDeg.toFixed(2)}°)`,
        };
      }
      return state;
    });
  };

  const snapToSpecificPeak = (peak: DiffractionPeak) => {
    setUiState((state) => ({
      ...state,
      telescopeAngleDeg: peak.angleDeg,
      statusBannerMessage: `Locked onto m = ${peak.order > 0 ? '+' + peak.order : peak.order} (${peak.spectralLine.name} • ${Math.round(peak.spectralLine.wavelengthNm * 10)} Å)`,
    }));
  };

  const toggleEnvelope = () => {
    setUiState((s) => ({ ...s, showEnvelope: !s.showEnvelope }));
  };

  const toggleWaveAnimation = () => {
    setUiState((s) => ({ ...s, animateWaves: !s.animateWaves }));
  };

  const recordCurrentObservation = () => {
    setUiState((state) => {
      const nearest = principalPeaks.sort((a, b) => Math.abs(a.angleDeg - state.telescopeAngleDeg) - Math.abs(b.angleDeg - state.telescopeAngleDeg))[0];
      const orderUsed = nearest && Math.abs(nearest.angleDeg - state.telescopeAngleDeg) < 4.0 && nearest.order !== 0
        ? Math.abs(nearest.order)
        : 1;

      const leftA = state.lockedLeftAngleDeg ?? -Math.abs(state.telescopeAngleDeg);
      const rightB = state.lockedRightAngleDeg ?? Math.abs(state.telescopeAngleDeg);
      const twoTheta = Math.abs(rightB - leftA) > 0.5 && Math.abs(Math.abs(rightB - leftA) / 2 - Math.abs(state.telescopeAngleDeg)) < 3.0
        ? Math.abs(rightB - leftA)
        : Math.max(0.5, Math.abs(state.telescopeAngleDeg)) * 2;
      const meanTheta = twoTheta / 2;
      const thetaRad = (meanTheta * Math.PI) / 180;
      const dNm = state.slitSpacingUm * 1000.0;
      const calcWl = (dNm * Math.sin(thetaRad)) / orderUsed;

      const refLine = nearest && Math.abs(nearest.angleDeg - state.telescopeAngleDeg) < 5.0
        ? nearest.spectralLine
        : activeSpectralLines[0];

      const trueWl = refLine.wavelengthNm;
      const errPct = Math.min(99.9, Math.max(0, (Math.abs(calcWl - trueWl) / trueWl) * 100));

      const newRecord: ObservationRecord = {
        id: nextRecordId++,
        sourceLabel: refLine.name,
        order: orderUsed,
        slitSpacingUm: state.slitSpacingUm,
        linesPerInch: DiffractionPhysics.slitSpacingUmToLpi(state.slitSpacingUm),
        v1LeftDeg: -meanTheta,
        v1RightDeg: meanTheta,
        v1TwoThetaDeg: twoTheta,
        v2LeftDeg: 180 - meanTheta,
        v2RightDeg: 180 + meanTheta,
        v2TwoThetaDeg: twoTheta,
        twoThetaDeg: twoTheta,
        meanThetaDeg: meanTheta,
        calculatedWavelengthNm: calcWl,
        trueWavelengthNm: trueWl,
        percentError: errPct,
      };

      return {
        ...state,
        observations: [newRecord, ...state.observations],
        lockedLeftAngleDeg: -meanTheta,
        lockedRightAngleDeg: meanTheta,
        statusBannerMessage: `Logged m=±${orderUsed}: 2θ=${twoTheta.toFixed(2)}°, θ=${meanTheta.toFixed(2)}°, λ=${Math.round(calcWl * 10)} Å (${errPct.toFixed(2)}% err)`,
      };
    });
  };

  const selectWirePreset = (index: number) => {
    setUiState((state) => {
      const thickness = index === 0 ? 0.12 : index === 1 ? 0.18 : state.wireThicknessMm;
      return {
        ...state,
        wirePresetIndex: index,
        wireThicknessMm: thickness,
        statusBannerMessage: `Selected Wire ${index + 1}: Standard thickness d = ${thickness} mm`,
      };
    });
  };

  const setWireThicknessMm = (mm: number) => {
    setUiState((s) => ({ ...s, wirePresetIndex: 2, wireThicknessMm: Math.min(0.35, Math.max(0.05, mm)) }));
  };

  const selectPh3001Module = (module: PH3001Module) => {
    setUiState((s) => ({
      ...s,
      selectedPh3001Module: module,
      manualPdfPageIndex: Math.max(0, s.manualPdfPageIndex),
    }));
  };

  const setNewtonLensRadiusMm = (rMm: number) => {
    setUiState((s) => ({ ...s, newtonLensRadiusMm: Math.min(800, Math.max(300, rMm)) }));
  };

  const setNewtonMediumIndex = (mu: number) => {
    setUiState((s) => ({ ...s, newtonMediumRefractiveIndex: Math.min(1.65, Math.max(1.0, mu)) }));
  };

  const setNewtonMicroscopePosMm = (posMm: number) => {
    setUiState((s) => ({ ...s, newtonMicroscopePosMm: Math.min(4.5, Math.max(-4.5, posMm)) }));
  };

  const setFiberIndices = (core: number, cladding: number) => {
    const safeCore = Math.min(1.62, Math.max(1.42, core));
    const safeClad = Math.min(safeCore - 0.02, Math.max(1.35, cladding));
    setUiState((s) => ({ ...s, fiberCoreIndex: safeCore, fiberCladdingIndex: safeClad }));
  };

  const setFiberDetectorOffsetMm = (offsetMm: number) => {
    setUiState((s) => ({ ...s, fiberDetectorOffsetMm: Math.min(12, Math.max(-12, offsetMm)) }));
  };

  const setFiberDetectorDistanceMm = (distMm: number) => {
    setUiState((s) => ({ ...s, fiberDetectorDistanceMm: Math.min(40, Math.max(10, distMm)) }));
  };

  const selectPlanckLed = (index: number) => {
    setUiState((s) => ({ ...s, planckSelectedLedIndex: Math.min(3, Math.max(0, index)) }));
  };

  const setPlanckBiasVoltage = (voltage: number) => {
    setUiState((s) => ({ ...s, planckBiasVoltageV: Math.min(3.2, Math.max(0, voltage)) }));
  };

  const setScrewGaugeReading = (psrMm: number, hscDiv: number, zeroErrorDiv: number) => {
    setUiState((s) => ({
      ...s,
      screwGaugePitchScaleMm: Math.min(15, Math.max(0, psrMm)),
      screwGaugeHeadDiv: Math.min(99, Math.max(0, hscDiv)),
      screwGaugeZeroErrorDiv: Math.min(10, Math.max(-10, zeroErrorDiv)),
    }));
  };

  const setManualPdfPageIndex = (pageIndex: number) => {
    setUiState((s) => ({ ...s, manualPdfPageIndex: Math.min(112, Math.max(0, pageIndex)) }));
  };

  const deleteObservation = (id: number) => {
    setUiState((state) => ({
      ...state,
      observations: state.observations.filter((r) => r.id !== id),
    }));
  };

  const clearObservations = () => {
    setUiState((s) => ({ ...s, observations: [], statusBannerMessage: 'Cleared observation table.' }));
  };

  const toggleProcedureStep = (stepNumber: number) => {
    setUiState((state) => {
      const exists = state.completedProcedureSteps.includes(stepNumber);
      const updated = exists
        ? state.completedProcedureSteps.filter((st) => st !== stepNumber)
        : [...state.completedProcedureSteps, stepNumber];
      return { ...state, completedProcedureSteps: updated };
    });
  };

  const answerVivaQuestion = (questionId: number, optionIndex: number) => {
    setUiState((state) => ({
      ...state,
      selectedQuizAnswers: { ...state.selectedQuizAnswers, [questionId]: optionIndex },
    }));
  };

  const resetVivaQuiz = () => {
    setUiState((s) => ({ ...s, selectedQuizAnswers: {} }));
  };

  const toggleGratingInsertedOnBench = () => {
    setUiState((state) => {
      const next = !state.isGratingInsertedOnBench;
      return {
        ...state,
        isGratingInsertedOnBench: next,
        statusBannerMessage: next
          ? 'IIT-K Virtual Lab: Diffraction Grating placed between Laser and Screen (Higher orders ±n active).'
          : 'IIT-K Virtual Lab: Grating removed from path — only undiffracted central n=0 beam reaches Screen.',
      };
    });
  };

  const setWhiteLightFilterBand = (band: string | null) => {
    setUiState((state) => ({
      ...state,
      whiteLightFilterBand: band,
      statusBannerMessage: band === null
        ? 'Polychromatic Filter: Showing all spectral color channels simultaneously.'
        : `Color Filter Active (${band}): Isolating ${band} diffraction orders from polychromatic input.`,
    }));
  };

  const resetApparatus = () => {
    setUiState((state) => ({
      selectedTab: state.selectedTab,
      benchMode: 'DIFFRACTION_GRATING',
      benchVisualStyle: 'RAY_BENCH_2D',
      lightSourceMode: 'MERCURY_VAPOR',
      lampPowerOn: true,
      wavelengthNm: 546.1,
      slitSpacingUm: 1.693,
      slitWidthUm: 0.45,
      numSlits: 24,
      screenDistanceM: 1.0,
      telescopeAngleDeg: 18.82,
      showEnvelope: true,
      animateWaves: true,
      crosswireStyle: 'MULTIPLICATION_X',
      collimatorSlitOpeningMm: 0.25,
      telescopeFocusPercent: 50,
      prismTableAngleDeg: 45,
      isPrismTableLeveled: true,
      vernierDivisions: 30,
      lockedLeftAngleDeg: -18.82,
      lockedRightAngleDeg: 18.82,
      wirePresetIndex: 0,
      wireThicknessMm: 0.12,
      selectedPh3001Module: 'GD_CALC_LUMERICAL',
      isGratingInsertedOnBench: true,
      whiteLightFilterBand: null,
      newtonLensRadiusMm: 550,
      newtonMediumRefractiveIndex: 1.0,
      newtonMicroscopePosMm: 2.65,
      fiberCoreIndex: 1.48,
      fiberCladdingIndex: 1.41,
      fiberDetectorDistanceMm: 20,
      fiberDetectorOffsetMm: 4.5,
      planckSelectedLedIndex: 0,
      planckBiasVoltageV: 1.85,
      screwGaugePitchScaleMm: 4,
      screwGaugeHeadDiv: 56,
      screwGaugeZeroErrorDiv: -3,
      manualPdfPageIndex: 54,
      observations: state.observations,
      selectedQuizAnswers: state.selectedQuizAnswers,
      completedProcedureSteps: [1, 2],
      statusBannerMessage: 'Apparatus reset to standard 15,000 LPI grating & Mercury Vapor Lamp.',
    }));
  };

  return (
    <DiffractionLabContext.Provider
      value={{
        uiState,
        linesPerInch,
        linesPerMm,
        gratingElementCm,
        activeSpectralLines,
        principalPeaks,
        maxObservableOrder,
        vernierWindowA,
        vernierWindowB,
        opticalDefocusAmount,
        currentDetectorIntensity,
        nearestPeak,
        resolvingPowerFirstOrder,
        wireCentralMaxHalfWidthMm,
        heisenbergFirstMinAngleDeg,
        heisenbergFirstMinScreenYmm,
        selectTab,
        setBenchExperimentMode,
        setBenchVisualStyle,
        toggleLampPower,
        setLightSourceMode,
        setWavelengthNm,
        setSlitSpacingUm,
        setGratingLpi,
        setSlitWidthUm,
        setNumSlits,
        setScreenDistanceM,
        setTelescopeAngleDeg,
        nudgeTelescopeAngle,
        setCrosswireStyle,
        setCollimatorSlitOpeningMm,
        setTelescopeFocusPercent,
        autoSchusterFocus,
        setPrismTableAngleDeg,
        setVernierDivisions,
        lockLeftSpectrumReading,
        lockRightSpectrumReading,
        snapToNearestPeak,
        snapToSpecificPeak,
        toggleEnvelope,
        toggleWaveAnimation,
        recordCurrentObservation,
        selectWirePreset,
        setWireThicknessMm,
        selectPh3001Module,
        setNewtonLensRadiusMm,
        setNewtonMediumIndex,
        setNewtonMicroscopePosMm,
        setFiberIndices,
        setFiberDetectorOffsetMm,
        setFiberDetectorDistanceMm,
        selectPlanckLed,
        setPlanckBiasVoltage,
        setScrewGaugeReading,
        setManualPdfPageIndex,
        deleteObservation,
        clearObservations,
        toggleProcedureStep,
        answerVivaQuestion,
        resetVivaQuiz,
        toggleGratingInsertedOnBench,
        setWhiteLightFilterBand,
        resetApparatus,
      }}
    >
      {children}
    </DiffractionLabContext.Provider>
  );
};

export const useDiffractionLab = (): DiffractionLabContextType => {
  const context = useContext(DiffractionLabContext);
  if (!context) {
    throw new Error('useDiffractionLab must be used within a DiffractionLabProvider');
  }
  return context;
};
