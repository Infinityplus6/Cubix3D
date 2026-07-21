import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- CONFIG & CONSTANTS ---
const CUBIE_SIZE = 0.94;
const CUBIE_GAP = 0.06;
const SPACING = CUBIE_SIZE + CUBIE_GAP; // 1.0

// WCA Color Scheme
const COLORS = {
  R: 0xd81e28, // Right (+X): Vibrant Red
  L: 0xff6b00, // Left (-X): Bright Orange
  U: 0xffffff, // Top (+Y): Crisp White
  D: 0xffe600, // Bottom (-Y): Bright Yellow
  F: 0x00b04f, // Front (+Z): Vibrant Green
  B: 0x0052cc, // Back (-Z): Royal Blue
  INNER: 0x1a1a24 // Inner faces: Dark Charcoal
};

// Inverse Move Helper Map
const INVERSE_MOVES = {
  'R': "R'", "R'": 'R', 'R2': 'R2',
  'L': "L'", "L'": 'L', 'L2': 'L2',
  'U': "U'", "U'": 'U', 'U2': 'U2',
  'D': "D'", "D'": 'D', 'D2': 'D2',
  'F': "F'", "F'": 'F', 'F2': 'F2',
  'B': "B'", "B'": 'B', 'B2': 'B2',
  'M': "M'", "M'": 'M', 'M2': 'M2',
  'E': "E'", "E'": 'E', 'E2': 'E2',
  'S': "S'", "S'": 'S', 'S2': 'S2',
  'X': "X'", "X'": 'X', 'X2': 'X2',
  'Y': "Y'", "Y'": 'Y', 'Y2': 'Y2',
  'Z': "Z'", "Z'": 'Z', 'Z2': 'Z2'
};

// Movement Definitions
const MOVES = {
  'R':  { axis: new THREE.Vector3(1, 0, 0),  filter: (p) => p.x > 0.5,  angle: -Math.PI / 2 },
  "R'": { axis: new THREE.Vector3(1, 0, 0),  filter: (p) => p.x > 0.5,  angle:  Math.PI / 2 },
  'R2': { axis: new THREE.Vector3(1, 0, 0),  filter: (p) => p.x > 0.5,  angle: -Math.PI },

  'L':  { axis: new THREE.Vector3(1, 0, 0),  filter: (p) => p.x < -0.5, angle:  Math.PI / 2 },
  "L'": { axis: new THREE.Vector3(1, 0, 0),  filter: (p) => p.x < -0.5, angle: -Math.PI / 2 },
  'L2': { axis: new THREE.Vector3(1, 0, 0),  filter: (p) => p.x < -0.5, angle:  Math.PI },

  'U':  { axis: new THREE.Vector3(0, 1, 0),  filter: (p) => p.y > 0.5,  angle: -Math.PI / 2 },
  "U'": { axis: new THREE.Vector3(0, 1, 0),  filter: (p) => p.y > 0.5,  angle:  Math.PI / 2 },
  'U2': { axis: new THREE.Vector3(0, 1, 0),  filter: (p) => p.y > 0.5,  angle: -Math.PI },

  'D':  { axis: new THREE.Vector3(0, 1, 0),  filter: (p) => p.y < -0.5, angle:  Math.PI / 2 },
  "D'": { axis: new THREE.Vector3(0, 1, 0),  filter: (p) => p.y < -0.5, angle: -Math.PI / 2 },
  'D2': { axis: new THREE.Vector3(0, 1, 0),  filter: (p) => p.y < -0.5, angle:  Math.PI },

  'F':  { axis: new THREE.Vector3(0, 0, 1),  filter: (p) => p.z > 0.5,  angle: -Math.PI / 2 },
  "F'": { axis: new THREE.Vector3(0, 0, 1),  filter: (p) => p.z > 0.5,  angle:  Math.PI / 2 },
  'F2': { axis: new THREE.Vector3(0, 0, 1),  filter: (p) => p.z > 0.5,  angle: -Math.PI },

  'B':  { axis: new THREE.Vector3(0, 0, 1),  filter: (p) => p.z < -0.5, angle:  Math.PI / 2 },
  "B'": { axis: new THREE.Vector3(0, 0, 1),  filter: (p) => p.z < -0.5, angle: -Math.PI / 2 },
  'B2': { axis: new THREE.Vector3(0, 0, 1),  filter: (p) => p.z < -0.5, angle:  Math.PI },

  // Slice Moves
  'M':  { axis: new THREE.Vector3(1, 0, 0),  filter: (p) => Math.abs(p.x) <= 0.5, angle:  Math.PI / 2 },
  "M'": { axis: new THREE.Vector3(1, 0, 0),  filter: (p) => Math.abs(p.x) <= 0.5, angle: -Math.PI / 2 },
  'M2': { axis: new THREE.Vector3(1, 0, 0),  filter: (p) => Math.abs(p.x) <= 0.5, angle:  Math.PI },

  'E':  { axis: new THREE.Vector3(0, 1, 0),  filter: (p) => Math.abs(p.y) <= 0.5, angle:  Math.PI / 2 },
  "E'": { axis: new THREE.Vector3(0, 1, 0),  filter: (p) => Math.abs(p.y) <= 0.5, angle: -Math.PI / 2 },
  'E2': { axis: new THREE.Vector3(0, 1, 0),  filter: (p) => Math.abs(p.y) <= 0.5, angle:  Math.PI },

  'S':  { axis: new THREE.Vector3(0, 0, 1),  filter: (p) => Math.abs(p.z) <= 0.5, angle: -Math.PI / 2 },
  "S'": { axis: new THREE.Vector3(0, 0, 1),  filter: (p) => Math.abs(p.z) <= 0.5, angle:  Math.PI / 2 },
  'S2': { axis: new THREE.Vector3(0, 0, 1),  filter: (p) => Math.abs(p.z) <= 0.5, angle: -Math.PI },

  // Whole Cube Rotations
  'X':  { axis: new THREE.Vector3(1, 0, 0),  filter: () => true, angle: -Math.PI / 2 },
  "X'": { axis: new THREE.Vector3(1, 0, 0),  filter: () => true, angle:  Math.PI / 2 },
  'X2': { axis: new THREE.Vector3(1, 0, 0),  filter: () => true, angle: -Math.PI },

  'Y':  { axis: new THREE.Vector3(0, 1, 0),  filter: () => true, angle: -Math.PI / 2 },
  "Y'": { axis: new THREE.Vector3(0, 1, 0),  filter: () => true, angle:  Math.PI / 2 },
  'Y2': { axis: new THREE.Vector3(0, 1, 0),  filter: () => true, angle: -Math.PI },

  'Z':  { axis: new THREE.Vector3(0, 0, 1),  filter: () => true, angle: -Math.PI / 2 },
  "Z'": { axis: new THREE.Vector3(0, 0, 1),  filter: () => true, angle:  Math.PI / 2 },
  'Z2': { axis: new THREE.Vector3(0, 0, 1),  filter: () => true, angle: -Math.PI }
};

// Categorized List for UI
const MOVE_CATEGORIES = {
  all: Object.keys(MOVES),
  normal: ['R', 'L', 'U', 'D', 'F', 'B'],
  prime: ["R'", "L'", "U'", "D'", "F'", "B'"],
  double: ['R2', 'L2', 'U2', 'D2', 'F2', 'B2'],
  slice: ['M', "M'", 'M2', 'E', "E'", 'E2', 'S', "S'", 'S2', 'X', "X'", 'X2', 'Y', "Y'", 'Y2', 'Z', "Z'", 'Z2']
};

// --- APP STATE ---
let scene, camera, renderer, controls;
let cubeGroup;
let cubies = [];
let isAnimating = false;
let moveQueue = [];
let executedHistory = []; // Tracks user moves for Auto Solve
let moveCount = 0;
let soundEnabled = true;
let animSpeedLevel = 3;
let audioCtx = null;
let isAutoSolving = false;

// Timer State
let timerInterval = null;
let timerStartTime = null;
let timerRunning = false;
let isCubeSolved = true;

// --- INITIALIZATION ---
function init() {
  const container = document.getElementById('canvas-container');

  // Scene setup
  scene = new THREE.Scene();

  // Camera setup
  camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(4.5, 3.8, 5.2);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 3.5;
  controls.maxDistance = 15;
  controls.target.set(0, 0, 0);

  // Lighting (Enhanced multi-directional lighting for vibrant colors from top, bottom, and all sides)
  setupLighting();

  // Particle Starfield Background
  setupParticles();

  // Build Rubik's Cube Mesh
  buildCube();

  // Setup UI Listeners & Move Grid
  setupUI();

  // Window Resize
  window.addEventListener('resize', onWindowResize);

  // Animation Loop
  animate();
}

function setupLighting() {
  // Ambient Light (high intensity so all faces including bottom are clearly visible)
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  // Top Light
  const topLight = new THREE.DirectionalLight(0xffffff, 1.0);
  topLight.position.set(10, 15, 10);
  scene.add(topLight);

  // Bottom Dedicated Light (Fixes yellow bottom face shadow issue!)
  const bottomLight = new THREE.DirectionalLight(0xffffff, 1.2);
  bottomLight.position.set(-5, -15, -5);
  scene.add(bottomLight);

  // Front & Side Lights
  const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
  frontLight.position.set(0, 5, 15);
  scene.add(frontLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
  backLight.position.set(0, 5, -15);
  scene.add(backLight);
}

function setupParticles() {
  const particleCount = 250;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 35;
    positions[i + 1] = (Math.random() - 0.5) * 35;
    positions[i + 2] = (Math.random() - 0.5) * 35;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0x818cf8,
    size: 0.08,
    transparent: true,
    opacity: 0.35
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

// --- CUBE GEOMETRY CREATION ---
function buildCube() {
  cubeGroup = new THREE.Group();
  scene.add(cubeGroup);
  cubies = [];

  const baseGeometry = new THREE.BoxGeometry(CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE);

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        // Create 6 materials for each face [Right, Left, Top, Bottom, Front, Back]
        const materials = [
          new THREE.MeshStandardMaterial({ color: x === 1 ? COLORS.R : COLORS.INNER, roughness: 0.15, metalness: 0.05 }),
          new THREE.MeshStandardMaterial({ color: x === -1 ? COLORS.L : COLORS.INNER, roughness: 0.15, metalness: 0.05 }),
          new THREE.MeshStandardMaterial({ color: y === 1 ? COLORS.U : COLORS.INNER, roughness: 0.15, metalness: 0.05 }),
          new THREE.MeshStandardMaterial({ color: y === -1 ? COLORS.D : COLORS.INNER, roughness: 0.15, metalness: 0.05 }),
          new THREE.MeshStandardMaterial({ color: z === 1 ? COLORS.F : COLORS.INNER, roughness: 0.15, metalness: 0.05 }),
          new THREE.MeshStandardMaterial({ color: z === -1 ? COLORS.B : COLORS.INNER, roughness: 0.15, metalness: 0.05 })
        ];

        const cubie = new THREE.Mesh(baseGeometry, materials);
        cubie.position.set(x * SPACING, y * SPACING, z * SPACING);
        
        // Initial coordinate & rotation reference
        cubie.userData = { 
          initialPos: new THREE.Vector3(x * SPACING, y * SPACING, z * SPACING),
          initialQuaternion: cubie.quaternion.clone()
        };

        cubeGroup.add(cubie);
        cubies.push(cubie);
      }
    }
  }
  isCubeSolved = true;
}

// --- MOVE EXECUTION & ROTATION ENGINE ---
function queueMove(moveKey, isScramble = false, isAutoSolve = false) {
  if (!MOVES[moveKey]) return;
  moveQueue.push({ moveKey, isScramble, isAutoSolve });
  if (!isAnimating) {
    processNextMove();
  }
}

function processNextMove() {
  if (moveQueue.length === 0) {
    isAnimating = false;
    // Check if cube is solved after queue finishes
    checkSolvedState();
    return;
  }

  isAnimating = true;
  const { moveKey, isScramble, isAutoSolve } = moveQueue.shift();
  const moveDef = MOVES[moveKey];

  // Start timer on first non-scramble move
  if (!isScramble && !timerRunning && !isAutoSolve && moveCount === 0) {
    startTimer();
  }

  // 1. Identify cubies in target layer
  const targetCubies = cubies.filter((cubie) => {
    const worldPos = new THREE.Vector3();
    cubie.getWorldPosition(worldPos);
    return moveDef.filter(worldPos);
  });

  // 2. Create temporary pivot
  const pivot = new THREE.Group();
  scene.add(pivot);

  targetCubies.forEach((cubie) => {
    pivot.attach(cubie);
  });

  // 3. Animate rotation
  const targetAngle = moveDef.angle;
  const duration = isAutoSolve ? 120 : getAnimDuration(isScramble);
  let startTime = null;

  function animateTurn(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    
    const easeProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const currentAngle = targetAngle * easeProgress;

    pivot.rotation.set(0, 0, 0);
    pivot.rotateOnAxis(moveDef.axis, currentAngle);

    if (progress < 1) {
      requestAnimationFrame(animateTurn);
    } else {
      // Finalize rotation precisely
      pivot.rotation.set(0, 0, 0);
      pivot.rotateOnAxis(moveDef.axis, targetAngle);
      pivot.updateMatrixWorld(true);

      targetCubies.forEach((cubie) => {
        cubeGroup.attach(cubie);
        roundCubieTransform(cubie);
      });

      scene.remove(pivot);

      // Play audio effect
      playClickSound();

      // Track move history & stats
      if (!isScramble) {
        if (!isAutoSolve) {
          executedHistory.push(moveKey);
        } else if (executedHistory.length > 0) {
          executedHistory.pop();
        }
        moveCount++;
        document.getElementById('move-count').textContent = moveCount;
        addHistoryTag(moveKey);
      }

      // Process next queued move
      processNextMove();
    }
  }

  requestAnimationFrame(animateTurn);
}

function getAnimDuration(isScramble) {
  if (isScramble) return 90;
  const speedMap = { 1: 500, 2: 350, 3: 220, 4: 140, 5: 80 };
  return speedMap[animSpeedLevel] || 220;
}

function roundCubieTransform(cubie) {
  cubie.position.x = Math.round(cubie.position.x / SPACING) * SPACING;
  cubie.position.y = Math.round(cubie.position.y / SPACING) * SPACING;
  cubie.position.z = Math.round(cubie.position.z / SPACING) * SPACING;

  const euler = new THREE.Euler().setFromQuaternion(cubie.quaternion, 'XYZ');
  euler.x = Math.round(euler.x / (Math.PI / 2)) * (Math.PI / 2);
  euler.y = Math.round(euler.y / (Math.PI / 2)) * (Math.PI / 2);
  euler.z = Math.round(euler.z / (Math.PI / 2)) * (Math.PI / 2);
  cubie.quaternion.setFromEuler(euler);
}

// --- SOLVE DETECTION ENGINE ---
function checkSolvedState() {
  if (cubies.length === 0) return;

  // A cube is solved if all cubies match their relative position and face orientation
  // We reference the first cubie's quaternion to account for whole-cube rotations (X, Y, Z)
  const refQuat = cubies[0].quaternion.clone().invert();
  let solved = true;

  for (let i = 0; i < cubies.length; i++) {
    const cubie = cubies[i];
    const initialPos = cubie.userData.initialPos;

    // Current position relative to whole cube orientation
    const relPos = cubie.position.clone().applyQuaternion(refQuat);
    
    const posDiff = relPos.distanceTo(initialPos);
    if (posDiff > 0.1) {
      solved = false;
      break;
    }

    // Relative quaternion alignment
    const relQuat = cubie.quaternion.clone().premultiply(refQuat);
    const angleDiff = 2 * Math.acos(Math.min(Math.abs(relQuat.w), 1));
    if (angleDiff > 0.1) {
      solved = false;
      break;
    }
  }

  isCubeSolved = solved;

  // If solved and timer was running, STOP timer and celebrate!
  if (isCubeSolved && timerRunning) {
    stopTimer();
    showSolvedBanner();
  }
}

function showSolvedBanner() {
  const timerText = document.getElementById('timer').textContent;
  const movesText = document.getElementById('move-count').textContent;

  const banner = document.createElement('div');
  banner.className = 'solved-banner';
  banner.innerHTML = `
    <div class="solved-card">
      <h2>🎉 Cube Solved!</h2>
      <p>Time: <strong>${timerText}</strong> | Moves: <strong>${movesText}</strong></p>
      <button class="btn" onclick="this.parentElement.parentElement.remove()">Awesome!</button>
    </div>
  `;
  document.body.appendChild(banner);
  setTimeout(() => {
    if (banner.parentElement) banner.remove();
  }, 5000);
}

// --- AUTO SOLVE FEATURE ---
function autoSolveCube() {
  if (moveQueue.length > 0 || executedHistory.length === 0) return;

  isAutoSolving = true;

  // Generate inverse sequence in reverse order
  const inverseSequence = executedHistory.slice().reverse().map((m) => INVERSE_MOVES[m] || m);

  // Queue moves for automatic playback
  inverseSequence.forEach((moveKey) => {
    queueMove(moveKey, false, true);
  });
}

// --- SCRAMBLE GENERATOR ---
function generateScramble() {
  const outerMoves = ['R', 'L', 'U', 'D', 'F', 'B'];
  const modifiers = ['', "'", '2'];
  const scrambleList = [];
  let lastAxis = '';

  for (let i = 0; i < 25; i++) {
    let moveFace;
    do {
      moveFace = outerMoves[Math.floor(Math.random() * outerMoves.length)];
    } while (moveFace === lastAxis);

    lastAxis = moveFace;
    const mod = modifiers[Math.floor(Math.random() * modifiers.length)];
    scrambleList.push(moveFace + mod);
  }

  const scrambleStr = scrambleList.join(' ');
  document.getElementById('scramble-display').textContent = scrambleStr;

  // Reset tracking state before scramble
  executedHistory = [];
  stopTimer();
  document.getElementById('timer').textContent = '00:00.0';
  document.getElementById('move-count').textContent = '0';
  moveCount = 0;

  // Execute scramble sequence
  scrambleList.forEach((m) => queueMove(m, true));
}

// --- RESET CUBE ---
function resetCube() {
  moveQueue = [];
  executedHistory = [];
  isAnimating = false;

  scene.remove(cubeGroup);
  buildCube();

  moveCount = 0;
  document.getElementById('move-count').textContent = '0';
  document.getElementById('history-log').innerHTML = '';
  stopTimer();
  document.getElementById('timer').textContent = '00:00.0';
}

// --- AUDIO SYNTHESIS ---
function playClickSound() {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, audioCtx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (e) {
    // Fallback
  }
}

// --- TIMER ENGINE ---
function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timerStartTime = performance.now();
  timerInterval = setInterval(updateTimerDisplay, 100);
}

function stopTimer() {
  timerRunning = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerDisplay() {
  if (!timerRunning) return;
  const elapsed = performance.now() - timerStartTime;
  const totalSecs = Math.floor(elapsed / 1000);
  const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0');
  const secs = (totalSecs % 60).toString().padStart(2, '0');
  const ms = Math.floor((elapsed % 1000) / 100);
  document.getElementById('timer').textContent = `${mins}:${secs}.${ms}`;
}

// --- UI SETUP & EVENT HANDLERS ---
function setupUI() {
  renderMoveGrid('all');

  // Category Filter Tabs
  const tabs = document.querySelectorAll('#move-type-tabs .tab-btn');
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      tabs.forEach((t) => t.classList.remove('active'));
      e.target.classList.add('active');
      renderMoveGrid(e.target.dataset.filter);
    });
  });

  // Action Buttons
  document.getElementById('scramble-btn').addEventListener('click', generateScramble);
  document.getElementById('auto-solve-btn').addEventListener('click', autoSolveCube);
  document.getElementById('reset-cube-btn').addEventListener('click', resetCube);
  document.getElementById('clear-history-btn').addEventListener('click', () => {
    document.getElementById('history-log').innerHTML = '';
  });

  // Reset Camera View
  document.getElementById('reset-cam-btn').addEventListener('click', () => {
    camera.position.set(4.5, 3.8, 5.2);
    controls.target.set(0, 0, 0);
    controls.update();
  });

  // Sound Toggle
  const soundBtn = document.getElementById('sound-btn');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.classList.toggle('active', soundEnabled);
  });

  // Help Modal
  const helpModal = document.getElementById('help-modal');
  document.getElementById('help-btn').addEventListener('click', () => helpModal.classList.add('open'));
  document.getElementById('close-modal-btn').addEventListener('click', () => helpModal.classList.remove('open'));
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) helpModal.classList.remove('open');
  });

  // Speed Slider
  const speedSlider = document.getElementById('speed-slider');
  speedSlider.addEventListener('input', (e) => {
    animSpeedLevel = parseInt(e.target.value, 10);
  });

  // Sequence Player
  document.getElementById('play-sequence-btn').addEventListener('click', playCustomSequence);
  document.getElementById('notation-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') playCustomSequence();
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', handleKeyboardShortcuts);
}

function renderMoveGrid(filter) {
  const grid = document.getElementById('moves-grid');
  grid.innerHTML = '';

  const moveKeys = MOVE_CATEGORIES[filter] || MOVE_CATEGORIES.all;

  moveKeys.forEach((key) => {
    const btn = document.createElement('button');
    let btnClass = 'move-btn';
    let label = 'Normal';

    if (key.includes("'")) {
      btnClass += ' prime';
      label = "Inverse (')";
    } else if (key.includes('2')) {
      btnClass += ' double';
      label = 'Double (2)';
    }

    btn.className = btnClass;
    btn.innerHTML = `<span>${key}</span><span class="sub-label">${label}</span>`;
    btn.addEventListener('click', () => queueMove(key));
    grid.appendChild(btn);
  });
}

function addHistoryTag(moveKey) {
  const log = document.getElementById('history-log');
  const tag = document.createElement('span');
  let tagClass = 'move-tag';

  if (moveKey.includes("'")) tagClass += ' prime';
  else if (moveKey.includes('2')) tagClass += ' double';

  tag.className = tagClass;
  tag.textContent = moveKey;
  log.appendChild(tag);
  log.scrollTop = log.scrollHeight;
}

function playCustomSequence() {
  const input = document.getElementById('notation-input');
  const rawText = input.value.trim();
  if (!rawText) return;

  const tokens = rawText.split(/\s+/);
  tokens.forEach((token) => {
    if (MOVES[token]) {
      queueMove(token);
    }
  });
}

function handleKeyboardShortcuts(e) {
  if (document.activeElement.tagName === 'INPUT') return;

  const keyMap = {
    'i': 'R', 'k': "R'",
    'd': 'L', 'e': "L'",
    'j': 'U', 'f': "U'",
    's': 'D', 'l': "D'",
    'h': 'F', 'g': "F'",
    'w': 'B', 'o': "B'",
    'm': 'M', 'n': "M'",
    'x': 'X', 'X': "X'",
    'y': 'Y', 'Y': "Y'",
    'z': 'Z', 'Z': "Z'"
  };

  const move = keyMap[e.key];
  if (move) {
    queueMove(move);
  }
}

// --- RENDER LOOP & RESIZE ---
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start application
window.addEventListener('DOMContentLoaded', init);
