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
  Layers,
  FileCode,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ isOpen, onClose }) => {
  const { deferredPrompt, isInstalled, isIOS, triggerInstall } = usePWAInstall();
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'offline'>(
    isIOS ? 'ios' : 'android'
  );

  if (!isOpen) return null;

  const repoUrl = 'https://github.com/yash-prajapati2602722/Diffraction-Lab';
  const releasesUrl = `${repoUrl}/releases`;
  const githubApkUrl = `${releasesUrl}/latest/download/Diffraction-Lab.apk`;
  const githubIpaUrl = `${releasesUrl}/latest/download/Diffraction-Lab.ipa`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0E1528] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl text-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
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
              Download App (.APK & .IPA)
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                v1.0 Ready
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Direct downloads and installation for Android (.apk), iOS (.ipa), and PWA
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
            <span>Android (.APK)</span>
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
            <span>iOS (.IPA)</span>
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
            <span>Offline PWA</span>
          </button>
        </div>

        {/* Tab 1: Android (.APK) */}
        {activePlatform === 'android' && (
          <div className="space-y-3 animate-in fade-in">
            {/* Primary Direct Download APK */}
            <a
              href="/downloads/Diffraction-Lab.apk"
              download="Diffraction-Lab.apk"
              className="flex items-center justify-between p-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-cyan-900/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    Download Android Package (Diffraction-Lab.apk)
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">Direct File</span>
                  </div>
                  <div className="text-[11px] text-cyan-100 font-mono">
                    Instant Download • Android 7.0+ (ARM64 / x86_64)
                  </div>
                </div>
              </div>
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-lg font-bold">.APK</span>
            </a>

            {/* GitHub Releases Link */}
            <a
              href={releasesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-[#16203A] hover:bg-[#1C294A] border border-white/10 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Github className="w-4 h-4 text-cyan-400" />
                <span>GitHub Releases: Diffraction-Lab.apk (Latest v1.0)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* PWA Home Screen Install (if available) */}
            {deferredPrompt && (
              <button
                onClick={triggerInstall}
                className="w-full flex items-center justify-between p-3 bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Or Install PWA directly into Android App Drawer (No APK needed)</span>
                </div>
                <span className="text-xs bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-200">1-Tap</span>
              </button>
            )}

            {/* Android Instructions */}
            <div className="p-3 bg-[#070B16] border border-white/5 rounded-xl text-xs text-slate-400 space-y-1.5">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> How to Install on Android:
              </div>
              <ol className="space-y-1 text-slate-300 list-decimal list-inside pl-1 text-[11px]">
                <li>Tap <span className="text-cyan-300 font-medium">Download Android Package (.apk)</span> above.</li>
                <li>When the file finishes downloading, tap <span className="text-white font-medium">Open</span>.</li>
                <li>If prompted with "Install unknown apps", toggle <span className="text-white font-medium">Allow from this source</span>.</li>
                <li>Tap <span className="text-emerald-400 font-medium">Install</span>. The app is immediately ready!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 2: iOS (.IPA & Safari) */}
        {activePlatform === 'ios' && (
          <div className="space-y-3 animate-in fade-in">
            {/* Primary Direct Download IPA */}
            <a
              href="/downloads/Diffraction-Lab.ipa"
              download="Diffraction-Lab.ipa"
              className="flex items-center justify-between p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-purple-900/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    Download iOS Package (Diffraction-Lab.ipa)
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">Direct File</span>
                  </div>
                  <div className="text-[11px] text-purple-100 font-mono">
                    For AltStore, Sideloadly, TrollStore, or TestFlight
                  </div>
                </div>
              </div>
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-lg font-bold">.IPA</span>
            </a>

            {/* GitHub Releases Link */}
            <a
              href={releasesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-[#16203A] hover:bg-[#1C294A] border border-white/10 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Github className="w-4 h-4 text-purple-400" />
                <span>GitHub Releases: Diffraction-Lab.ipa (Latest v1.0)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* Instant iOS Safari Install (Recommended for iPhone/iPad) */}
            <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-semibold text-sm">
                  <Apple className="w-5 h-5 text-purple-400" />
                  Easiest on iPhone/iPad: Safari Add to Home Screen
                </div>
                <span className="text-[10px] bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded font-mono">
                  Recommended
                </span>
              </div>
              <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside pl-1 text-[11px]">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white shrink-0">1.</span>
                  <span>Open this website in <span className="text-white font-medium">Safari</span> on your iPhone/iPad.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white shrink-0">2.</span>
                  <span className="flex items-center gap-1.5 flex-wrap">
                    Tap the <Share className="w-3.5 h-3.5 text-cyan-400 inline" /> <span className="text-white font-medium">Share</span> button in Safari toolbar.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white shrink-0">3.</span>
                  <span className="flex items-center gap-1.5 flex-wrap">
                    Select <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" /> <span className="text-emerald-300 font-medium">"Add to Home Screen"</span> and tap <span className="text-cyan-400 font-medium">Add</span>.
                  </span>
                </li>
              </ol>
            </div>

            {/* Sideloading Instructions */}
            <div className="p-3 bg-[#070B16] border border-white/5 rounded-xl text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-white">Using the .IPA file:</div>
              <p className="text-[11px] leading-relaxed">
                Use <span className="text-cyan-300 font-medium">AltStore</span>, <span className="text-cyan-300 font-medium">Sideloadly</span>, or <span className="text-cyan-300 font-medium">TrollStore</span> on Mac/PC to sign and install the downloaded <code className="text-purple-300">Diffraction-Lab.ipa</code> onto your device.
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

        {/* Repository info */}
        <div className="flex items-center justify-between p-3 bg-[#070B16] border border-white/5 rounded-xl text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-slate-300" />
            <span className="truncate max-w-[280px]">yash-prajapati2602722/Diffraction-Lab</span>
          </div>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline flex items-center gap-1 shrink-0"
          >
            Repo <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" /> Android .apk & iOS .ipa Ready
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
