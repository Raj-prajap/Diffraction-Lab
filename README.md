# Diffraction Lab — 3D Grating Spectrometer & Photonic CAD Virtual Physics Lab

[![Live Web App](https://img.shields.io/badge/Live%20App-Online-cyan?style=for-the-badge&logo=googlechrome)](https://ais-pre-oqvypftn4chdgxxro6rubg-772571440007.asia-northeast1.run.app)
[![Download Android APK](https://img.shields.io/badge/Download-Android%20APK%20(.apk)-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://ais-pre-oqvypftn4chdgxxro6rubg-772571440007.asia-northeast1.run.app/downloads/Diffraction-Lab.apk)
[![Download iOS IPA](https://img.shields.io/badge/Download-iOS%20App%20(.ipa)-white?style=for-the-badge&logo=apple&logoColor=black)](https://ais-pre-oqvypftn4chdgxxro6rubg-772571440007.asia-northeast1.run.app/downloads/Diffraction-Lab.ipa)
[![GitHub Releases](https://img.shields.io/badge/GitHub-Releases%20(.apk%20%26%20.ipa)-black?style=for-the-badge&logo=github)](https://github.com/yash-prajapati2602722/Diffraction-Lab/releases)

An interactive, responsive virtual physics laboratory application built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Vite**, featuring full **Progressive Web App (PWA)** support alongside direct download and installation of native mobile packages for **Android (`.apk`)** and **iOS (`.ipa`)**.

Simulates **Diffraction Grating Spectrometers**, **Laser Screen Fringe Wavelength Determination**, **Sub-Wavelength Photonic Gratings (GD-Calc® / Lumerical LSWM)**, **DFB Bragg Gratings (TMM)**, and the complete **PH3001(P) Applied Physics Lab Manual** experiment suite.

---

## 📥 Direct App Downloads (Android & iOS)

Users can download and install the standalone mobile apps directly using the links below:

| Platform | Format | Direct Download Link | Alternative GitHub Repo Link |
| :--- | :--- | :--- | :--- |
| **🤖 Android** | `.apk` (Package) | [**⬇️ Download Android APK (Direct)**](https://ais-pre-oqvypftn4chdgxxro6rubg-772571440007.asia-northeast1.run.app/downloads/Diffraction-Lab.apk) | [public/downloads/Diffraction-Lab.apk](./public/downloads/Diffraction-Lab.apk) |
| **🍏 iOS (iPhone / iPad)** | `.ipa` (Package) | [**⬇️ Download iOS IPA (Direct)**](https://ais-pre-oqvypftn4chdgxxro6rubg-772571440007.asia-northeast1.run.app/downloads/Diffraction-Lab.ipa) | [public/downloads/Diffraction-Lab.ipa](./public/downloads/Diffraction-Lab.ipa) |
| **🌐 Web / PWA App** | Live URL | [**🚀 Open Live Web & PWA App**](https://ais-pre-oqvypftn4chdgxxro6rubg-772571440007.asia-northeast1.run.app) | [Development Server URL](https://ais-dev-oqvypftn4chdgxxro6rubg-772571440007.asia-northeast1.run.app) |
| **📦 GitHub Releases** | All Assets | [**🏷️ View All Releases (.apk & .ipa)**](https://github.com/yash-prajapati2602722/Diffraction-Lab/releases) | GitHub Actions CI/CD Pipeline |

---

## 📲 How to Install

### 🤖 Android Installation Guide (`.apk`)
1. Click the [**Download Android APK**](https://ais-pre-oqvypftn4chdgxxro6rubg-772571440007.asia-northeast1.run.app/downloads/Diffraction-Lab.apk) link on your Android device (phone, tablet, or emulator).
2. When the file finishes downloading (`Diffraction-Lab.apk`), tap **Open**.
3. If prompted with *"For your security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** and toggle **"Allow from this source"**.
4. Tap **Install** and open **Diffraction Lab** from your home screen or app drawer.
5. *Alternative*: You can also install as a PWA directly in Chrome by tapping the **"Download .APK / .IPA"** button in the app header and selecting **"Install PWA App"**.

### 🍏 iOS Installation Guide (`.ipa` & PWA)
#### Method A: Direct PWA Install via Safari (Instant, No PC required)
1. Open the [**Live Web App**](https://ais-pre-oqvypftn4chdgxxro6rubg-772571440007.asia-northeast1.run.app) in **Safari** on your iPhone or iPad.
2. Tap the **Share** button ($\uparrow$) at the bottom of Safari.
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add** in the top right corner. The Diffraction Lab icon will appear on your iOS home screen as a full standalone app with full offline support.

#### Method B: Native `.ipa` Sideloading (AltStore / Sideloadly)
1. Download the [**Diffraction-Lab.ipa**](https://ais-pre-oqvypftn4chdgxxro6rubg-772571440007.asia-northeast1.run.app/downloads/Diffraction-Lab.ipa) file to your computer or iPhone.
2. Use **AltStore**, **Sideloadly**, or **Scarlet** to sign and sideload `Diffraction-Lab.ipa` onto your iOS device.
3. On your iPhone, navigate to **Settings > General > VPN & Device Management**, tap your developer certificate, and tap **"Trust"**.

---

## ✨ Key Features & Experiments

### 1. Free-Form 3D Spectrometer & Grating Model (`Spectrometer` Tab)
- **Full 6-DOF Touch & Mouse Camera Controller**:
  - **Orbit (360° Yaw & $\pm 88^\circ$ Pitch)**: Inspect the 3D spectrometer, collimator, grating clamp, and telescope from any angle.
  - **Pan ($X, Y$) & Pinch-to-Zoom**: Pan across the optical bench; inspect the mercury lamp housing, collimator slit, turntable leveling screws, or Vernier windows $V_1$ and $V_2$.
- **Hardware Anatomy & Optical Modes**:
  - **Figure 5.1(b) Callout Pins**: Labeled 3D markers for all 15 spectrometer components.
  - **Floating PiP Eyepiece**: Live Picture-in-Picture reticle ($\times$, $+$, or $\parallel$) with Schuster focusing and adjustable slit width.

### 2. Optical Bench & Screen Fringe Calculator (`Optical Bench` & `Lab Log` Tabs)
- **IIT-Kanpur VLab Apparatus Assembly Bar**:
  - Interactive laser source toggle, grating insertion in optical path, and white-light dispersion with single-color channel isolation (Violet, Blue, Cyan, Green, Yellow, Orange, Red).
- **2D/3D Ray Optics & Animated Wavefronts**:
  - Multi-slit grating ($N = 15,000 \text{ LPI}$), single-slit Heisenberg uncertainty ($\Delta y \cdot \Delta p_y \ge h$), and thin wire laser diffraction ($d = D\lambda/b$).
- **5-Step Screen Fringe Wavelength Calculator**:
  - Computes grating spacing $d = 2.54 / N_{\text{LPI}}$, diffraction angle $\theta = \arctan(x / L) = \arctan(s_n / 2L)$, and wavelength $\lambda = (d \sin\theta) / n$.
- **5.5 Observation Table**:
  - Live logging for Vernier $V_1$ and $V_2$ Left & Right readings with automatic Degrees-Minutes-Seconds (DMS) calculation and percentage error determination.

### 3. Photonic Grating CAD & PH3001(P) Companion Simulators (`PH3001 Labs` Tab)
- **GD-Calc® & Lumerical Sub-λ RCWA / EMT Solver**: Zero-order Effective Medium Theory and subwavelength cutoff criterion with TE/TM polarization.
- **DFB Fiber & Waveguide Bragg Grating CAD**: Coupled mode theory (CMT), transfer matrix method (TMM), and stopband reflectivity.
- **Newton's Rings & Traveling Microscope**: Air/liquid wedge film ring diameter calculations ($D_n^2 - D_m^2 = 4(n-m)R\lambda/\mu$).
- **Optical Fiber Numerical Aperture (N.A.)**: Screen emergence cone geometry and acceptance half-angle ($\text{NA} = \sin\theta_a = \sqrt{n_1^2 - n_2^2}$).
- **Planck's Constant ($h$) via LED $V-I$**: Photoelectric bandgap knee-point voltage and linear regression slope analysis ($h = e V_{\text{th}} \lambda / c$).
- **Micrometer Screw Gauge & Vernier LC Trainer**: Interactive sleeve and rotating thimble reading simulation.

### 4. Theory, Lab Manual PDFs & Viva Voce (`Theory & Viva` Tab)
- **Embedded PDF Lab Manuals**: Direct access to GTU / Applied Physics 2026 and Experiment 5 Wavelength manuals.
- **Interactive Exp. 5 Flowchart (Manual Page 9)**: Step-by-step optical alignment with **"Simulate in 3D"** buttons that turn telescope and prism table automatically.
- **11 Comprehensive Viva-Voce Questions**: Interactive quiz with real-time scoring, instant option feedback, and physical explanations.
- **Optical Simulation Software Directory**: Comparison of Ansys Lumerical LSWM, GD-Calc RCWA, Stanford S4, OghmaNano TMM, and COMSOL.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Mobile Packaging**: Android APK (`.apk`), iOS IPA (`.ipa`), and PWA (`vite-plugin-pwa`)
- **CI/CD Pipeline**: GitHub Actions (`.github/workflows/build-and-release-apps.yml`)
- **Physics Engine**: Precision analytical diffraction & interference formulas

---

## 🚀 Development & Build

```bash
# Install dependencies
npm install

# Start local dev server (port 3000)
npm run dev

# Run TypeScript check & build production bundle
npm run build
```

---

## 📄 License & Credits
Developed for **Applied Physics PH3001(P)**, **PrayogShala**, and **IIT-K / Amrita Virtual Labs**. Open for educational physics simulation and research.
