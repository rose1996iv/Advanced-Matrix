<div align="center">

# 🟢 Advanced Matrix Wallpaper

### *The most feature-rich Matrix rain wallpaper for [Lively Wallpaper](https://www.rocksdanister.com/lively/)*

![preview](preview.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Platform](https://img.shields.io/badge/Platform-Windows-blue?logo=windows)
![Engine](https://img.shields.io/badge/Engine-HTML5%20Canvas%20%2B%20JS-yellow?logo=javascript)
![Lively](https://img.shields.io/badge/Lively%20Wallpaper-Compatible-brightgreen)
![Features](https://img.shields.io/badge/Features-11-blueviolet)

**[🌐 Live Demo](https://rose1996iv.github.io/Advanced-Matrix/)** &nbsp;|&nbsp; **[⬇️ Download](https://github.com/rose1996iv/Advanced-Matrix/archive/refs/heads/main.zip)** &nbsp;|&nbsp; **[⭐ Star on GitHub](https://github.com/rose1996iv/Advanced-Matrix)**

</div>

> 🟢 **A cinematic, interactive Matrix digital rain wallpaper** for Windows — powered by HTML5 Canvas. Features 11 immersive effects including **Matrix Vision™** (your image rendered through the rain), **Webcam Vision™** (live camera as Matrix code), real-time **Audio Reactivity**, **Gravity Reversal** on bass drops, **Click Ripple Explosions**, an animated **Hacker Terminal Console**, **3D Parallax** depth layers, **Mouse Interaction**, **Retro CRT Scanlines**, **Random Glitch Effects**, and a **"Wake Up" Intro Sequence** — all configurable from a single control panel inside Lively Wallpaper.

---

## ✨ Overview

**Advanced Matrix** is a fully cinematic, interactive desktop wallpaper built with vanilla HTML5 Canvas and JavaScript for [Lively Wallpaper](https://www.rocksdanister.com/lively/).

Far beyond a simple screen saver — it packs **11 advanced features** including real-time audio reactivity, live webcam vision, mouse interaction, a hacker terminal console, click ripple explosions, and extraordinary cinematic effects — all controllable from Lively's built-in customize panel, no code editing required.

> *"Wake up, Joseph... The Matrix has you..."*

---

## 🚀 Feature List (11 Total)

### 🎨 Visual

| Feature | Description |
|---|---|
| **Matrix Color** | Full color picker — any color for the rain |
| **Rainbow Mode** | Smooth chromatic color cycling with adjustable speed |
| **Background: Solid Black** | Pure black background, classic Matrix look |
| **Background: Image (Normal)** | Static image displayed behind the rain with adjustable opacity |
| **Background: Matrix Vision™** | Your image rendered *through* the rain — each character's brightness is driven by your photo's pixel luminance |
| **Background: Webcam Vision™** | **Live camera feed** processed in real-time — your face and surroundings emerge through the falling code |

### ⚙️ Content

| Feature | Description |
|---|---|
| **3 Character Sets** | Custom text, Binary (0/1), or authentic Japanese Katakana |
| **Custom Characters** | Define any text string as your character pool |
| **Cyberpunk Clock** | Large glowing digital clock centered on screen, color-synced to your theme |

### 🔬 Advanced Effects

| Feature | Description |
|---|---|
| **3D Parallax Depth** | 3 independent rain layers — close drops fall fast, far drops fall slow — true depth perception |
| **Interactive Mouse Dodge** | Characters physically dodge the cursor and glow beneath it |
| **Click Ripple Explosion** | Every mouse click spawns a circular shockwave with Matrix characters flying outward |
| **Audio Reactive** | Rain speed and brightness pulse in real-time to system audio / music |
| **Gravity Reversal Bass** | On heavy bass peaks, gravity flips — the rain shoots upward before returning |

### 🎬 Cinematic / Hacker

| Feature | Description |
|---|---|
| **"Wake Up" Intro Sequence** | Typewriter animation on launch: *"Wake up, Joseph... The Matrix has you... Follow the white rabbit."* — fades into the rain |
| **Hacker Terminal Console** | Persistent fake console in the bottom-left: `Bypassing firewall...`, `Root access granted`, `There is no spoon.` — cycling live |
| **Retro CRT Overlay** | Full-screen authentic CRT scanlines + RGB chromatic aberration fringing |
| **Random Screen Glitch** | Periodic CSS glitch animation — screen distorts like a corrupted signal |

---

## 📦 Installation

### Requirements
- **Windows 10 / 11**
- **[Lively Wallpaper](https://www.rocksdanister.com/lively/)** (free & open-source)

### Steps

1. **Clone or download** this repository:
   ```bash
   git clone https://github.com/rose1996iv/Advanced-Matrix.git
   ```

2. **Open Lively Wallpaper**

3. Click **`+` (Add Wallpaper)** → **"Open from disk"**

4. Navigate to the cloned folder and select **`index.html`**

5. Click **Set as Wallpaper** 🎉

> All settings are available in **Right-click → Customize** — no code editing needed.

---

## 🛠️ Customize Panel Reference

```
── Visual Settings ──
  Matrix Color              → Color Picker
  Rainbow Mode              → Toggle
  Background Type           → Solid Black | Image | Matrix Vision™ | Webcam Vision™
  Background / Vision Image → File selector from /images/ folder
  Image Opacity (%)         → Slider (Image mode only)

── Content Settings ──
  Character Set             → Custom | Binary | Japanese Kana
  Custom Characters         → Text Input
  Show Cyberpunk Clock      → Toggle

── Advanced Effects ──
  3D Parallax Depth Layers  → Toggle
  Interactive Mouse         → Toggle
  Click Ripple Explosion    → Toggle
  Audio Reactive            → Toggle
  Gravity Reverse (Bass)    → Toggle

── Cinematic / Hacker ──
  "Wake Up" Intro Sequence  → Toggle
  Hacker Terminal Console   → Toggle
  Retro CRT Scanlines       → Toggle
  Random Screen Glitch      → Toggle
  Rain Speed Delay (ms)     → Slider (lower = faster rain)
```

---

## 🖼️ Adding Your Own Image for Matrix Vision™

1. Place any `.png` or `.jpg` into the `/images/` folder
2. In Customize → **Background / Vision Image** → select it
3. Set **Background Type** → `"Matrix Vision™ (Image via Rain)"`
4. Watch your photo emerge from the code 🤯

---

## 📸 Enabling Webcam Vision™

1. Set **Background Type** → `"Webcam Vision™ (Live Camera via Rain)"`
2. Allow camera permission if prompted by the browser
3. Your **live webcam feed** will be sampled in real-time — you see yourself rendered entirely through the falling Matrix characters

> The webcam feed is mirrored horizontally for a natural feel. No data is stored or transmitted.

---

## 🗂️ Project Structure

```
Advanced-Matrix/
├── index.html              # Entry point — canvas, terminal, clock, overlays
├── script.js               # All effects, Lively callbacks, vision logic
├── style.css               # Layout, CRT, glitch keyframes, terminal styles
├── LivelyProperties.json   # Lively customize panel definition (11 controls)
├── README.md               # This file
├── LICENSE                 # MIT License
├── preview.png             # Preview screenshot
└── images/
    └── watermark.png       # Default background / Matrix Vision source
```

---

## 🧠 How Matrix Vision™ Works

1. The source image (or webcam frame) is drawn into a **hidden offscreen canvas**
2. Each draw frame, `getImageData()` extracts the full pixel array
3. Per each falling character, its canvas position is sampled → **luminance** computed:
   ```
   L = 0.299R + 0.587G + 0.114B
   ```
4. Luminance directly drives **character opacity** (0.12–1.0 range)
5. Bright image areas → bright vivid characters; dark areas → dim/near-invisible
6. **Result:** Your image "emerges" through the rain — exactly as Neo perceives the Matrix

For **Webcam Vision™**, the pixel array is refreshed every 3 draw frames for smooth real-time performance.

---

## 🎵 Audio Reactivity Details

Lively exposes `livelyAudioListener(audioArray)` with real-time system audio FFT data:

| Audio Level | Effect |
|---|---|
| Any audio | Brightness boost + rain speed increase proportional to volume |
| Bass peak `> 85%` | Gravity reverses — rain shoots upward |
| Audio fades `< 30%` | Gravity restores — rain falls again |

---

## 💻 Hacker Terminal Details

The terminal console cycles through **20 unique hacker messages** with randomized timing (1.8–3s per entry), categorized as:

- 🟢 `OK` — Green: successful system operations
- 🟡 `WARN` — Yellow: anomaly or threat detections
- 🔴 `ERR` — Red: errors and trace attempts

A maximum of 7 lines are displayed at once, with older lines scrolling out. The terminal only activates **after the intro sequence completes**.

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute with attribution.

---

## 🙏 Credits

- **[Lively Wallpaper](https://github.com/rocksdanister/lively)** by [@rocksdanister](https://github.com/rocksdanister) — the open-source wallpaper engine that makes this possible
- Inspired by *The Matrix* (1999) by the Wachowskis

---

<div align="center">

**Built with ❤️ and JavaScript**

*"There is no spoon."*

⭐ Star this repo if you found it cool!

</div>
