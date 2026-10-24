export type LabTab =
  | 'OPTICAL_BENCH'
  | 'SPECTROMETER'
  | 'LAB_LOG'
  | 'PH3001_LABS'
  | 'THEORY_VIVA';

export type BenchExperimentMode =
  | 'DIFFRACTION_GRATING'
  | 'SINGLE_SLIT_HEISENBERG'
  | 'WIRE_THICKNESS_LASER';

export interface BenchModeConfig {
  title: string;
  shortTitle: string;
  manualExpRef: string;
  formulaSummary: string;
}

export const BENCH_MODE_CONFIGS: Record<BenchExperimentMode, BenchModeConfig> = {
  DIFFRACTION_GRATING: {
    title: 'Diffraction Grating (Multi-Slit)',
    shortTitle: 'Grating (Exp 5)',
    manualExpRef: 'Exp 5 • Grating & Spectrometer',
    formulaSummary: 'e sin θ = n λ   (e = 2.54 / N cm)',
  },
  SINGLE_SLIT_HEISENBERG: {
    title: 'Single-Slit & Heisenberg Uncertainty',
    shortTitle: 'Single Slit (Exp 9)',
    manualExpRef: 'Exp 9 • Heisenberg Uncertainty Principle',
    formulaSummary: 'a sin θ = n λ  |  Δy · Δp_y = h',
  },
  WIRE_THICKNESS_LASER: {
    title: 'Thin Wire Thickness by He-Ne Laser',
    shortTitle: 'Wire Laser (Exp 1)',
    manualExpRef: 'Exp 1 • Thickness of Wire (He-Ne 6328 Å)',
    formulaSummary: 'd = (D · λ) / b   (Half-width b = W / 2)',
  },
};

export type BenchVisualStyle = 'RAY_BENCH_2D' | 'PERSPECTIVE_3D_LAB';

export type CrosswireStyle =
  | 'MULTIPLICATION_X'
  | 'STANDARD_PLUS'
  | 'DOUBLE_HAIRLINE';

export type PH3001Module =
  | 'GD_CALC_LUMERICAL'
  | 'DFB_BRAGG_TMM'
  | 'NEWTONS_RINGS'
  | 'OPTICAL_FIBER_NA'
  | 'PLANCK_LED'
  | 'INSTRUMENTS_LC';

export interface PH3001ModuleConfig {
  expCode: string;
  title: string;
  manualPage: number;
}

export const PH3001_MODULE_CONFIGS: Record<PH3001Module, PH3001ModuleConfig> = {
  GD_CALC_LUMERICAL: {
    expCode: 'CAD 1',
    title: 'GD-Calc & Lumerical Sub-λ',
    manualPage: 55,
  },
  DFB_BRAGG_TMM: {
    expCode: 'CAD 2',
    title: 'DFB Bragg Grating (TMM)',
    manualPage: 58,
  },
  NEWTONS_RINGS: {
    expCode: 'Exp 4',
    title: "Newton's Rings Microscope",
    manualPage: 45,
  },
  OPTICAL_FIBER_NA: {
    expCode: 'Exp 3',
    title: 'Optical Fiber N.A. Scanner',
    manualPage: 38,
  },
  PLANCK_LED: {
    expCode: 'Exp 6',
    title: "Planck's Constant (LED V-I)",
    manualPage: 75,
  },
  INSTRUMENTS_LC: {
    expCode: 'Exp 0',
    title: 'Screw Gauge & Vernier LC',
    manualPage: 6,
  },
};

export type LightSourceMode =
  | 'MONOCHROMATIC'
  | 'MERCURY_VAPOR'
  | 'SODIUM_DOUBLET'
  | 'HYDROGEN_BALMER'
  | 'CADMIUM_LAMP'
  | 'WHITE_CONTINUUM';

export interface LightSourceConfig {
  displayName: string;
  shortName: string;
  description: string;
}

export const LIGHT_SOURCE_CONFIGS: Record<LightSourceMode, LightSourceConfig> = {
  MONOCHROMATIC: {
    displayName: 'Tunable Monochromatic Laser',
    shortName: 'Laser (λ)',
    description: 'Single coherent wavelength adjustable across the visible spectrum (380–700 nm).',
  },
  MERCURY_VAPOR: {
    displayName: 'Mercury Vapor Lamp (Hg - Exp 5)',
    shortName: 'Hg Lamp',
    description: 'Medicaps Manual & PrayogShala polychromatic source: Violet (4046 Å), Blue, Green (5461 Å), Yellow (5770 Å), Red (6800 Å).',
  },
  SODIUM_DOUBLET: {
    displayName: 'Sodium Vapor Doublet (Na)',
    shortName: 'Na D₁/D₂',
    description: "High-resolution yellow D₁ (5896 Å) and D₂ (5890 Å) doublet for resolving power & Newton's rings.",
  },
  HYDROGEN_BALMER: {
    displayName: 'Hydrogen Balmer Tube (H)',
    shortName: 'H Balmer',
    description: 'Atomic hydrogen emission spectrum featuring Hα (6563 Å), Hβ (4861 Å), Hγ (4340 Å), and Hδ (4102 Å).',
  },
  CADMIUM_LAMP: {
    displayName: 'Cadmium Spectral Lamp (Cd)',
    shortName: 'Cd Lamp',
    description: 'High-coherence Cadmium atomic lines: Violet (4678 Å), Cyan (4800 Å), Green (5086 Å), and Red (6438 Å).',
  },
  WHITE_CONTINUUM: {
    displayName: 'White Light Continuum',
    shortName: 'White Light',
    description: 'Continuous polychromatic spectrum (4000–6800 Å) showing central white fringe and full rainbow orders.',
  },
};

export interface SpectralLine {
  name: string;
  wavelengthNm: number;
  relativeIntensity: number;
}

export interface DiffractionPeak {
  order: number;
  spectralLine: SpectralLine;
  angleRad: number;
  angleDeg: number;
  screenYCm: number;
  relativeIntensity: number;
}

export interface VernierReading {
  totalDegrees: number;
  degreesInt: number;
  minutesInt: number;
  secondsInt: number;
  mainScaleDeg: number;
  vernierCoincidence: number;
  leastCountMinutes: number;
  formattedDMS: string;
}

export interface ObservationRecord {
  id: number;
  sourceLabel: string;
  order: number;
  slitSpacingUm: number;
  linesPerInch: number;
  v1LeftDeg: number;
  v1RightDeg: number;
  v1TwoThetaDeg: number;
  v2LeftDeg: number;
  v2RightDeg: number;
  v2TwoThetaDeg: number;
  twoThetaDeg: number;
  meanThetaDeg: number;
  calculatedWavelengthNm: number;
  trueWavelengthNm: number;
  percentError: number;
}

export interface FlowchartActionStep {
  stepIndex: number;
  title: string;
  subtitle: string;
  targetAngleDeg: number | null;
  targetPrismAngleDeg?: number | null;
  isDecisionNode?: boolean;
}

export interface VivaQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ProcedureStep {
  stepNumber: number;
  title: string;
  detail: string;
  formulaHint: string;
}

export interface DiffractionLabUiState {
  selectedTab: LabTab;
  benchMode: BenchExperimentMode;
  benchVisualStyle: BenchVisualStyle;
  lightSourceMode: LightSourceMode;
  lampPowerOn: boolean;
  wavelengthNm: number;
  slitSpacingUm: number;
  slitWidthUm: number;
  numSlits: number;
  screenDistanceM: number;
  telescopeAngleDeg: number;
  showEnvelope: boolean;
  animateWaves: boolean;

  crosswireStyle: CrosswireStyle;
  collimatorSlitOpeningMm: number;
  telescopeFocusPercent: number;
  prismTableAngleDeg: number;
  isPrismTableLeveled: boolean;
  vernierDivisions: number;
  lockedLeftAngleDeg: number | null;
  lockedRightAngleDeg: number | null;

  wirePresetIndex: number;
  wireThicknessMm: number;

  selectedPh3001Module: PH3001Module;
  isGratingInsertedOnBench: boolean;
  whiteLightFilterBand: string | null;
  newtonLensRadiusMm: number;
  newtonMediumRefractiveIndex: number;
  newtonMicroscopePosMm: number;
  fiberCoreIndex: number;
  fiberCladdingIndex: number;
  fiberDetectorDistanceMm: number;
  fiberDetectorOffsetMm: number;
  planckSelectedLedIndex: number;
  planckBiasVoltageV: number;
  screwGaugePitchScaleMm: number;
  screwGaugeHeadDiv: number;
  screwGaugeZeroErrorDiv: number;
  manualPdfPageIndex: number;

  observations: ObservationRecord[];
  selectedQuizAnswers: Record<number, number>;
  completedProcedureSteps: number[];
  statusBannerMessage: string | null;
}
