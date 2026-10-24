import React from 'react';
import { Prayogshala3DSpectrometerCanvas } from '../Prayogshala3DSpectrometerCanvas';
import { InterferenceFringeScreenStrip } from '../InterferenceFringeScreenStrip';
import { SpectrometerEyepieceAndTurntable } from '../SpectrometerEyepieceAndTurntable';
import { VernierScaleMagnifierCard } from '../VernierScaleMagnifierCard';
import { ParameterControlsDeck } from '../ParameterControlsDeck';

export const SpectrometerTab: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 space-y-4">
          <Prayogshala3DSpectrometerCanvas />
          <InterferenceFringeScreenStrip />
          <SpectrometerEyepieceAndTurntable />
          <VernierScaleMagnifierCard />
        </div>

        <div className="lg:col-span-5">
          <ParameterControlsDeck />
        </div>
      </div>
    </div>
  );
};
