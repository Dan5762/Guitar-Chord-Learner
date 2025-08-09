let canvas;
let ctx;
let audioContext;
let tempo = 120;
let harmonicMap;
let currentFretboard;
let nextFretboard;

function initializeApp() {
    // Initialize HarmonicMap
    harmonicMap = new HarmonicMap('harmonic-map');
    harmonicMap.startAnimation();
    
    // Initialize fretboards for current/next chord display
    currentFretboard = new Fretboard('current-fretboard', { mini: true });
    nextFretboard = new Fretboard('next-fretboard', { mini: true });
    
    // Make fretboards globally available
    window.currentFretboard = currentFretboard;
    window.nextFretboard = nextFretboard;
    
    // Set up audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Audio will be triggered automatically on chord navigation
    
    // Make chord playing function globally available
    window.playChord = playChord;
}

function setupCanvas() {
    // Set canvas size based on container
    const container = canvas.parentElement;
    canvas.width = container.clientWidth - 40;
    canvas.height = 300;
    
    // Clear canvas with background
    clearCanvas();
}

function clearCanvas() {
    ctx.fillStyle = 'transparent';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle grid lines
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 1;
    
    // Vertical lines for chord positions
    for (let i = 0; i < 4; i++) {
        const x = (i + 1) * (canvas.width / 5);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
}

function drawFlowVisualization(progression) {
    if (flowVisualizer) {
        flowVisualizer.drawFlowLines(progression);
    }
}

function playCurrentChord() {
    if (!harmonicMap.currentChord) return;
    
    playChord(harmonicMap.currentChord.name);
}

function playChord(chordName) {
    const chord = CHORD_LIBRARY.find(c => c.name === chordName);
    if (!chord) return;
    
    const startTime = audioContext.currentTime;
    const duration = 2.0; // 2 second chord duration
    
    // Play each note in the chord
    chord.frequencies.forEach(freq => {
        playNote(freq, startTime, duration);
    });
}

function clearCurrentChord() {
    harmonicMap.currentChord = null;
    harmonicMap.surroundingChords = [];
    harmonicMap.render();
    
    // Clear displays
    const currentNameEl = document.getElementById('current-chord-name');
    const nextNameEl = document.getElementById('next-chord-name');
    
    if (currentNameEl) currentNameEl.textContent = 'Select a chord';
    if (nextNameEl) nextNameEl.textContent = 'Hover to preview';
    
    if (currentFretboard) currentFretboard.clear();
    if (nextFretboard) nextFretboard.clear();
}

function playNote(frequency, startTime, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    // Envelope
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.1, startTime + duration * 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

function changeTempo() {
    const tempos = [60, 80, 100, 120, 140, 160];
    const currentIndex = tempos.indexOf(tempo);
    tempo = tempos[(currentIndex + 1) % tempos.length];
    
    const tempoBtn = document.getElementById('tempo-btn');
    tempoBtn.textContent = `${tempo} BPM`;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    
    // Make functions available globally for dragDrop.js
    window.drawFlowVisualization = drawFlowVisualization;
});

// Handle window resize
window.addEventListener('resize', () => {
    if (harmonicMap) {
        harmonicMap.setupCanvas();
    }
});