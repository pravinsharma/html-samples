// NEUTONE DSP-1 CORE ENGINE LOGIC

// Audio Context Setup (Lazy loaded)
let audioCtx = null;
let masterGainNode = null;
let analyserNode = null;
let delayNode = null;
let delayFeedbackGain = null;
let delayWetGain = null;
let delayDryGain = null;
let biquadFilter = null;
let waveDataArray = null;

// Audio parameters map
const synthParams = {
  attack: 0.1,      // Knob A (seconds)
  decay: 1.5,       // Knob B (seconds)
  filterCutoff: 1200, // Knob C (Hz)
  feedback: 0.4,    // Knob D (0 to 0.95)
  wet: 0.35,        // Wet Level (0 to 1)
  dry: 0.65,        // Dry Level (0 to 1)
  gain: 0.75,       // Master Gain (0 to 1)
  waveform: 'sine',
  octave: 3,
  lfoActive: true,
  overdriveActive: false,
  limiterActive: true,
  bypassActive: false,
  boostActive: true
};

// Preset Dictionary
const PRESETS = {
  'default': {
    waveform: 'sine',
    knobA: 0.1,
    knobB: 1.5,
    knobC: 1200,
    knobD: 40,
    wet: 35,
    dry: 65,
    gain: 75,
    lfo: true,
    overdrive: false,
    limiter: true,
    bypass: false,
    boost: true
  },
  'acid-bass': {
    waveform: 'sawtooth',
    knobA: 0.02,
    knobB: 0.8,
    knobC: 450,
    knobD: 15,
    wet: 15,
    dry: 85,
    gain: 80,
    lfo: false,
    overdrive: true,
    limiter: true,
    bypass: false,
    boost: true
  },
  'space-echo': {
    waveform: 'triangle',
    knobA: 0.6,
    knobB: 2.2,
    knobC: 2200,
    knobD: 75,
    wet: 65,
    dry: 35,
    gain: 70,
    lfo: true,
    overdrive: false,
    limiter: true,
    bypass: false,
    boost: false
  },
  'high-fizz': {
    waveform: 'square',
    knobA: 0.05,
    knobB: 0.6,
    knobC: 3800,
    knobD: 30,
    wet: 45,
    dry: 55,
    gain: 60,
    lfo: true,
    overdrive: true,
    limiter: true,
    bypass: false,
    boost: true
  }
};

// Note frequencies map
const NOTE_FREQS = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88,
  'C2': 523.25
};

// Track active oscillators for note triggers
const activeVoices = new Map();

// Initialize Audio Nodes
function initAudio() {
  if (audioCtx) return;
  
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();
  
  // Analyser
  analyserNode = audioCtx.createAnalyser();
  analyserNode.fftSize = 2048;
  const bufferLength = analyserNode.frequencyBinCount;
  waveDataArray = new Uint8Array(bufferLength);
  
  // Biquad Filter
  biquadFilter = audioCtx.createBiquadFilter();
  biquadFilter.type = 'lowpass';
  biquadFilter.Q.value = 1.0;
  biquadFilter.frequency.setValueAtTime(synthParams.filterCutoff, audioCtx.currentTime);
  
  // Delay & Mixer Loop
  delayNode = audioCtx.createDelay(5.0);
  delayNode.delayTime.setValueAtTime(0.35, audioCtx.currentTime); // 350ms delay
  
  delayFeedbackGain = audioCtx.createGain();
  delayFeedbackGain.gain.setValueAtTime(synthParams.feedback, audioCtx.currentTime);
  
  delayWetGain = audioCtx.createGain();
  delayWetGain.gain.setValueAtTime(synthParams.wet, audioCtx.currentTime);
  
  delayDryGain = audioCtx.createGain();
  delayDryGain.gain.setValueAtTime(synthParams.dry, audioCtx.currentTime);
  
  // Connect Delay Loop
  delayNode.connect(delayFeedbackGain);
  delayFeedbackGain.connect(delayNode); // feedback loop
  delayNode.connect(delayWetGain);
  
  // Master Gain
  masterGainNode = audioCtx.createGain();
  masterGainNode.gain.setValueAtTime(synthParams.gain, audioCtx.currentTime);
  
  // Connect primary audio routing
  // Oscillator/Source -> Filter -> (Dry Node & Delay Node)
  // Dry Node & Delay Wet Node -> Master Gain -> Analyser -> Destination
  
  biquadFilter.connect(delayDryGain);
  biquadFilter.connect(delayNode);
  
  delayDryGain.connect(masterGainNode);
  delayWetGain.connect(masterGainNode);
  
  // Add a dynamics compressor as a peak limiter if active
  const limiter = audioCtx.createDynamicsCompressor();
  limiter.threshold.setValueAtTime(-1, audioCtx.currentTime); // limit at -1dB
  limiter.knee.setValueAtTime(0, audioCtx.currentTime); // hard knee
  limiter.ratio.setValueAtTime(20, audioCtx.currentTime); // high ratio
  limiter.attack.setValueAtTime(0.003, audioCtx.currentTime);
  limiter.release.setValueAtTime(0.08, audioCtx.currentTime);
  
  masterGainNode.connect(limiter);
  limiter.connect(analyserNode);
  analyserNode.connect(audioCtx.destination);
  
  console.log("Audio Engine Initialized successfully.");
  
  // Start visualizer loops
  drawWaveform();
  updateMeter();
}

// Play a synthesised note
function playNote(noteName) {
  initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  // Calculate frequency based on note and octave multiplier
  let baseFreq = NOTE_FREQS[noteName];
  if (!baseFreq) return;
  
  // Adjust based on octave selection
  // Base freqs in NOTE_FREQS are for octave 4 (standard pitch C4=261.63)
  const octaveMultiplier = Math.pow(2, synthParams.octave - 4);
  const freq = baseFreq * octaveMultiplier;
  
  // Stop existing voice of the same note to prevent piling
  stopNote(noteName);
  
  // Create synth nodes
  const osc = audioCtx.createOscillator();
  const oscGain = audioCtx.createGain();
  
  // Setup waveform
  osc.type = synthParams.waveform;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  // Sub-harmonic boost oscillator
  let subOsc = null;
  let subGain = null;
  if (synthParams.boostActive) {
    subOsc = audioCtx.createOscillator();
    subGain = audioCtx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq / 2, audioCtx.currentTime); // One octave down
    subGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    subOsc.connect(subGain);
    subGain.connect(oscGain);
  }
  
  // LFO frequency sweep if active
  let lfo = null;
  if (synthParams.lfoActive) {
    lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 3; // 3Hz modulation
    lfoGain.gain.value = 150; // Sweeping range 150Hz
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();
  }
  
  // Setup Envelope (ADSR - we handle Attack and Decay here)
  const now = audioCtx.currentTime;
  oscGain.gain.setValueAtTime(0.0001, now);
  // Attack Phase
  oscGain.gain.linearRampToValueAtTime(synthParams.overdriveActive ? 0.9 : 0.6, now + synthParams.attack);
  // Decay / Sustain Phase
  oscGain.gain.exponentialRampToValueAtTime(0.15, now + synthParams.attack + synthParams.decay);
  
  // Routing through Overdrive distortion if active
  if (synthParams.overdriveActive) {
    const waveShaper = audioCtx.createWaveShaper();
    waveShaper.curve = makeDistortionCurve(100);
    waveShaper.oversample = '4x';
    
    osc.connect(waveShaper);
    waveShaper.connect(oscGain);
  } else {
    osc.connect(oscGain);
  }
  
  // Bypass Engine route check
  if (synthParams.bypassActive) {
    oscGain.connect(audioCtx.destination);
  } else {
    oscGain.connect(biquadFilter);
  }
  
  // Start oscillators
  osc.start(now);
  if (subOsc) subOsc.start(now);
  
  // Keep trace of running voice
  activeVoices.set(noteName, {
    osc,
    oscGain,
    subOsc,
    subGain,
    lfo,
    startTime: now
  });
  
  // Highlight UI Key
  const keyBtn = document.querySelector(`.key[data-note="${noteName}"]`);
  if (keyBtn) keyBtn.classList.add('active');
}

// Stop/Release a synthesised note
function stopNote(noteName) {
  const voice = activeVoices.get(noteName);
  if (!voice) return;
  
  const now = audioCtx.currentTime;
  const oscGain = voice.oscGain;
  
  // Release Phase (fast fade out to prevent clicks)
  try {
    oscGain.gain.cancelScheduledValues(now);
    oscGain.gain.setValueAtTime(oscGain.gain.value, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05); // 50ms release
    
    const osc = voice.osc;
    const subOsc = voice.subOsc;
    const lfo = voice.lfo;
    
    osc.stop(now + 0.06);
    if (subOsc) subOsc.stop(now + 0.06);
    if (lfo) lfo.stop(now + 0.06);
  } catch (e) {
    // Audio context might be closed or nodes already stopped
  }
  
  activeVoices.delete(noteName);
  
  // Remove Highlight UI Key
  const keyBtn = document.querySelector(`.key[data-note="${noteName}"]`);
  if (keyBtn) keyBtn.classList.remove('active');
}

// Panic: Stop all sounds immediately
function panic() {
  for (const [noteName] of activeVoices) {
    stopNote(noteName);
  }
  // Clear any remaining audio nodes/voices
  activeVoices.clear();
  document.querySelectorAll('.key').forEach(k => k.classList.remove('active'));
}

// Generate distortion curve for overdrive effect
function makeDistortionCurve(amount) {
  const k = typeof amount === 'number' ? amount : 50;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

// ------------------- ROTARY DRAG HANDLING -------------------
function initKnobs() {
  const knobs = document.querySelectorAll('.rotary-knob-wrapper');
  
  knobs.forEach(wrapper => {
    const knob = wrapper.querySelector('.rotary-knob');
    const min = parseFloat(wrapper.dataset.min);
    const max = parseFloat(wrapper.dataset.max);
    const step = parseFloat(wrapper.dataset.step) || 1;
    let val = parseFloat(wrapper.dataset.val);
    
    // Set initial rotation
    updateKnobVisuals(knob, val, min, max);
    
    let startY = 0;
    let startVal = 0;
    
    const onMouseMove = (e) => {
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaY = startY - clientY; // drag up increases
      const sensitivity = 0.005; // Drag sensitivity
      const range = max - min;
      
      let newVal = startVal + (deltaY * sensitivity * range);
      // Snap to step
      newVal = Math.round(newVal / step) * step;
      // Clamp
      newVal = Math.max(min, Math.min(max, newVal));
      
      updateKnobValue(knob.id, newVal);
      updateKnobVisuals(knob, newVal, min, max);
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);
    };
    
    wrapper.addEventListener('mousedown', (e) => {
      startY = e.clientY;
      startVal = parseFloat(knob.getAttribute('aria-valuenow'));
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault(); // Prevent text highlights during drag
    });

    wrapper.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      startVal = parseFloat(knob.getAttribute('aria-valuenow'));
      document.addEventListener('touchmove', onMouseMove, { passive: false });
      document.addEventListener('touchend', onMouseUp);
      e.preventDefault();
    });

    // Keyboard support when knob is focused
    knob.addEventListener('keydown', (e) => {
      let currentVal = parseFloat(knob.getAttribute('aria-valuenow'));
      let change = 0;
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        change = step;
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        change = -step;
      } else {
        return;
      }
      
      let newVal = Math.max(min, Math.min(max, currentVal + change));
      updateKnobValue(knob.id, newVal);
      updateKnobVisuals(knob, newVal, min, max);
      e.preventDefault();
    });
  });
}

// Update knob element visual rotation and aria parameters
function updateKnobVisuals(knob, val, min, max) {
  knob.setAttribute('aria-valuenow', val);
  
  // Map value to angle (-135deg to 135deg)
  const percent = (val - min) / (max - min);
  const angle = (percent * 270) - 135;
  knob.style.transform = `rotate(${angle}deg)`;
}

// Handle knob parameter updates to state & audio nodes
function updateKnobValue(id, val) {
  const textEl = document.getElementById(`val-${id.replace('knob-', '')}`);
  
  switch(id) {
    case 'knob-a':
      synthParams.attack = val;
      if (textEl) textEl.textContent = val.toFixed(2) + 's';
      break;
    case 'knob-b':
      synthParams.decay = val;
      if (textEl) textEl.textContent = val.toFixed(1) + 's';
      break;
    case 'knob-c':
      synthParams.filterCutoff = val;
      if (textEl) textEl.textContent = Math.round(val) + 'hz';
      if (biquadFilter && audioCtx) {
        biquadFilter.frequency.setValueAtTime(val, audioCtx.currentTime);
      }
      break;
    case 'knob-d':
      synthParams.feedback = val / 100;
      if (textEl) textEl.textContent = Math.round(val) + '%';
      if (delayFeedbackGain && audioCtx) {
        delayFeedbackGain.gain.setValueAtTime(synthParams.feedback, audioCtx.currentTime);
      }
      break;
    case 'knob-wet':
      synthParams.wet = val / 100;
      if (textEl) textEl.textContent = Math.round(val) + '%';
      if (delayWetGain && audioCtx) {
        delayWetGain.gain.setValueAtTime(synthParams.wet, audioCtx.currentTime);
      }
      break;
    case 'knob-dry':
      synthParams.dry = val / 100;
      if (textEl) textEl.textContent = Math.round(val) + '%';
      if (delayDryGain && audioCtx) {
        delayDryGain.gain.setValueAtTime(synthParams.dry, audioCtx.currentTime);
      }
      break;
    case 'knob-gain':
      synthParams.gain = val / 100;
      if (textEl) textEl.textContent = Math.round(val) + '%';
      if (masterGainNode && audioCtx) {
        masterGainNode.gain.setValueAtTime(synthParams.gain, audioCtx.currentTime);
      }
      break;
  }
}

// ------------------- DYNAMIC OSCILLOSCOPE DRAWING -------------------
function drawWaveform() {
  if (!analyserNode) return;
  
  requestAnimationFrame(drawWaveform);
  
  const canvas = document.getElementById('wave-canvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  analyserNode.getByteTimeDomainData(waveDataArray);
  
  // Dark Background with subtle green grid lines
  ctx.fillStyle = '#0b0f19';
  ctx.fillRect(0, 0, width, height);
  
  // Draw Grid Lines
  ctx.strokeStyle = '#111e36';
  ctx.lineWidth = 1;
  // Horizontal grid line
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(0, height / 4);
  ctx.lineTo(width, height / 4);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(0, (height * 3) / 4);
  ctx.lineTo(width, (height * 3) / 4);
  ctx.stroke();
  
  // Vertical grid lines
  for (let x = width / 6; x < width; x += width / 6) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // Wave line setup
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#10b981';
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#10b981';
  
  ctx.beginPath();
  const sliceWidth = width / waveDataArray.length;
  let x = 0;
  
  for (let i = 0; i < waveDataArray.length; i++) {
    const v = waveDataArray[i] / 128.0;
    const y = (v * height) / 2;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    x += sliceWidth;
  }
  
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  
  // Reset shadow for performance
  ctx.shadowBlur = 0;
}

// ------------------- LED OUTPUT LEVEL METER -------------------
function updateMeter() {
  if (!analyserNode) return;
  
  requestAnimationFrame(updateMeter);
  
  analyserNode.getByteTimeDomainData(waveDataArray);
  
  // Calculate Peak Volume amplitude (Root Mean Square)
  let sumSquares = 0.0;
  for (let i = 0; i < waveDataArray.length; i++) {
    const norm = (waveDataArray[i] / 128.0) - 1.0; // center at 0
    sumSquares += norm * norm;
  }
  const rms = Math.sqrt(sumSquares / waveDataArray.length);
  
  // Map RMS value to active LEDs (0 to 10 scale)
  const maxRMS = 0.35; // sensitivity threshold
  const activeCount = Math.min(10, Math.round((rms / maxRMS) * 10));
  
  const ledDots = document.querySelectorAll('#output-level-meter .led-dot');
  ledDots.forEach((dot, index) => {
    if (index < activeCount) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// Helper to fit Canvas to parent sizes
function resizeCanvas() {
  const canvas = document.getElementById('wave-canvas');
  if (canvas) {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth * window.devicePixelRatio;
    canvas.height = container.clientHeight * window.devicePixelRatio;
    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
}

// ------------------- FORM & INTERACTION EVENT LISTENERS -------------------
document.addEventListener('DOMContentLoaded', () => {
  // Init knobs
  initKnobs();
  
  // Keyboard triggers
  const keys = document.querySelectorAll('#synth-keyboard .key');
  keys.forEach(key => {
    const note = key.dataset.note;
    
    // Mouse Play
    key.addEventListener('mousedown', () => playNote(note));
    key.addEventListener('mouseup', () => stopNote(note));
    key.addEventListener('mouseleave', () => stopNote(note));
    
    // Touch Play
    key.addEventListener('touchstart', (e) => {
      playNote(note);
      e.preventDefault();
    });
    key.addEventListener('touchend', (e) => {
      stopNote(note);
      e.preventDefault();
    });
  });
  
  // Panic action
  document.getElementById('btn-panic').addEventListener('click', panic);
  
  // Waveform Radio select
  const oscRadios = document.querySelectorAll('input[name="osc-wave"]');
  oscRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      synthParams.waveform = e.target.value;
    });
  });
  
  // Octave select
  const octaveSelect = document.getElementById('octave-select');
  octaveSelect.addEventListener('change', (e) => {
    synthParams.octave = parseInt(e.target.value);
  });
  
  // DSP Checkboxes
  document.getElementById('mod-lfo').addEventListener('change', (e) => {
    synthParams.lfoActive = e.target.checked;
  });
  document.getElementById('mod-overdrive').addEventListener('change', (e) => {
    synthParams.overdriveActive = e.target.checked;
  });
  document.getElementById('mod-limiter').addEventListener('change', (e) => {
    synthParams.limiterActive = e.target.checked;
  });
  
  // Bypass & Boost Toggles
  document.getElementById('toggle-bypass').addEventListener('change', (e) => {
    synthParams.bypassActive = e.target.checked;
    const led = document.getElementById('engine-led');
    if (synthParams.bypassActive) {
      led.classList.remove('active');
    } else {
      led.classList.add('active');
    }
  });
  
  document.getElementById('toggle-boost').addEventListener('change', (e) => {
    synthParams.boostActive = e.target.checked;
  });
  
  // Segmented oversampling in footer
  const oversampleRadios = document.querySelectorAll('input[name="oversample"]');
  oversampleRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const sampleRateText = document.getElementById('sample-rate-txt');
      const val = e.target.value;
      if (val === 'x1') {
        sampleRateText.textContent = 'rate: 44.1khz';
      } else if (val === 'x2') {
        sampleRateText.textContent = 'rate: 88.2khz';
      } else if (val === 'x4') {
        sampleRateText.textContent = 'rate: 176.4khz';
      }
    });
  });

  // Telemetry real time clock update
  setInterval(() => {
    const clockEl = document.getElementById('telemetry-time');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = now.toTimeString().split(' ')[0];
    }
  }, 1000);

  // Resize canvas handler
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Preset Selector change handler
  const presetSelect = document.getElementById('preset-preset-select');
  presetSelect.addEventListener('change', (e) => {
    applyPreset(e.target.value);
  });
  
  // Save Preset Form Handling
  const presetForm = document.getElementById('preset-registration-form');
  presetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const presetNameInput = document.getElementById('preset-name');
    const creatorInput = document.getElementById('preset-creator');
    
    let isValid = true;
    
    // Validate Preset Title
    if (!presetNameInput.value.trim()) {
      presetNameInput.parentElement.classList.add('has-error');
      isValid = false;
    } else {
      presetNameInput.parentElement.classList.remove('has-error');
    }
    
    // Validate Creator Name
    if (!creatorInput.value.trim()) {
      creatorInput.parentElement.classList.add('has-error');
      isValid = false;
    } else {
      creatorInput.parentElement.classList.remove('has-error');
    }
    
    if (isValid) {
      // Create a slug/key for preset
      const presetName = presetNameInput.value.trim();
      const presetKey = presetName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Save preset state configuration
      PRESETS[presetKey] = {
        waveform: synthParams.waveform,
        knobA: synthParams.attack,
        knobB: synthParams.decay,
        knobC: synthParams.filterCutoff,
        knobD: synthParams.feedback * 100,
        wet: synthParams.wet * 100,
        dry: synthParams.dry * 100,
        gain: synthParams.gain * 100,
        lfo: synthParams.lfoActive,
        overdrive: synthParams.overdriveActive,
        limiter: synthParams.limiterActive,
        bypass: synthParams.bypassActive,
        boost: synthParams.boostActive
      };
      
      // Add option to the dropdown
      const select = document.getElementById('preset-preset-select');
      const newOption = document.createElement('option');
      newOption.value = presetKey;
      newOption.textContent = presetName + ' (by ' + creatorInput.value.trim() + ')';
      select.appendChild(newOption);
      select.value = presetKey;
      
      // Flash Button on Success
      const submitBtn = document.getElementById('btn-save-preset');
      const origText = submitBtn.querySelector('.btn-lbl').textContent;
      submitBtn.querySelector('.btn-lbl').textContent = 'preset registered successfully!';
      submitBtn.style.backgroundColor = '#10b981';
      submitBtn.style.color = '#fff';
      
      setTimeout(() => {
        submitBtn.querySelector('.btn-lbl').textContent = origText;
        submitBtn.style.backgroundColor = '';
        submitBtn.style.color = '';
        presetNameInput.value = '';
        creatorInput.value = '';
      }, 2000);
    }
  });
});

// Apply a preset state configuration
function applyPreset(presetKey) {
  const preset = PRESETS[presetKey];
  if (!preset) return;
  
  panic();
  
  // 1. Waveform radio select
  synthParams.waveform = preset.waveform;
  const radio = document.querySelector(`input[name="osc-wave"][value="${preset.waveform}"]`);
  if (radio) radio.checked = true;
  
  // 2. Set Knob values and visuals
  const knobA = document.getElementById('knob-a');
  updateKnobValue('knob-a', preset.knobA);
  updateKnobVisuals(knobA, preset.knobA, 0, 2);
  
  const knobB = document.getElementById('knob-b');
  updateKnobValue('knob-b', preset.knobB);
  updateKnobVisuals(knobB, preset.knobB, 0.1, 3);
  
  const knobC = document.getElementById('knob-c');
  updateKnobValue('knob-c', preset.knobC);
  updateKnobVisuals(knobC, preset.knobC, 100, 5000);
  
  const knobD = document.getElementById('knob-d');
  updateKnobValue('knob-d', preset.knobD);
  updateKnobVisuals(knobD, preset.knobD, 0, 95);
  
  const knobWet = document.getElementById('knob-wet');
  updateKnobValue('knob-wet', preset.wet);
  updateKnobVisuals(knobWet, preset.wet, 0, 100);
  
  const knobDry = document.getElementById('knob-dry');
  updateKnobValue('knob-dry', preset.dry);
  updateKnobVisuals(knobDry, preset.dry, 0, 100);
  
  const knobGain = document.getElementById('knob-gain');
  updateKnobValue('knob-gain', preset.gain);
  updateKnobVisuals(knobGain, preset.gain, 0, 100);
  
  // 3. Modulations
  synthParams.lfoActive = preset.lfo;
  document.getElementById('mod-lfo').checked = preset.lfo;
  
  synthParams.overdriveActive = preset.overdrive;
  document.getElementById('mod-overdrive').checked = preset.overdrive;
  
  synthParams.limiterActive = preset.limiter;
  document.getElementById('mod-limiter').checked = preset.limiter;
  
  // 4. Safety Toggles
  synthParams.bypassActive = preset.bypass;
  document.getElementById('toggle-bypass').checked = preset.bypass;
  const led = document.getElementById('engine-led');
  if (preset.bypass) {
    led.classList.remove('active');
  } else {
    led.classList.add('active');
  }
  
  synthParams.boostActive = preset.boost;
  document.getElementById('toggle-boost').checked = preset.boost;
  
  console.log(`Applied preset "${presetKey}".`);
}
