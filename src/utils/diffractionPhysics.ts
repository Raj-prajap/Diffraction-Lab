import {
  DiffractionPeak,
  FlowchartActionStep,
  LightSourceMode,
  ProcedureStep,
  SpectralLine,
  VernierReading,
  VivaQuestion,
} from '../types/diffraction';

/**
 * Converts a visible light wavelength in nanometers (380nm - 750nm)
 * to a physically inspired RGB Color using Dan Bruton's spectral approximation
 * enhanced for vivid display on dark optical lab canvases.
 */
export function wavelengthToColor(wavelengthNm: number, alpha: number = 1): string {
  const wl = Math.min(750, Math.max(380, wavelengthNm));
  let r = 0;
  let g = 0;
  let b = 0;

  if (wl >= 380 && wl < 440) {
    r = -(wl - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wl >= 440 && wl < 490) {
    r = 0;
    g = (wl - 440) / (490 - 440);
    b = 1;
  } else if (wl >= 490 && wl < 510) {
    r = 0;
    g = 1;
    b = -(wl - 510) / (510 - 490);
  } else if (wl >= 510 && wl < 580) {
    r = (wl - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wl >= 580 && wl < 645) {
    r = 1;
    g = -(wl - 645) / (645 - 580);
    b = 0;
  } else if (wl >= 645 && wl <= 750) {
    r = 1;
    g = 0;
    b = 0;
  }

  // Intensity falloff near the edges of the human visible spectrum
  let factor = 1.0;
  if (wl >= 380 && wl < 420) {
    factor = 0.35 + 0.65 * (wl - 380) / (420 - 380);
  } else if (wl >= 420 && wl < 700) {
    factor = 1.0;
  } else if (wl >= 700 && wl <= 750) {
    factor = 0.35 + 0.65 * (750 - wl) / (750 - 700);
  }

  const gamma = 0.8;
  const red = Math.round(Math.min(255, Math.max(0, 255 * (r > 0 ? Math.pow(r * factor, gamma) : 0))));
  const green = Math.round(Math.min(255, Math.max(0, 255 * (g > 0 ? Math.pow(g * factor, gamma) : 0))));
  const blue = Math.round(Math.min(255, Math.max(0, 255 * (b > 0 ? Math.pow(b * factor, gamma) : 0))));
  const clampedAlpha = Math.min(1, Math.max(0, alpha));

  return `rgba(${red}, ${green}, ${blue}, ${clampedAlpha})`;
}

export function wavelengthToRgb(wavelengthNm: number): { r: number; g: number; b: number } {
  const wl = Math.min(750, Math.max(380, wavelengthNm));
  let r = 0;
  let g = 0;
  let b = 0;

  if (wl >= 380 && wl < 440) {
    r = -(wl - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wl >= 440 && wl < 490) {
    r = 0;
    g = (wl - 440) / (490 - 440);
    b = 1;
  } else if (wl >= 490 && wl < 510) {
    r = 0;
    g = 1;
    b = -(wl - 510) / (510 - 490);
  } else if (wl >= 510 && wl < 580) {
    r = (wl - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wl >= 580 && wl < 645) {
    r = 1;
    g = -(wl - 645) / (645 - 580);
    b = 0;
  } else if (wl >= 645 && wl <= 750) {
    r = 1;
    g = 0;
    b = 0;
  }

  let factor = 1.0;
  if (wl >= 380 && wl < 420) {
    factor = 0.35 + 0.65 * (wl - 380) / (420 - 380);
  } else if (wl >= 420 && wl < 700) {
    factor = 1.0;
  } else if (wl >= 700 && wl <= 750) {
    factor = 0.35 + 0.65 * (750 - wl) / (750 - 700);
  }

  const gamma = 0.8;
  return {
    r: Math.round(Math.min(255, Math.max(0, 255 * (r > 0 ? Math.pow(r * factor, gamma) : 0)))),
    g: Math.round(Math.min(255, Math.max(0, 255 * (g > 0 ? Math.pow(g * factor, gamma) : 0)))),
    b: Math.round(Math.min(255, Math.max(0, 255 * (b > 0 ? Math.pow(b * factor, gamma) : 0)))),
  };
}

export const MERCURY_LINES: SpectralLine[] = [
  { name: 'Violet (Std 4046 Å)', wavelengthNm: 404.6, relativeIntensity: 0.85 },
  { name: 'Blue-Violet', wavelengthNm: 435.8, relativeIntensity: 0.92 },
  { name: 'Cyan-Green', wavelengthNm: 491.6, relativeIntensity: 0.58 },
  { name: 'Green (Primary)', wavelengthNm: 546.1, relativeIntensity: 1.0 },
  { name: 'Yellow I', wavelengthNm: 577.0, relativeIntensity: 0.92 },
  { name: 'Yellow II', wavelengthNm: 579.0, relativeIntensity: 0.90 },
  { name: 'Red (Std 6800 Å)', wavelengthNm: 680.0, relativeIntensity: 0.82 },
];

export const SODIUM_LINES: SpectralLine[] = [
  { name: 'Na D₂ (Yellow)', wavelengthNm: 589.0, relativeIntensity: 1.0 },
  { name: 'Na D₁ (Yellow)', wavelengthNm: 589.6, relativeIntensity: 0.92 },
];

export const HYDROGEN_LINES: SpectralLine[] = [
  { name: 'Hδ (Violet)', wavelengthNm: 410.2, relativeIntensity: 0.65 },
  { name: 'Hγ (Blue-Violet)', wavelengthNm: 434.0, relativeIntensity: 0.78 },
  { name: 'Hβ (Cyan)', wavelengthNm: 486.1, relativeIntensity: 0.92 },
  { name: 'Hα (Red)', wavelengthNm: 656.3, relativeIntensity: 1.0 },
];

export const CADMIUM_LINES: SpectralLine[] = [
  { name: 'Cd Violet', wavelengthNm: 467.8, relativeIntensity: 0.78 },
  { name: 'Cd Cyan', wavelengthNm: 480.0, relativeIntensity: 0.88 },
  { name: 'Cd Green', wavelengthNm: 508.6, relativeIntensity: 0.96 },
  { name: 'Cd Red', wavelengthNm: 643.8, relativeIntensity: 1.0 },
];

export const WHITE_CONTINUUM_LINES: SpectralLine[] = [
  { name: 'Violet Band', wavelengthNm: 410, relativeIntensity: 0.75 },
  { name: 'Blue Band', wavelengthNm: 455, relativeIntensity: 0.85 },
  { name: 'Cyan Band', wavelengthNm: 495, relativeIntensity: 0.90 },
  { name: 'Green Band', wavelengthNm: 535, relativeIntensity: 1.0 },
  { name: 'Yellow Band', wavelengthNm: 580, relativeIntensity: 0.95 },
  { name: 'Orange Band', wavelengthNm: 615, relativeIntensity: 0.90 },
  { name: 'Red Band', wavelengthNm: 660, relativeIntensity: 0.85 },
];

export const PRESET_LASER_WAVELENGTHS: SpectralLine[] = [
  { name: 'Violet Diode', wavelengthNm: 405, relativeIntensity: 1.0 },
  { name: 'Blue Argon', wavelengthNm: 473, relativeIntensity: 1.0 },
  { name: 'Green DPSS', wavelengthNm: 532, relativeIntensity: 1.0 },
  { name: 'Yellow He-Ne', wavelengthNm: 594, relativeIntensity: 1.0 },
  { name: 'He-Ne (Exp 1: 6328 Å)', wavelengthNm: 632.8, relativeIntensity: 1.0 },
  { name: 'Diode (Exp 9: 655 nm)', wavelengthNm: 655.0, relativeIntensity: 1.0 },
];

export const PRESET_GRATINGS_LPI: Array<[number, string]> = [
  [2032, '80 L/mm (Physics Online: d = 12.5 µm)'],
  [2540, '100 L/mm (d = 10.0 µm)'],
  [7620, '300 L/mm (d = 3.33 µm)'],
  [12700, '500 L/mm (d = 2.00 µm)'],
  [15000, '15,000 LPI Manual Std (d = 1.693 µm)'],
  [15240, '600 L/mm Thorlabs/Edmund (d = 1.667 µm)'],
  [20320, '800 L/mm (d = 1.25 µm)'],
  [25400, '1000 L/mm (d = 1.00 µm)'],
];

export const VISIBLE_COLOR_SPECTRUM_BANDS: Array<[string, string, number]> = [
  ['Violet', '3900 – 4550 Å (390 – 455 nm)', 420],
  ['Blue', '4550 – 4920 Å (455 – 492 nm)', 470],
  ['Green', '4920 – 5770 Å (492 – 577 nm)', 532],
  ['Yellow', '5770 – 5970 Å (577 – 597 nm)', 585],
  ['Orange', '5970 – 6220 Å (597 – 622 nm)', 608],
  ['Red', '6220 – 7000 Å (622 – 700 nm)', 650],
];

export const GRATING_FAQ_ITEMS: Array<[string, string, string]> = [
  [
    'What is the order of spectrum (n) in a diffraction grating?',
    'n = 0, ±1, ±2, ±3 ... (where n_max = ⌊d / λ⌋)',
    'The order n represents the integer number of wavelengths (nλ) of path difference between light rays emerging from adjacent slits. n = 0 is the undeviated central bright maximum; n = ±1, ±2 are the first- and second-order dispersed spectra.',
  ],
  [
    'How do you measure laser wavelength using symmetrical screen distance s_n?',
    'θ = arctan(x / L) = arctan(s_n / 2L)  ⟹  λ = (d · sin θ) / n',
    'Place a screen at distance L from the grating. Measure the total distance s_n between the nth order bright spots on the left (-n) and right (+n) sides of the central spot, divide by 2 to get x = s_n / 2, compute θ = arctan(x / L), and solve λ = (d sin θ) / n.',
  ],
  [
    'What should you look for when choosing a grating (Edmund Optics / Thorlabs)?',
    'Groove Density (lines/mm), Blaze Wavelength (λ_B), & Transmission vs. Reflection',
    '1) Groove Density N controls angular dispersion. 2) Blaze Angle / Blaze Wavelength concentrates diffracted energy into a specific order for maximum efficiency. 3) Ruled gratings offer high efficiency while Holographic gratings minimize stray light and ghosting.',
  ],
  [
    'What is Free Spectral Range (FSR) and order overlapping?',
    'FSR = λ / n   (Overlapping occurs when n₁·λ₁ = n₂·λ₂)',
    'In higher orders (n ≥ 2), the red end of order n can overlap with the violet/UV end of order n+1 because sin θ depends on the product nλ (e.g., 2 × 600 nm = 3 × 400 nm).',
  ],
];

export const EXP5_FLOWCHART_STEPS: FlowchartActionStep[] = [
  {
    stepIndex: 1,
    title: '1. Switch ON Mercury Lamp & Determine Least Count',
    subtitle: "1 MSD = 0.5° (30′), 30 VSD ⟹ LC = 30′ / 30 = 1′",
    targetAngleDeg: 0,
    targetPrismAngleDeg: 45,
  },
  {
    stepIndex: 2,
    title: '2. Normal Incidence Grating Alignment (90° → 45°)',
    subtitle: 'Rotate telescope to 90°, align reflected image on prism table, then turn table by 45° or 135°.',
    targetAngleDeg: 0,
    targetPrismAngleDeg: 45,
    isDecisionNode: true,
  },
  {
    stepIndex: 3,
    title: '3. Observe White Central Slit (Zero-Order m = 0)',
    subtitle: "Source, grating & telescope in a straight line (θ = 0° 00′).",
    targetAngleDeg: 0,
  },
  {
    stepIndex: 4,
    title: '4. Swing Telescope LEFT (1st Order): Aim at RED Line',
    subtitle: 'Set × cross-wire on Red (6800 Å) left spectrum & note V₁ and V₂ (a).',
    targetAngleDeg: -23.68,
  },
  {
    stepIndex: 5,
    title: '5. Swing Telescope LEFT (1st Order): Aim at YELLOW & VIOLET',
    subtitle: 'Set × cross-wire on Yellow (5770 Å @ -19.92°) and Violet (4046 Å @ -13.82°).',
    targetAngleDeg: -13.82,
  },
  {
    stepIndex: 6,
    title: '6. Swing Telescope RIGHT (1st Order): Aim at VIOLET, YELLOW & RED',
    subtitle: 'Repeat on the right side (b): Violet (+13.82°), Yellow (+19.92°), Red (+23.68°).',
    targetAngleDeg: 23.68,
  },
  {
    stepIndex: 7,
    title: '7. Compute 2θ = |a - b|, θ = 2θ/2, & λ = e sin θ / n',
    subtitle: 'Verify % Error = |(Std - Expt) / Std| × 100 < 20% for each color!',
    targetAngleDeg: 13.82,
    isDecisionNode: true,
  },
];

export const SPECTROMETER_PRECAUTIONS: string[] = [
  "1. Both the telescope and the collimator should be focused for parallel rays (Schuster's method).",
  '2. The eyepiece should be focused distinctly on the cross-wires without parallax.',
  '3. The Prism table should be properly leveled using the spirit level or optical pin method.',
  '4. While taking observations, the collimator slit should be made narrow and the cross-wires as a multiplication mark (×) should be adjusted at the exact center of the spectral line image.',
];

export const SPECTROMETER_APPLICATIONS: string[] = [
  '1. Calibration of optical spectrometers using standard emission lines.',
  '2. Identification of unknown chemical elements by their characteristic emission spectra.',
  '3. Study of atomic and molecular spectral lines and fine structure (e.g., Sodium doublet).',
  '4. Determination of atomic electronic energy levels and transitions.',
  '5. High-precision wavelength calibration of optical and photonic instruments.',
];

export const PROCEDURE_STEPS: ProcedureStep[] = [
  {
    stepNumber: 1,
    title: 'Optical Axis Intersection & Spirit Leveling (Manual 5.3 A & B)',
    detail: 'Ensure telescope and collimator axes intersect the vertical rotation axis (tested with a center pin on the prism table). Level the prism table using the three leveling screws and spirit level.',
    formulaHint: "Least Count LC = 1 MSD / Total VSD = 0.5° / 30 = 1′",
  },
  {
    stepNumber: 2,
    title: "Schuster's Method for Parallel Rays (Manual 5.3 C)",
    detail: 'Place a prism at minimum deviation. Turn refracting edge toward collimator and focus rack-and-pinion; then turn toward telescope and focus until slight rotation causes no defocus.',
    formulaHint: 'Source & Screen effectively moved to infinity (Fraunhofer condition)',
  },
  {
    stepNumber: 3,
    title: 'Normal Incidence Grating Setup (0° → 90° → 45°/135°, Manual 5.4)',
    detail: 'Coincide vertical crosswire with direct slit image (0°). Rotate telescope by 90°. Rotate grating table until reflected slit image coincides with crosswire, then turn table by 45° or 135°.',
    formulaHint: 'Grating Element: e = 2.54 / N cm = 1.6933 × 10⁻⁴ cm (N = 15,000 lines/in)',
  },
  {
    stepNumber: 4,
    title: 'Measure Left (a) & Right (b) 1st-Order Spectra on V₁ & V₂ (Manual 5.5)',
    detail: 'Rotate slit in its plane until spectral lines are sharp and bright. Superimpose multiplication (×) crosswire on Violet (4046 Å), Yellow (5770 Å), and Red (6800 Å) on left (a) and right (b).',
    formulaHint: '2θ = |a - b|   ⟹   θ = Avg(2θ) / 2   ⟹   λ = (e · sin θ) / n',
  },
];

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    category: 'Manual 5.10 Q1 & Q2',
    question: 'What is the principle of the Diffraction Grating experiment, and what is the condition to observe a distinct diffraction pattern?',
    options: [
      'Fraunhofer multi-slit diffraction (e sin θ = nλ); slit spacing e must be comparable to wavelength λ of light',
      'Total internal reflection; slit must be several centimeters wide',
      'Refraction through a thick glass slab; light must be unpolarized',
      'Photoelectric emission; frequency must exceed threshold',
    ],
    correctIndex: 0,
    explanation: 'The experiment works on Fraunhofer diffraction and constructive interference from N equidistant slits (e sin θ = nλ). To see a clear diffraction pattern, the grating element e must be comparable in size to wavelength λ.',
  },
  {
    id: 2,
    category: 'Manual 5.10 Q3 & Q4',
    question: "What is a Diffraction Grating and what is meant by the 'Grating Element' (e)?",
    options: [
      'An optically flat glass plate with N equidistant parallel ruled slits; Grating Element e = (a + b) = 2.54 / N cm is the distance between two successive slits',
      'A prism that reflects light; Grating Element is the apex angle',
      'A single wide aperture; Grating Element is the screen distance',
      'A polarizing filter; Grating Element is the Brewster angle',
    ],
    correctIndex: 0,
    explanation: 'A diffraction grating consists of a large number of equidistant parallel slits. The combined width of one transparent slit (a) and one opaque space (b) is the grating element e = a + b = 2.54 / N cm.',
  },
  {
    id: 3,
    category: 'Manual 5.10 Q5 & Q6',
    question: 'What are the three essential parts of a spectrometer and the main function of the diffraction grating?',
    options: [
      '1) Collimator (parallel rays), 2) Prism/Grating Table, 3) Telescope; Grating disperses light into sharp principal maxima by wavelength',
      '1) Voltmeter, 2) Ammeter, 3) Galvanometer; Grating amplifies electric current',
      '1) Laser, 2) Wire, 3) Graph paper; Grating measures wire thickness',
      '1) Micrometer, 2) Pitch scale, 3) Thimble; Grating measures glass thickness',
    ],
    correctIndex: 0,
    explanation: 'The spectrometer consists of the Collimator, Prism Table, and Telescope. The diffraction grating disperses incident polychromatic light into discrete spectral orders according to e sin θ = nλ.',
  },
  {
    id: 4,
    category: 'Manual 5.10 Q7',
    question: 'Instead of a Mercury (Hg) source, if we use a Sodium (Na) vapor lamp, what changes can we observe?',
    options: [
      'Instead of multiple colored lines (violet, green, yellow, red), only a closely spaced yellow doublet (5890 Å and 5896 Å) is seen in each order',
      'A continuous white rainbow appears',
      'Only deep violet lines are visible',
      'No central maximum is formed',
    ],
    correctIndex: 0,
    explanation: 'Mercury emits a polychromatic line spectrum (Violet, Blue, Green, Yellow, Red), whereas Sodium emits nearly monochromatic yellow D₁ (5896 Å) and D₂ (5890 Å) doublet lines.',
  },
  {
    id: 5,
    category: 'Manual 5.10 Q8 & Q9',
    question: 'What do you mean by diffraction, and how many centimeters are in 1 inch when calculating e = 2.54 / N?',
    options: [
      'Bending/spreading of waves around obstacles or narrow openings; 1 inch = 2.54 cm',
      'Bending of light at a refractive boundary; 1 inch = 1.00 cm',
      'Absorption of light in a medium; 1 inch = 10.0 cm',
      'Splitting of light by a mirror; 1 inch = 25.4 cm',
    ],
    correctIndex: 0,
    explanation: 'Diffraction is the bending or spreading-out of a wave when it passes through a narrow opening or around an obstacle. Since gratings are rated in lines per inch (N), 1 inch = 2.54 cm gives e = 2.54 / N cm.',
  },
  {
    id: 6,
    category: 'Manual 5.10 Q10',
    question: 'What is the Least Count (LC) of the laboratory spectrometer with 1 MSD = 0.5° and 30 Vernier divisions?',
    options: [
      "LC = 1 MSD / 30 VSD = 0.5° / 30 = 1′ (one arcminute = 1/60 degree)",
      "LC = 0.5° (30 arcminutes)",
      'LC = 0.01 cm',
      "LC = 10′",
    ],
    correctIndex: 0,
    explanation: 'One Main Scale Division (MSD) is 0.5° = 30′. Divided across 30 Vernier Scale Divisions (VSD), the Least Count is 30′ / 30 = 1′.',
  },
  {
    id: 7,
    category: 'Manual 5.10 Q11',
    question: 'Why does Red light deviate the most in the case of a diffraction grating?',
    options: [
      'From sin θ = nλ / e, diffraction angle θ increases with wavelength λ; Red (~6800 Å) has the longest visible wavelength',
      'Because Red light has the shortest wavelength',
      'Because glass has a higher refractive index for Red light',
      'Red light actually deviates the least in a grating',
    ],
    correctIndex: 0,
    explanation: 'In a grating, sin θ = nλ / e. Since Red has the longest wavelength (6800 Å vs 4046 Å for Violet), sin θ and angle θ are largest for Red (opposite to dispersion in a prism).',
  },
];

export class DiffractionPhysics {
  static activeLinesForMode(mode: LightSourceMode, customWavelengthNm: number): SpectralLine[] {
    switch (mode) {
      case 'MONOCHROMATIC':
        return [{ name: `Laser (${Math.round(customWavelengthNm)} nm)`, wavelengthNm: customWavelengthNm, relativeIntensity: 1.0 }];
      case 'MERCURY_VAPOR':
        return MERCURY_LINES;
      case 'SODIUM_DOUBLET':
        return SODIUM_LINES;
      case 'HYDROGEN_BALMER':
        return HYDROGEN_LINES;
      case 'CADMIUM_LAMP':
        return CADMIUM_LINES;
      case 'WHITE_CONTINUUM':
        return WHITE_CONTINUUM_LINES;
    }
  }

  static slitSpacingUmToLpi(slitSpacingUm: number): number {
    return Math.round(25400 / Math.max(0.5, slitSpacingUm));
  }

  static lpiToSlitSpacingUm(lpi: number): number {
    return 25400 / Math.max(500, lpi);
  }

  static slitSpacingUmToLinesPerMm(slitSpacingUm: number): number {
    return 1000 / Math.max(0.5, slitSpacingUm);
  }

  static calculateIntensityAtAngle(
    angleRad: number,
    wavelengthNm: number,
    slitSpacingUm: number,
    slitWidthUm: number,
    numSlits: number,
    includeEnvelope: boolean = true
  ): number {
    const sinTheta = Math.sin(angleRad);
    const dNm = slitSpacingUm * 1000.0;
    const aNm = Math.min(slitSpacingUm * 0.95, slitWidthUm) * 1000.0;
    const lambda = wavelengthNm;

    const alpha = (Math.PI * dNm * sinTheta) / lambda;
    const beta = (Math.PI * aNm * sinTheta) / lambda;

    let envelope = 1.0;
    if (includeEnvelope && Math.abs(beta) >= 1e-6) {
      const s = Math.sin(beta) / beta;
      envelope = s * s;
    }

    const m = Math.max(1, numSlits);
    let interference = 1.0;
    if (m > 1) {
      const sinAlpha = Math.sin(alpha);
      if (Math.abs(sinAlpha) >= 1e-5) {
        const ratio = Math.sin(m * alpha) / (m * sinAlpha);
        interference = ratio * ratio;
      }
    }

    return Math.min(1.0, Math.max(0.0, envelope * interference));
  }

  static calculateEnvelopeAtAngle(angleRad: number, wavelengthNm: number, slitWidthUm: number): number {
    const sinTheta = Math.sin(angleRad);
    const aNm = slitWidthUm * 1000.0;
    const beta = (Math.PI * aNm * sinTheta) / wavelengthNm;
    if (Math.abs(beta) < 1e-6) return 1.0;
    const s = Math.sin(beta) / beta;
    return Math.min(1.0, Math.max(0.0, s * s));
  }

  static computePrincipalPeaks(
    lines: SpectralLine[],
    slitSpacingUm: number,
    slitWidthUm: number,
    screenDistanceM: number
  ): DiffractionPeak[] {
    const dNm = slitSpacingUm * 1000.0;
    const peaks: DiffractionPeak[] = [];

    for (const line of lines) {
      const maxOrder = Math.min(6, Math.floor((dNm * 0.98) / line.wavelengthNm));
      for (let order = -maxOrder; order <= maxOrder; order++) {
        const sinTheta = (order * line.wavelengthNm) / dNm;
        if (Math.abs(sinTheta) <= 0.985) {
          const angleRad = Math.asin(sinTheta);
          const angleDeg = (angleRad * 180) / Math.PI;
          const screenYCm = screenDistanceM * 100 * Math.tan(angleRad);
          const env = this.calculateEnvelopeAtAngle(angleRad, line.wavelengthNm, slitWidthUm);
          peaks.push({
            order,
            spectralLine: line,
            angleRad,
            angleDeg,
            screenYCm,
            relativeIntensity: Math.min(1.0, Math.max(0.08, line.relativeIntensity * env)),
          });
        }
      }
    }

    return peaks.sort((a, b) => a.angleDeg - b.angleDeg);
  }

  static toVernierReading(angleDeg: number, vernierDivisions: number = 30): VernierReading {
    const normalized = ((angleDeg % 360) + 360) % 360;
    const absAngle = Math.abs(angleDeg);
    const totalArcSeconds = Math.round(absAngle * 3600);
    const degInt = Math.floor(totalArcSeconds / 3600);
    const minInt = Math.floor((totalArcSeconds % 3600) / 60);
    const secInt = totalArcSeconds % 60;
    const signPrefix = angleDeg < -0.001 ? '-' : angleDeg > 0.001 ? '+' : '';

    const totalHalfDegrees = Math.floor(normalized * 2.0);
    const mainScaleDeg = totalHalfDegrees * 0.5;
    const lcMinutes = 30 / Math.max(10, vernierDivisions);
    const remainderDeg = normalized - mainScaleDeg;
    const coincidence = Math.min(
      vernierDivisions - 1,
      Math.max(0, Math.round((remainderDeg * 60) / lcMinutes))
    );

    const minStr = String(minInt).padStart(2, '0');
    const secStr = String(secInt).padStart(2, '0');

    return {
      totalDegrees: angleDeg,
      degreesInt: degInt,
      minutesInt: minInt,
      secondsInt: secInt,
      mainScaleDeg,
      vernierCoincidence: coincidence,
      leastCountMinutes: lcMinutes,
      formattedDMS: `${signPrefix}${degInt}° ${minStr}′ ${secStr}″`,
    };
  }
}
