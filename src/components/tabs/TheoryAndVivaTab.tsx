import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  ExternalLink,
  HelpCircle,
  CheckSquare,
  Compass,
  ArrowRight,
  ShieldAlert,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface VivaQuestion {
  q: string;
  a: string;
  formula?: string;
}

const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    q: '1. What is a diffraction grating, and what is the grating element?',
    a: 'A diffraction grating is an arrangement of a large number of equidistant, parallel, closely spaced transparent slits of equal width. The grating element (e = a + b) is the sum of the width of a transparent slit (a) and an opaque ruling (b). If N is lines per inch, e = 2.54 / N cm.',
    formula: 'e = a + b = 2.54 / N \\text{ cm}',
  },
  {
    q: '2. What is the fundamental Grating Equation for normal incidence?',
    a: 'For light of wavelength λ incident normally on a plane transmission grating, the condition for principal maxima is (a + b) sin θ = nλ, where n is the order of diffraction and θ is the angle of diffraction for that order.',
    formula: '(a + b) \\sin\\theta = n\\lambda',
  },
  {
    q: '3. What happens when white light is incident on a diffraction grating?',
    a: 'At the central maximum (n = 0), θ = 0 for all wavelengths, so all colors superimpose to produce a central white image. For higher orders (n ≥ 1), since sin θ ∝ λ, violet (shortest λ ~ 400 nm) diffracts least and red (longest λ ~ 700 nm) diffracts most, spreading into a continuous rainbow spectrum.',
  },
  {
    q: '4. How is a grating spectrum different from a prism spectrum?',
    a: 'In a grating, dispersion is due to diffraction and interference, and sin θ ∝ λ (red bends most). In a prism, dispersion is due to refraction, and refractive index μ is inversely related to λ (Cauchy relation), so violet bends most. Furthermore, grating spectra are symmetric on both sides of central maximum and form multiple orders.',
  },
  {
    q: '5. Why are two verniers (V₁ and V₂) used on the spectrometer?',
    a: 'Two verniers separated by 180° eliminate the error due to non-coincidence of the axis of rotation of the telescope with the center of the circular graduated scale (eccentricity error). Taking the mean of V₁ and V₂ cancels this systematic mechanical misalignment.',
  },
  {
    q: '6. What is Schuster’s method of focusing the spectrometer for parallel rays?',
    a: 'Schuster’s method allows focusing both the collimator and telescope for parallel rays without taking the spectrometer outdoors. A prism/grating is placed on the table, tilted slightly away from minimum deviation, and alternately adjusting the telescope and collimator leveling/focusing screws until the spectral lines are sharp and crisp.',
  },
  {
    q: '7. What is the Dispersive Power of a diffraction grating?',
    a: 'The dispersive power is the rate of change of the angle of diffraction with wavelength, dθ/dλ. Differentiating the grating equation gives dθ/dλ = n / ((a + b) cos θ) = n N / cos θ. It increases with higher order n, higher line density N, and larger diffraction angle θ.',
    formula: '\\frac{d\\theta}{d\\lambda} = \\frac{n}{(a+b)\\cos\\theta}',
  },
  {
    q: '8. What is the Resolving Power of a diffraction grating?',
    a: 'The resolving power of a grating is its ability to separate two spectral lines having very close wavelengths λ and λ + dλ according to Rayleigh criterion. It is given by λ / dλ = n · N_total, where n is the spectral order and N_total is the total number of illuminated grating rulings.',
    formula: '\\frac{\\lambda}{d\\lambda} = n \\cdot N_{\\text{total}}',
  },
  {
    q: '9. What are "absent spectra" or missing orders in a grating?',
    a: 'If the condition for a diffraction minimum for an individual slit (a sin θ = mλ) coincides with the condition for an interference maximum ((a + b) sin θ = nλ), that particular order n disappears. Dividing the two equations gives n / m = (a + b) / a. For example, if b = a, (a+b)/a = 2, so all even orders (2, 4, 6...) are missing.',
    formula: 'n = m \\frac{a+b}{a}',
  },
  {
    q: '10. What is the maximum order of spectrum observable with a grating?',
    a: 'Since the maximum value of sin θ is 1, from (a + b) sin θ = nλ, the maximum observable order is n_max ≤ (a + b) / λ. For a 15,000 LPI grating (e = 1693 nm) and red light (λ = 650 nm), n_max = floor(1693 / 650) = 2. Only 1st and 2nd orders can be observed.',
    formula: 'n_{\\text{max}} = \\left\\lfloor \\frac{a+b}{\\lambda} \\right\\rfloor',
  },
  {
    q: '11. Why should the grating surface never be touched with fingers?',
    a: 'Commercial transmission gratings are high-precision collodion/resin replicas molded from master ruling engine glass. Fingerprints deposit acidic skin oils, moisture, and dust particles into the microscopic grooves (~15,000 lines/inch = 1.69 μm spacing), permanently destroying the phase diffraction efficiency and creating heavy stray scattering.',
  },
];

export const TheoryAndVivaTab: React.FC = () => {
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(0);
  const [activeManual, setActiveManual] = useState<'applied' | 'grating'>('applied');

  const manualPdf =
    activeManual === 'applied'
      ? '/assets/aistudio/Applied_Physics_Lab_Mnaual_2026_4e1a295e.pdf'
      : '/assets/aistudio/Wavelength_using_Grating_de93cc07.pdf';

  return (
    <div className="space-y-6">
      {/* PDF Lab Manuals Viewer & Download Cards */}
      <div className="bg-[#0E1528] border border-cyan-500/20 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Official Applied Physics Lab Manuals (PDF)
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                  GTU / PH3001
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Direct embedded laboratory reference documents, procedures, and experiment protocols
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveManual('applied')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeManual === 'applied'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-[#16203A] text-slate-400 hover:text-white'
              }`}
            >
              Applied Physics 2026
            </button>
            <button
              onClick={() => setActiveManual('grating')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeManual === 'grating'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-[#16203A] text-slate-400 hover:text-white'
              }`}
            >
              Grating Wavelength Exp 5
            </button>
            <a
              href={manualPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-[#16203A] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 rounded-lg border border-white/10 transition-colors"
              title="Open PDF in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Embedded Iframe / PDF Preview */}
        <div className="w-full h-96 bg-[#070B16] rounded-xl overflow-hidden border border-white/10 relative">
          <iframe
            src={manualPdf}
            title="Lab Manual PDF Preview"
            className="w-full h-full border-0"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            Active: {activeManual === 'applied' ? 'Applied_Physics_Lab_Manual_2026.pdf' : 'Wavelength_using_Grating.pdf'}
          </span>
          <a
            href={manualPdf}
            download
            className="text-cyan-400 hover:underline flex items-center gap-1"
          >
            Download PDF Document →
          </a>
        </div>
      </div>

      {/* Experiment 5 Step-by-Step Flowchart */}
      <div className="bg-[#0E1528] border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          Experiment 5 Execution Flowchart & Optical Alignment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {[
            {
              step: 'Step 1',
              title: 'Eyepiece & Reticle',
              desc: 'Focus crosswires sharply by sliding eyepiece in/out against white background.',
            },
            {
              step: 'Step 2',
              title: "Schuster's Method",
              desc: 'Level spectrometer table using 3 leveling screws; focus collimator & telescope for infinity.',
            },
            {
              step: 'Step 3',
              title: 'Direct Ray Baseline',
              desc: 'Align telescope directly with collimator slit. Clamp main scale and record direct reading V₀.',
            },
            {
              step: 'Step 4',
              title: 'Normal Incidence',
              desc: 'Rotate table 90° from reflected position so light wavefront strikes grating at exactly 90°.',
            },
            {
              step: 'Step 5',
              title: 'Spectral Orders (2θ)',
              desc: 'Swing telescope to left & right to measure 1st & 2nd order spectral lines on V₁ and V₂.',
            },
            {
              step: 'Step 6',
              title: 'λ Calculation',
              desc: 'Compute θ = |θ_L - θ_R| / 2 and apply grating equation: λ = (e · sin θ) / n.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0A0E1A] p-3 rounded-xl border border-white/5 flex flex-col justify-between relative group hover:border-cyan-500/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                    {item.step}
                  </span>
                  {idx < 5 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden md:inline" />}
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Precautions and Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#0E1528] border border-amber-500/20 rounded-xl p-5 shadow-lg space-y-3">
          <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> 5.8 Laboratory Precautions
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
            <li>Never touch the ruled surface of the grating; hold only by the edge borders.</li>
            <li>Ensure the slit is narrow and vertically parallel to the grating grooves.</li>
            <li>Take readings on both verniers (V₁ and V₂) to eliminate eccentricity error.</li>
            <li>Verify normal incidence carefully before taking diffraction angles.</li>
            <li>Do not disturb the leveling screws or the prism table clamp during measurements.</li>
          </ul>
        </div>

        <div className="bg-[#0E1528] border border-emerald-500/20 rounded-xl p-5 shadow-lg space-y-3">
          <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-400" /> 5.9 Engineering Applications
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
            <li>Astronomical spectrographs for analyzing stellar atmospheres and Doppler redshifts.</li>
            <li>Dense Wavelength Division Multiplexing (DWDM) in optical telecommunications.</li>
            <li>Monochromators in UV-Vis absorption and fluorescence spectrophotometers.</li>
            <li>Chirped-pulse amplification (CPA) laser pulse compressors for ultra-fast physics.</li>
            <li>Laser tuning elements and photonic bandgap sensors for biological assays.</li>
          </ul>
        </div>
      </div>

      {/* 11 Viva-Voce Questions with Expandable Answers */}
      <div className="bg-[#0E1528] border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Experiment 5 Comprehensive Viva-Voce (11 Questions)
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                  Oral Exam Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Click any question to reveal physical explanation, derivation formulas, and examiner tips
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {VIVA_QUESTIONS.map((item, idx) => {
            const isOpen = openQuestionIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#0A0E1A] border border-white/5 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenQuestionIndex(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="text-xs font-semibold text-white">{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-white/5 text-xs text-slate-300 space-y-2">
                    <p className="leading-relaxed">{item.a}</p>
                    {item.formula && (
                      <div className="p-2 bg-[#16203A] rounded border border-white/5 font-mono text-cyan-300 text-[11px]">
                        Formula: {item.formula}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
