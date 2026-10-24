import React, { useState } from 'react';
import {
  Download,
  Github,
  Smartphone,
  ExternalLink,
  X,
  CheckCircle,
  ShieldCheck,
  Box,
  Apple,
  Share,
  PlusSquare,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ isOpen, onClose }) => {
  const { deferredPrompt, isInstalled, isIOS, isAndroid, triggerInstall } = usePWAInstall();
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'offline'>(
    isIOS ? 'ios' : 'android'
  );

  if (!isOpen) return null;

  const repoUrl = 'https://github.com/yash-prajapati2602722/Diffraction-Lab';
  const releasesUrl = `${repoUrl}/releases`;
  const directApkUrl = `${repoUrl}/releases/latest/download/app-release.apk`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0E1528] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl text-slate-200 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/30 rounded-xl border border-cyan-500/40 text-cyan-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Mobile App Development & Install
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                Android & iOS
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Run Diffraction Lab as a native mobile app or download the compiled APK
            </p>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex rounded-xl bg-[#070B16] p-1 border border-white/5">
          <button
            onClick={() => setActivePlatform('android')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activePlatform === 'android'
                ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Android (APK & PWA)</span>
          </button>
          <button
            onClick={() => setActivePlatform('ios')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activePlatform === 'ios'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4 text-purple-400" />
            <span>iOS (iPhone & iPad)</span>
          </button>
          <button
            onClick={() => setActivePlatform('offline')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activePlatform === 'offline'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <WifiOff className="w-4 h-4 text-emerald-400" />
            <span>Offline Ready</span>
          </button>
        </div>

        {/* Tab 1: Android (APK & Native PWA) */}
        {activePlatform === 'android' && (
          <div className="space-y-3 animate-in fade-in">
            {/* Install Native PWA Button (if browser supports) */}
            {deferredPrompt && (
              <button
                onClick={triggerInstall}
                className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-xl shadow-lg shadow-emerald-900/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      Install PWA App on Android
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    </div>
                    <div className="text-[11px] text-emerald-100 font-mono">
                      Installs directly to your home screen with zero downloading
                    </div>
                  </div>
                </div>
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-md font-semibold">Install Now</span>
              </button>
            )}

            {/* Download GitHub APK Release */}
            <a
              href={releasesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-cyan-900/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    Download APK from GitHub Releases
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </div>
                  <div className="text-[11px] text-cyan-100 font-mono">
                    Diffraction-Lab-v1.0.apk • Android 7.0+ (Nougat to 15)
                  </div>
                </div>
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-md font-semibold">APK</span>
            </a>

            {/* Direct Latest Release Asset Link */}
            <a
              href={directApkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-[#16203A] hover:bg-[#1C294A] border border-white/10 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Box className="w-4 h-4 text-cyan-400" />
                <span>Direct Link: app-release.apk (Latest Build)</span>
              </div>
              <span className="text-cyan-400 text-[11px]">Download →</span>
            </a>

            {/* GitHub Repository Link */}
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-[#16203A] hover:bg-[#1C294A] border border-white/10 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Github className="w-4 h-4 text-slate-300" />
                <span>GitHub Source: yash-prajapati2602722/Diffraction-Lab</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* Quick Android Instructions */}
            <div className="p-3 bg-[#070B16] border border-white/5 rounded-xl text-xs text-slate-400 space-y-1.5">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Android Installation Tip:
              </div>
              <p className="text-[11px] leading-relaxed">
                If downloading the APK, enable <span className="text-white font-medium">"Install Unknown Apps"</span> in Chrome/Files when prompted. Alternatively, install the PWA for instant home screen access!
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: iOS (iPhone & iPad Safari) */}
        {activePlatform === 'ios' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-semibold text-sm">
                <Apple className="w-5 h-5 text-purple-400" />
                Install on iPhone or iPad (Safari):
              </div>
              <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside pl-1">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white shrink-0">1.</span>
                  <span>
                    Open this application in <span className="text-white font-medium">Safari</span> on your iPhone or iPad.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white shrink-0">2.</span>
                  <span className="flex items-center gap-1.5 flex-wrap">
                    Tap the <Share className="w-4 h-4 text-cyan-400 inline" /> <span className="text-white font-medium">Share</span> button in Safari's bottom toolbar.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white shrink-0">3.</span>
                  <span className="flex items-center gap-1.5 flex-wrap">
                    Scroll down and tap <PlusSquare className="w-4 h-4 text-emerald-400 inline" /> <span className="text-emerald-300 font-medium">"Add to Home Screen"</span>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white shrink-0">4.</span>
                  <span>
                    Tap <span className="text-cyan-400 font-medium">Add</span> in the top-right corner.
                  </span>
                </li>
              </ol>
            </div>

            <div className="p-3 bg-[#070B16] border border-white/5 rounded-xl text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-white">Native iOS Experience:</div>
              <p className="text-[11px] leading-relaxed">
                When launched from the Home Screen, Diffraction Lab opens in full-screen standalone mode without the Safari address bar, just like an App Store app!
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Offline Ready */}
        {activePlatform === 'offline' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Service Worker & Offline Cache Active
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Diffraction Lab utilizes a built-in Service Worker with precaching. All 3D canvases, optical formulas, laboratory tables, and GTU lab manuals (PDFs) are stored locally in your device cache.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-[#070B16] rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[10px]">App Status:</span>
                <span className="text-cyan-300 font-bold">{isInstalled ? 'Installed (Standalone)' : 'Web App / Browser'}</span>
              </div>
              <div className="p-2.5 bg-[#070B16] rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[10px]">Network Independence:</span>
                <span className="text-emerald-400 font-bold">100% Offline Compatible</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" /> Full Android & iOS Mobile Support
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
