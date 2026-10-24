# Diffraction Lab — 3D Grating Spectrometer & Photonic CAD Virtual Physics Lab

An interactive, responsive virtual physics laboratory application built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Vite**, featuring full **Progressive Web App (PWA)** support for **Android** and **iOS** mobile devices, alongside direct GitHub Release APK installation.

Simulates **Diffraction Grating Spectrometers**, **Laser Screen Fringe Wavelength Determination**, **Sub-Wavelength Photonic Gratings (GD-Calc® / Lumerical LSWM)**, **DFB Bragg Gratings (TMM)**, and the complete **PH3001(P) Applied Physics Lab Manual** experiment suite.

---

## ✨ Key Features

### 1. Free-Form 3D Spectrometer & Grating Model (`Spectrometer` Tab)
- **Full 6-DOF Touch & Mouse Camera Controller**:
  - **Orbit (360° Yaw & $\pm 88^\circ$ Pitch)**: Inspect the 3D spectrometer, collimator, grating clamp, and telescope from any angle.
  - **Pan ($X, Y$) & Pinch-to-Zoom**: Pan across the optical bench; inspect the mercury lamp housing, collimator slit, turntable leveling screws, or Vernier windows $V_1$ and $V_2$.
- **Hardware Anatomy & Optical Modes**:
  - **Figure 5.1(b) Callout Pins**: Labeled 3D markers for all 15 spectrometer components.
  - **Floating PiP Eyepiece**: Live Picture-in-Picture reticle ($\times$, $+$, or $\parallel$) with Schuster focusing and adjustable slit width.

### 2. Optical Bench & Screen Fringe Calculator (`Optical Bench` & `Lab Log` Tabs)
- **2D/3D Ray Optics & Animated Wavefronts**:
  - Interactive multi-slit grating, single-slit Heisenberg uncertainty, and thin wire laser diffraction modes.
- **5-Step Screen Fringe Wavelength Calculator**:
  - Computes grating spacing $d = 2.54 / N_{\text{LPI}}$, diffraction angle $\theta = \arctan(x / L)$, and wavelength $\lambda = (d \sin\theta) / n$.
- **5.5 Observation Table**:
  - Live logging for Vernier $V_1$ and $V_2$ Left & Right readings with automatic Degrees-Minutes-Seconds (DMS) calculation and percentage error determination.

### 3. Photonic Grating CAD & PH3001(P) Companion Simulators (`PH3001 Labs` Tab)
- **GD-Calc® & Lumerical Sub-λ RCWA / EMT Solver**: Zero-order Effective Medium Theory and subwavelength cutoff criterion.
- **DFB Fiber & Waveguide Bragg Grating CAD**: Coupled mode theory (CMT), transfer matrix method (TMM), and stopband reflectivity.
- **Newton's Rings & Traveling Microscope**: Air/liquid wedge film ring diameter calculations ($D_n^2 = 4nR\lambda/\mu$).
- **Optical Fiber Numerical Aperture (N.A.)**: Screen emergence cone geometry and acceptance half-angle.
- **Planck's Constant ($h$) via LED $V-I$**: Photoelectric bandgap knee-point voltage and linear regression slope analysis.
- **Micrometer Screw Gauge & Vernier LC Trainer**: Interactive sleeve and rotating thimble reading simulation.

### 4. Theory, Lab Manual PDFs & Viva Voce (`Theory & Viva` Tab)
- **Embedded PDF Lab Manuals**: Direct access to GTU / Applied Physics 2026 and Experiment 5 Wavelength manuals.
- **Interactive Flowchart**: Step-by-step optical alignment (Collimator $\rightarrow$ Schuster focus $\rightarrow$ Normal incidence $\rightarrow$ Reading $V_1/V_2$).
- **11 Comprehensive Viva-Voce Questions**: Expandable questions with physical formulas and examiner notes.

---

## 📱 Mobile App Development (Android & iOS)

Diffraction Lab is engineered as a cross-platform mobile application supporting both Android and iOS:

### 🤖 Android:
1. **Direct APK Installation**:
   - Download the compiled native APK from [GitHub Releases](https://github.com/yash-prajapati2602722/Diffraction-Lab/releases).
   - Install directly on Android 7.0+ devices.
2. **PWA Standalone App**:
   - In Chrome on Android, tap the **"Android & iOS App"** button in the header and tap **"Install PWA App"**.
   - Added directly to the Android app drawer and home screen.

### 🍏 iOS (iPhone & iPad):
1. Open Diffraction Lab in **Safari**.
2. Tap the **Share** button ($\uparrow$) in Safari's bottom toolbar.
3. Tap **"Add to Home Screen"** and tap **Add**.
4. Diffraction Lab runs in standalone mode with full hardware acceleration, touch gestures, and offline support.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **PWA & Offline**: `vite-plugin-pwa` with Workbox precaching
- **Icons**: Lucide React + custom SVG graphics
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
