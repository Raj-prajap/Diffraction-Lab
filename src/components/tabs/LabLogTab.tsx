import React, { useState } from 'react';
import { useDiffractionLab } from '../../context/DiffractionLabContext';
import { wavelengthToColor, DiffractionPhysics } from '../../utils/diffractionPhysics';
import { Trash2, Trash, Crosshair, Calculator, Check, Sparkles } from 'lucide-react';
import { DiffractionPeak } from '../../types/diffraction';

export const LabLogTab: React.FC = () => {
  const {
    uiState,
    linesPerInch,
    gratingElementCm,
    principalPeaks,
    nearestPeak,
    snapToSpecificPeak,
    recordCurrentObservation,
    deleteObservation,
    clearObservations,
  } = useDiffractionLab();

  // Screen Fringe Separation Calculator State
  const [calcLinesPerMm, setCalcLinesPerMm] = useState(300);
  const [calcScreenLCm, setCalcScreenLCm] = useState(100);
  const [useSymmetricalSn, setUseSymmetricalSn] = useState(true);
  const [measuredDistCm, setMeasuredDistCm] = useState(39.2);
  const [calcOrderN, setCalcOrderN] = useState(1);

  const dUm = 1000 / Math.max(10, calcLinesPerMm);
  const dMm = 1 / Math.max(10, calcLinesPerMm);
  const singleSideXCm = useSymmetricalSn ? measuredDistCm / 2 : measuredDistCm;
  const thetaRad = Math.atan2(singleSideXCm, calcScreenLCm);
  const thetaDeg = (thetaRad * 180) / Math.PI;
  const sinTheta = Math.sin(thetaRad);
  const solvedLambdaNm = Math.min(1500, Math.max(100, (dUm * 1000 * sinTheta) / calcOrderN));
  const solvedLambdaAngstrom = Math.round(solvedLambdaNm * 10);
  const swatchCol = wavelengthToColor(solvedLambdaNm);

  // Live Grating Equation Solver values
  const meanDeg = Math.max(0.01, Math.abs(uiState.telescopeAngleDeg));
  const sinThetaLive = Math.sin((meanDeg * Math.PI) / 180);
  const nearestOrder = nearestPeak?.order ? (nearestPeak.order === 0 ? 1 : Math.abs(nearestPeak.order)) : 1;
  const expLambdaNm = (uiState.slitSpacingUm * 1000 * sinThetaLive) / nearestOrder;
  const expLambdaAngstrom = Math.round(expLambdaNm * 10);
  const standardizedLinesPerMm = Math.round(sinThetaLive / (nearestOrder * 546.1e-6));
  const standardizedLinesPerInch = Math.round(standardizedLinesPerMm * 25.4);

  const violetRec = uiState.observations.find((r) => Math.round(r.trueWavelengthNm * 10) >= 4000 && Math.round(r.trueWavelengthNm * 10) <= 4200);
  const greenRec = uiState.observations.find((r) => Math.round(r.trueWavelengthNm * 10) >= 5300 && Math.round(r.trueWavelengthNm * 10) <= 5600);
  const redRec = uiState.observations.find((r) => Math.round(r.trueWavelengthNm * 10) >= 6200 && Math.round(r.trueWavelengthNm * 10) <= 6900);

  return (
    <div className="w-full space-y-4">
      {/* 0. 5-Step Screen Fringe Separation Laser Wavelength Calculator */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-[#FBBF24] uppercase tracking-wider flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-[#FBBF24]" />
            5-Step Laser Screen Fringe Calculator (θ = arctan(s_n / 2L))
          </span>
        </div>
        <p className="text-xs text-[#94A3B8]">
          Calculate wavelength λ from grating lines/mm, screen distance L, and measured fringe separation x or s_n:
        </p>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5">
          {[
            ['80 L/mm Laser (Physics Online)', 80, 10.2],
            ['300 L/mm He-Ne (IIT-B)', 300, 39.2],
            ['600 L/mm Green (532 nm)', 600, 67.6],
            ['500 L/mm Violet (405 nm)', 500, 41.4],
          ].map(([label, lpmm, defaultSn]) => (
            <button
              key={label as string}
              onClick={() => {
                setCalcLinesPerMm(lpmm as number);
                setCalcScreenLCm(100);
                setUseSymmetricalSn(true);
                setMeasuredDistCm(defaultSn as number);
                setCalcOrderN(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                Math.abs(calcLinesPerMm - (lpmm as number)) < 5
                  ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]'
                  : 'bg-[#16203A] text-[#94A3B8] border-[#283963] hover:text-white'
              }`}
            >
              {label as string}
            </button>
          ))}
        </div>

        {/* Mode Toggle & Order */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-1.5">
            <button
              onClick={() => setUseSymmetricalSn(true)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${
                useSymmetricalSn ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]' : 'bg-[#16203A] text-[#94A3B8] border-[#283963]'
              }`}
            >
              Symmetrical s_n (2x)
            </button>
            <button
              onClick={() => setUseSymmetricalSn(false)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${
                !useSymmetricalSn ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]' : 'bg-[#16203A] text-[#94A3B8] border-[#283963]'
              }`}
            >
              Single-side x
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs font-mono text-[#94A3B8] mr-1">Order:</span>
            {[1, 2, 3].map((nOrd) => (
              <button
                key={nOrd}
                onClick={() => setCalcOrderN(nOrd)}
                className={`w-7 h-7 rounded text-xs font-mono font-bold border ${
                  calcOrderN === nOrd ? 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]' : 'bg-[#16203A] text-[#94A3B8] border-[#283963]'
                }`}
              >
                n={nOrd}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-2 pt-1">
          <div>
            <div className="flex justify-between text-xs font-mono text-[#F1F5F9] mb-1">
              <span>1. Grating Density: {Math.round(calcLinesPerMm)} lines/mm ({Math.round(calcLinesPerMm * 25.4)} LPI) ⟹ d = {dUm.toFixed(3)} µm</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              value={calcLinesPerMm}
              onChange={(e) => setCalcLinesPerMm(parseFloat(e.target.value))}
              className="w-full accent-[#38BDF8]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs font-mono text-[#F1F5F9] mb-1">
                <span>2. Screen Distance L: {Math.round(calcScreenLCm)} cm</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                value={calcScreenLCm}
                onChange={(e) => setCalcScreenLCm(parseFloat(e.target.value))}
                className="w-full accent-[#34D399]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-[#F1F5F9] mb-1">
                <span>3. {useSymmetricalSn ? 'Span s_n' : 'Spot x'}: {measuredDistCm.toFixed(1)} cm</span>
              </div>
              <input
                type="range"
                min="2"
                max="140"
                step="0.2"
                value={measuredDistCm}
                onChange={(e) => setMeasuredDistCm(parseFloat(e.target.value))}
                className="w-full accent-[#FBBF24]"
              />
            </div>
          </div>
        </div>

        {/* Step-by-Step Solution Box */}
        <div className="rounded-xl bg-[#070B16] border border-[#24355C] p-3 space-y-1.5 text-xs font-mono">
          <p className="text-[#94A3B8]">
            Step 1 (Grating Spacing d): d = 1 / ({Math.round(calcLinesPerMm)} lines/mm) = {dMm.toFixed(5)} mm = {(dUm * 1000).toFixed(2)} nm
          </p>
          <p className="text-[#94A3B8]">
            {useSymmetricalSn
              ? `Step 2 (Half-Distance x): x = s_n / 2 = ${measuredDistCm.toFixed(2)} / 2 = ${singleSideXCm.toFixed(2)} cm`
              : `Step 2 (Measured Spot Distance x): x = ${singleSideXCm.toFixed(2)} cm`}
          </p>
          <p className="text-[#38BDF8]">
            Step 3 (Angle θ): θ = arctan(x / L) = arctan({singleSideXCm.toFixed(2)} / {calcScreenLCm}) = {thetaDeg.toFixed(2)}° (sin θ = {sinTheta.toFixed(4)})
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="w-3.5 h-3.5 rounded-full inline-block border border-white/60" style={{ backgroundColor: swatchCol }} />
            <span className="text-sm font-bold" style={{ color: swatchCol }}>
              Step 4 (Solve λ = d sin θ / n): λ = {solvedLambdaNm.toFixed(1)} nm ({solvedLambdaAngstrom} Å)
            </span>
          </div>
        </div>
      </div>

      {/* 1. Live Grating Equation Solver Card */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 space-y-3 shadow-md">
        <span className="text-xs font-mono font-semibold text-[#38BDF8] uppercase tracking-wider block">
          5.6 Grating Equation Solver (e · sin θ = n · λ)
        </span>

        <div className="rounded-xl bg-[#070B16] border border-[#22335A] p-3 space-y-2 text-xs font-mono">
          <p className="text-[#34D399]">
            Aim 1 (Standardize Grating N from Hg Green 5461 Å): N = sin θ / (n · λ_std)
          </p>
          <p className="text-white">
            If θ = {meanDeg.toFixed(2)}° is Hg Green (n={nearestOrder}) ⟹ N_exp = {standardizedLinesPerMm} lines/mm ({standardizedLinesPerInch} LPI)
          </p>
          <div className="border-t border-[#22335A] pt-2">
            <p className="text-[#FBBF24]">Aim 2 (Unknown Wavelength λ from Grating e = 2.54 / N cm):</p>
            <p className="text-base font-bold text-[#FBBF24] mt-0.5">
              λ_exp = (e · sin θ) / n = {expLambdaAngstrom} Å ({expLambdaNm.toFixed(1)} nm)
            </p>
          </div>
        </div>

        <button
          onClick={recordCurrentObservation}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#38BDF8] text-[#041326] hover:bg-[#0284C7] hover:text-white transition-all shadow-md"
        >
          Log V₁ & V₂ Reading (θ = {uiState.telescopeAngleDeg.toFixed(2)}° • {expLambdaAngstrom} Å)
        </button>
      </div>

      {/* 2. Observable Principal Maxima Explorer */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 space-y-3 shadow-md">
        <span className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider block">
          Observable Principal Maxima Orders (Tap to Aim Telescope)
        </span>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {principalPeaks.map((peak) => {
            const col = wavelengthToColor(peak.spectralLine.wavelengthNm);
            const orderStr = peak.order > 0 ? `+${peak.order}` : `${peak.order}`;
            return (
              <div
                key={`${peak.order}-${peak.spectralLine.name}`}
                onClick={() => snapToSpecificPeak(peak)}
                className="min-w-[140px] bg-[#16203A] rounded-xl p-2.5 border cursor-pointer hover:border-white/50 transition-all space-y-1"
                style={{ borderColor: col }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col }} />
                  <span className="text-xs font-bold text-white font-mono">Order n = {orderStr}</span>
                </div>
                <div className="text-[11px] font-mono text-[#38BDF8]">
                  θ = {peak.angleDeg.toFixed(2)}° | x = {peak.screenYCm.toFixed(1)} cm
                </div>
                <div className="text-[10px] text-[#94A3B8] truncate">
                  {peak.spectralLine.name} ({Math.round(peak.spectralLine.wavelengthNm * 10)} Å)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 5.5 Observation Table */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider block">
              5.5 Observation Table (MS, VS, Total a & b, 2θ, θ)
            </span>
            <span className="text-[11px] font-mono text-[#94A3B8]">
              N = {linesPerInch.toLocaleString()} lines/in • 1 MSD = 0.5° • VSD = {uiState.vernierDivisions} • LC = {uiState.vernierDivisions === 60 ? '30″' : '1′'}
            </span>
          </div>

          {uiState.observations.length > 0 && (
            <button
              onClick={clearObservations}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/40 hover:bg-[#F87171]/30 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        {uiState.observations.length === 0 ? (
          <div className="rounded-xl bg-[#070B16] p-8 text-center space-y-2 border border-[#24355C]">
            <p className="text-sm font-semibold text-white">No observations logged yet</p>
            <p className="text-xs text-[#94A3B8]">
              Align the telescope crosshair onto any diffracted order and tap "Record Reading" to populate your V₁/V₂ lab table.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {uiState.observations.map((record) => {
              const lineCol = wavelengthToColor(record.trueWavelengthNm);
              const v1L = DiffractionPhysics.toVernierReading(record.v1LeftDeg);
              const v1R = DiffractionPhysics.toVernierReading(record.v1RightDeg);
              const v2L = DiffractionPhysics.toVernierReading(record.v2LeftDeg);
              const v2R = DiffractionPhysics.toVernierReading(record.v2RightDeg);

              return (
                <div
                  key={record.id}
                  className="rounded-xl bg-[#070B16] border border-[#283963] p-3 space-y-2 text-xs font-mono"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lineCol }} />
                      <span className="font-bold text-white text-sm">
                        n = {record.order} • {record.sourceLabel}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteObservation(record.id)}
                      className="text-[#94A3B8] hover:text-[#F87171] p-1 transition-colors"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-[#94A3B8] text-[11px] leading-relaxed">
                    <p>
                      V₁ Left(a): MS={v1L.mainScaleDeg.toFixed(1)}° VS={v1L.vernierCoincidence}div ({record.v1LeftDeg.toFixed(2)}°) | Right(b): MS={v1R.mainScaleDeg.toFixed(1)}° VS={v1R.vernierCoincidence}div (+{record.v1RightDeg.toFixed(2)}°) | 2θ₁={record.v1TwoThetaDeg.toFixed(2)}°
                    </p>
                    <p>
                      V₂ Left(a): MS={v2L.mainScaleDeg.toFixed(1)}° VS={v2L.vernierCoincidence}div ({record.v2LeftDeg.toFixed(2)}°) | Right(b): MS={v2R.mainScaleDeg.toFixed(1)}° VS={v2R.vernierCoincidence}div ({record.v2RightDeg.toFixed(2)}°) | 2θ₂={record.v2TwoThetaDeg.toFixed(2)}°
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-[#1E293B]">
                    <span className="text-[#FBBF24]">
                      Avg (2θ) = {record.twoThetaDeg.toFixed(2)}° ⟹ Angle θ = {record.meanThetaDeg.toFixed(2)}°
                    </span>
                    <span
                      className={`font-bold ${
                        record.percentError < 2.0 ? 'text-[#34D399]' : 'text-[#FBBF24]'
                      }`}
                    >
                      λ = {Math.round(record.calculatedWavelengthNm * 10)} Å (Std {Math.round(record.trueWavelengthNm * 10)} Å • Err {record.percentError.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. 5.6 & 5.7 Results & Percentage Error Summary Card */}
      <div className="rounded-2xl bg-[#0E1528] border border-[#283963] p-4 space-y-2.5 shadow-md">
        <span className="text-xs font-mono font-semibold text-[#34D399] uppercase tracking-wider block">
          5.6 & 5.7 Calculation, Results & Percentage Error (PDF Page 8)
        </span>
        <p className="text-xs font-mono text-white">
          Grating Element e = 2.54 / N = 2.54 / {linesPerInch.toLocaleString()} = {gratingElementCm.toExponential(4)} cm
        </p>
        <p className="text-[11px] font-mono text-[#94A3B8]">
          Standard Wavelength Values: Violet = 4046 Å | Green = 5461 Å | Red = 6800 Å
        </p>

        <div className="rounded-xl bg-[#070B16] border border-[#283963] p-3 space-y-1.5 text-xs font-mono">
          <p className="text-[#A78BFA]">
            • Wavelength of Violet line (θ_V = {violetRec ? violetRec.meanThetaDeg.toFixed(2) : '13.82'}°) = {violetRec ? Math.round(violetRec.calculatedWavelengthNm * 10) : 4046} Å (Error: {violetRec ? violetRec.percentError.toFixed(2) : '0.00'}%)
          </p>
          <p className="text-[#34D399]">
            • Wavelength of Green line (θ_G = {greenRec ? greenRec.meanThetaDeg.toFixed(2) : '18.82'}°) = {greenRec ? Math.round(greenRec.calculatedWavelengthNm * 10) : 5461} Å (Error: {greenRec ? greenRec.percentError.toFixed(2) : '0.00'}%)
          </p>
          <p className="text-[#F87171]">
            • Wavelength of Red line (θ_R = {redRec ? redRec.meanThetaDeg.toFixed(2) : '23.68'}°) = {redRec ? Math.round(redRec.calculatedWavelengthNm * 10) : 6800} Å (Error: {redRec ? redRec.percentError.toFixed(2) : '0.00'}%)
          </p>
        </div>
      </div>
    </div>
  );
};
