import React, { useState } from 'react';
import { useDiffractionLab } from './context/DiffractionLabContext';
import { LabHeaderHudBar } from './components/LabHeaderHudBar';
import { IitKanpurAndWhiteLightChannelBar } from './components/IitKanpurAndWhiteLightChannelBar';
import { DiffractionBottomNavBar } from './components/DiffractionBottomNavBar';
import { OpticalBenchTab } from './components/tabs/OpticalBenchTab';
import { SpectrometerTab } from './components/tabs/SpectrometerTab';
import { LabLogTab } from './components/tabs/LabLogTab';
import { Ph3001LabsTab } from './components/tabs/Ph3001LabsTab';
import { TheoryAndVivaTab } from './components/tabs/TheoryAndVivaTab';
import { DownloadApkModal } from './components/DownloadApkModal';

export const App: React.FC = () => {
  const { uiState } = useDiffractionLab();
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#070B16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Banner & Telemetry Header */}
      <header className="sticky top-0 z-40 bg-[#070B16]/95 backdrop-blur-md px-3 sm:px-6 pt-3 pb-2 border-b border-white/5 space-y-2">
        <LabHeaderHudBar onOpenApkModal={() => setIsApkModalOpen(true)} />
        <IitKanpurAndWhiteLightChannelBar />
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 pb-24">
        {uiState.selectedTab === 'OPTICAL_BENCH' && <OpticalBenchTab />}
        {uiState.selectedTab === 'SPECTROMETER' && <SpectrometerTab />}
        {uiState.selectedTab === 'LAB_LOG' && <LabLogTab />}
        {uiState.selectedTab === 'PH3001_LABS' && <Ph3001LabsTab />}
        {uiState.selectedTab === 'THEORY_VIVA' && <TheoryAndVivaTab />}
      </main>

      {/* Bottom Sticky Navigation */}
      <DiffractionBottomNavBar />

      {/* Download APK Modal */}
      <DownloadApkModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
};
