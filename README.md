# Cubix 3D - Interactive 3D Rubik's Cube Simulator


**Cubix 3D** is a sleek, modern, web-based 3D Rubik's Cube simulator built using HTML5, CSS3, JavaScript (ES Modules), and Three.js. It features a full speedcubing movement notation suite (N, N', N2), custom algorithm sequence playback, an automated inverse solver, WCA scramble generation, automatic solve detection with timer tracking, and Web Audio API sound effects.

Try it out <a href=https://cubix3d.vercel.app/>here</a>

## Key Features

- **3D WebGL Visualization**:
  - Built with **Three.js** using rounded bevel cubies, standard WCA color palette (White, Yellow, Green, Blue, Red, Orange), and dynamic multi-angle lighting.
  - Deep black space background (`#050508`) with ambient particle field and glassmorphism UI overlays.
  - 360° OrbitControls for smooth camera rotation, panning, and zoom.

- **Complete Notation Suite (N, N', N2)**:
  - **Outer Face Moves**: R, R', R2, L, L', L2, U, U', U2, D, D', D2, F, F', F2, B, B', B2
  - **Middle Slice Moves**: M, M', M2, E, E', E2, S, S', S2
  - **Whole Cube Rotations**: X, X', X2, Y, Y', Y2, Z, Z', Z2

- **Auto Solve Engine**:
  - Calculates the exact inverse sequence from user move history and animates the cube back to solved state step-by-step.

- **Automatic Solve Detection & Timer**:
  - 3D grid and quaternion alignment detector checks state in real time.
  - Timer automatically halts upon solve and triggers a celebratory modal banner with final solve time and total move count.

- **WCA Scramble Generator**:
  - Generates 25-move WCA-compliant random scrambles with non-cancelling face turns.

- **Custom Algorithm Sequence Player**:
  - Type any custom notation sequence (e.g., `F R U R' U' F'`) into the input bar and press **Play** with adjustable animation speed (1x to 5x).

- **Web Audio API Sound Effects**:
  - Synthesized mechanical click feedback on layer completion (toggleable in header).

- **Speedcubing Keyboard Shortcuts**:
  - Built-in Singmaster keyboard controls (`I`/`K` for R/R', `J`/`F` for U/U', `D`/`E` for L/L', etc.).

---

## Getting Started Locally

No installation or node build tools required. You can serve the static files directly with any local HTTP server:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Cubix3D.git
cd Cubix3D

# Run local HTTP server using Python
python -m http.server 3000

# Or run using Node serve / npx
npx serve -l 3000
```

Open your browser and navigate to **`http://localhost:3000`**.

---

## Project Structure

```
Cubix3D/
├── index.html       # HTML5 structure, glassmorphism overlays & modal
├── styles.css       # Design system, glassmorphism UI & responsive styles
├── app.js           # Three.js 3D scene, quaternion turn math & game logic
├── favicon.jpg      # App favicon & header brand logo
├── logo1.jpg        # Logo concept 1 (Modern Vibrant)
├── logo2.jpg        # Logo concept 2 (Isometric Glass)
├── logo3.jpg        # Logo concept 3 (Cyberpunk Neon)
└── README.md        # Project documentation
```

---

## Built With

- **HTML5 & CSS3** (Vanilla CSS with custom properties & glassmorphism)
- **JavaScript ES Modules**
- **Three.js** (WebGL 3D rendering & OrbitControls)
- **Web Audio API** (Sound synthesis)

---

## License

MIT License. Free for personal and commercial use.
