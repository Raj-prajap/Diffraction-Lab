import React, { useState } from 'react';
import { useDiffractionLab } from '../../context/DiffractionLabContext';
import {
  EXP5_FLOWCHART_STEPS,
  PROCEDURE_STEPS,
  VIVA_QUESTIONS,
  VISIBLE_COLOR_SPECTRUM_BANDS,
  GRATING_FAQ_ITEMS,
  SPECTROMETER_PRECAUTIONS,
  SPECTROMETER_APPLICATIONS,
  SIMULATION_SOFTWARE_TOOLS,
  wavelengthToColor,
} from '../../utils/diffractionPhysics';
import {
  BookOpen,
  FileText,
  ExternalLink,
  Play,
  RotateCcw,
  Layers,
  ShieldAlert,
  Lightbulb,
} from 'lucide-react';

export const TheoryAndVivaTab: React.FC = () => {
  const {
    uiState,
    selectTab,
    setTelescopeAngleDeg,
    setPrismTableAngleDeg,
    toggleProcedureStep,
    answerVivaQuestion,
    resetVivaQuiz,
  } = useDiffractionLab();

  const [activeManual, setActiveManual] = useState<'applied' | 'grating'>('applied');

  const manualPdf =
    activeManual === 'applied'
      ? '/assets/aistudio/Applied_Physics_Lab_Mnaual_2026_4e1a295e.pdf'
      : '/assets/aistudio/Wavelength_using_Grating_de93cc07.pdf';

  const totalAnswered = Object.keys(uiState.selectedQuizAnswers).length;
  const correctCount = VIVA_QUESTIONS.filter(
    (q) => uiState.selectedQuizAnswers[q.id] === q.correctIndex
  ).length;

  const handleExecuteFlowchartStep = (step: (typeof EXP5_FLOWCHART_STEPS)[0]) => {
    if (step.targetAngleDeg !== null) {
      setTelescopeAngleDeg(step.targetAngleDeg);
    }
    if (step.targetPrismAngleDeg !== undefined && step.targetPrismAngleDeg !== null) {
      setPrismTableAngleDeg(step.targetPrismAngleDeg);
    }
    selectTab('SPECTROMETER');
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Official PDF Lab Manuals Embedded Viewer Card */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#283963]/60 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#38BDF8]/10 rounded-xl text-[#38BDF8] border border-[#38BDF8]/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Official Applied Physics Lab Manuals (PDF)
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16203A] text-[#38BDF8] border border-[#283963]">
                  GTU / PH3001
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Direct embedded laboratory reference documents, procedures, and experiment protocols
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveManual('applied')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeManual === 'applied'
                  ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/50 shadow-sm'
                  : 'bg-[#16203A] text-[#94A3B8] border border-[#283963] hover:text-white'
              }`}
            >
              Applied Physics 2026
            </button>
            <button
              onClick={() => setActiveManual('grating')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeManual === 'grating'
                  ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/50 shadow-sm'
                  : 'bg-[#16203A] text-[#94A3B8] border border-[#283963] hover:text-white'
              }`}
            >
              Grating Wavelength Exp 5
            </button>
            <a
              href={manualPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-[#16203A] hover:bg-[#38BDF8]/20 text-slate-300 hover:text-[#38BDF8] rounded-lg border border-[#283963] transition-colors"
              title="Open PDF in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Embedded Iframe / PDF Preview */}
        <div className="w-full h-96 bg-[#070B16] rounded-xl overflow-hidden border border-[#283963]/70 relative shadow-inner">
          <iframe
            src={manualPdf}
            title="Lab Manual PDF Preview"
            className="w-full h-full border-0"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
            Active: {activeManual === 'applied' ? 'Applied_Physics_Lab_Manual_2026.pdf' : 'Wavelength_using_Grating.pdf'}
          </span>
          <a
            href={manualPdf}
            download
            className="text-[#38BDF8] hover:underline flex items-center gap-1 font-semibold"
          >
            Download PDF Document →
          </a>
        </div>
      </div>

      {/* 2. Interactive Exp 5 Flowchart (Page 9 — Tap to Simulate in 3D) */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 sm:p-5 shadow-lg space-y-3.5">
        <div>
          <span className="text-xs font-mono font-bold text-[#FBBF24] uppercase tracking-wider block">
            EXP. 5 INTERACTIVE FLOW CHART (PDF PAGE 9 — TAP TO SIMULATE IN 3D)
          </span>
          <p className="text-xs text-[#94A3B8]">
            Clicking any step will automatically configure the Spectrometer angles and take you to the 3D apparatus.
          </p>
        </div>

        <div className="space-y-2">
          {EXP5_FLOWCHART_STEPS.map((step) => (
            <div
              key={step.stepIndex}
              onClick={() => handleExecuteFlowchartStep(step)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                step.isDecisionNode
                  ? 'bg-[#FBBF24]/10 border-[#FBBF24]/40 hover:bg-[#FBBF24]/15'
                  : 'bg-[#070B16] border-[#283963] hover:border-[#38BDF8]/50'
              }`}
            >
              <div className="space-y-0.5">
                <span
                  className={`text-xs font-bold block ${
                    step.isDecisionNode ? 'text-[#FBBF24]' : 'text-slate-100'
                  }`}
                >
                  {step.title}
                </span>
                <span className="text-[11px] text-[#94A3B8] font-mono block">
                  {step.subtitle}
                </span>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-semibold hover:bg-[#38BDF8]/25 transition-all">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Simulate in 3D</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Visible Spectrum Ranges & Grating Engineering Guide */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 sm:p-5 shadow-lg space-y-4">
        <div>
          <span className="text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider block">
            VISIBLE SPECTRUM RANGES & GRATING SELECTION GUIDE
          </span>
          <p className="text-xs text-[#94A3B8]">
            Visible spectral bandwidths and core grating design formulas (Thorlabs & Edmund Optics reference)
          </p>
        </div>

        {/* Color Wavelength Bands Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {VISIBLE_COLOR_SPECTRUM_BANDS.map(([bandName, bandRange, sampleWl]) => {
            const swatch = wavelengthToColor(sampleWl);
            return (
              <div
                key={bandName}
                className="bg-[#070B16] border border-[#283963] rounded-xl px-3 py-2 shrink-0 flex flex-col min-w-[110px]"
                style={{ borderColor: swatch }}
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full ring-1 ring-white/30"
                    style={{ backgroundColor: swatch }}
                  />
                  <span className="text-xs font-bold text-slate-100">{bandName}</span>
                </div>
                <span className="text-[11px] font-mono text-[#94A3B8] mt-1">{bandRange}</span>
              </div>
            );
          })}
        </div>

        {/* FAQ Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GRATING_FAQ_ITEMS.map(([q, formula, a], idx) => (
            <div
              key={idx}
              className="bg-[#070B16] rounded-xl border border-[#283963] p-3.5 space-y-1.5"
            >
              <h4 className="text-xs font-bold text-[#F1F5F9]">{q}</h4>
              <div className="font-mono text-xs text-[#FBBF24] bg-[#16203A] px-2 py-1 rounded border border-[#283963]/60">
                Formula: {formula}
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Optical Diffraction Simulation Software Directory */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs font-mono font-bold text-[#FBBF24] uppercase tracking-wider block">
              OPTICAL DIFFRACTION SIMULATION SOFTWARE DIRECTORY
            </span>
            <p className="text-xs text-[#94A3B8]">
              Comparison of Lumerical LSWM, GD-Calc®, Stanford S4, OghmaNano TMM, COMSOL, & Virtual Labs
            </p>
          </div>
          <button
            onClick={() => selectTab('PH3001_LABS')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38BDF8]/20 border border-[#38BDF8]/50 text-[#38BDF8] text-xs font-semibold hover:bg-[#38BDF8]/30 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            Open CAD Simulators →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SIMULATION_SOFTWARE_TOOLS.map((tool, idx) => (
            <div
              key={idx}
              className="bg-[#070B16] rounded-xl border border-[#283963] p-3.5 space-y-1.5"
            >
              <h4 className="text-xs font-bold text-[#F1F5F9]">{tool.name}</h4>
              <span className="text-[11px] font-mono text-[#38BDF8] block font-medium">
                {tool.method}
              </span>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Precautions (5.8) & Applications (5.9) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 sm:p-5 space-y-3 shadow-md">
          <span className="text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-[#38BDF8]" />
            5.8 PRECAUTIONARY MEASURES (PDF PAGES 8 & 10)
          </span>
          <div className="space-y-2">
            {SPECTROMETER_PRECAUTIONS.map((prec, i) => (
              <p key={i} className="text-xs text-slate-200 leading-relaxed pl-1">
                {prec}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 sm:p-5 space-y-3 shadow-md">
          <span className="text-xs font-mono font-bold text-[#34D399] uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-[#34D399]" />
            5.9 APPLICATIONS OF SPECTROMETER EXPERIMENT
          </span>
          <div className="space-y-2">
            {SPECTROMETER_APPLICATIONS.map((app, i) => (
              <p key={i} className="text-xs text-slate-200 leading-relaxed pl-1">
                {app}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Spectrometer Adjustment & Procedure Checklist */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 sm:p-5 shadow-lg space-y-3.5">
        <div>
          <span className="text-xs font-mono font-bold text-[#34D399] uppercase tracking-wider block">
            5.3 & 5.4 SPECTROMETER ADJUSTMENT & PROCEDURE CHECKLIST
          </span>
          <p className="text-xs text-[#94A3B8]">
            Interactive checklist of the four laboratory preparation stages described in the PH3001 manual
          </p>
        </div>

        <div className="space-y-2">
          {PROCEDURE_STEPS.map((step) => {
            const isCompleted = uiState.completedProcedureSteps.includes(step.stepNumber);
            return (
              <div
                key={step.stepNumber}
                onClick={() => toggleProcedureStep(step.stepNumber)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isCompleted
                    ? 'bg-[#34D399]/10 border-[#34D399]/40'
                    : 'bg-[#070B16] border-[#283963] hover:border-white/20'
                }`}
              >
                <div className="pt-0.5">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-[#34D399] text-[#070B16] flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[#64748B] flex items-center justify-center" />
                  )}
                </div>

                <div className="space-y-1">
                  <h4
                    className={`text-xs font-bold ${
                      isCompleted ? 'text-[#34D399]' : 'text-slate-100'
                    }`}
                  >
                    Step {step.stepNumber}: {step.title}
                  </h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{step.detail}</p>
                  <span className="text-[11px] font-mono text-[#38BDF8] block">
                    Formula Hint: {step.formulaHint}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Interactive Viva-Voce Quiz */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#283963]/60 pb-3 flex-wrap gap-2">
          <div>
            <span className="text-xs font-mono font-bold text-[#A78BFA] uppercase tracking-wider block">
              5.10 SAMPLE VIVA-VOCE QUESTIONS (PDF PAGE 10)
            </span>
            <span className="text-sm font-bold text-white font-mono">
              Score: {correctCount} / {VIVA_QUESTIONS.length} ({totalAnswered} answered)
            </span>
          </div>

          {totalAnswered > 0 && (
            <button
              onClick={resetVivaQuiz}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16203A] border border-[#283963] text-[#38BDF8] text-xs font-semibold hover:border-[#38BDF8] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Quiz
            </button>
          )}
        </div>

        <div className="space-y-4">
          {VIVA_QUESTIONS.map((q) => {
            const selectedIdx = uiState.selectedQuizAnswers[q.id];
            const isAnswered = selectedIdx !== undefined;
            const isCorrect = isAnswered && selectedIdx === q.correctIndex;

            return (
              <div
                key={q.id}
                className="bg-[#070B16] rounded-xl border border-[#283963] p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-[#A78BFA] bg-[#A78BFA]/10 px-2 py-0.5 rounded border border-[#A78BFA]/30">
                    {q.category}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-100">{q.question}</p>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    let borderClass = 'border-[#283963] bg-[#16203A] text-slate-300';
                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        borderClass = 'border-[#34D399] bg-[#34D399]/15 text-[#34D399] font-medium';
                      } else if (optIdx === selectedIdx) {
                        borderClass = 'border-[#F87171] bg-[#F87171]/15 text-[#F87171]';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => answerVivaQuestion(q.id, optIdx)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs border transition-all ${borderClass} hover:border-[#38BDF8]/60 disabled:cursor-default`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div
                    className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                      isCorrect
                        ? 'bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30'
                        : 'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30'
                    }`}
                  >
                    {isCorrect ? '✓ Correct! ' : '✗ Explanation: '}
                    {q.explanation}
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
