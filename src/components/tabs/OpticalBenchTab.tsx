import React from 'react';
import { IitKanpurAndWhiteLightChannelBar } from '../IitKanpurAndWhiteLightChannelBar';
import { Prayogshala3DSpectrometerCanvas } from '../Prayogshala3DSpectrometerCanvas';
import { InterferenceFringeScreenStrip } from '../InterferenceFringeScreenStrip';
import { OpticalBenchRayCanvas } from '../OpticalBenchRayCanvas';
import { IntensityProfileCurveCanvas } from '../IntensityProfileCurveCanvas';
import { ParameterControlsDeck } from '../ParameterControlsDeck';

export const OpticalBenchTab: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      <IitKanpurAndWhiteLightChannelBar />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 space-y-4">
          <Prayogshala3DSpectrometerCanvas />
          <InterferenceFringeScreenStrip />
          <OpticalBenchRayCanvas />
          <IntensityProfileCurveCanvas />
        </div>

        <div className="lg:col-span-5">
          <ParameterControlsDeck />
        </div>
      </div>
    </div>
  );
};
