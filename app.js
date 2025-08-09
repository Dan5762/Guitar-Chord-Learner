let canvas;
let ctx;
let audioContext;
let tempo = 120;
let fretboard;
let flowVisualizer;

function initializeApp() {
    // Set up canvas
    canvas = document.getElementById('flow-visualization');
    ctx = canvas.getContext('2d');
    
    // Initialize FlowVisualizer
    flowVisualizer = new FlowVisualizer('flow-visualization');
    flowVisualizer.setupCanvas();
    
    // Set up audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Set up control buttons
    document.getElementById('play-btn').addEventListener('click', playProgression);
    document.getElementById('clear-btn').addEventListener('click', () => {
        clearProgression();
        flowVisualizer.clearCanvas();
    });
    document.getElementById('tempo-btn').addEventListener('click', changeTempo);
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

function playProgression() {
    const filledChords = progression.filter(chord => chord !== null);
    if (filledChords.length === 0) return;
    
    const beatDuration = 60 / tempo; // Duration of one beat in seconds
    
    filledChords.forEach((chordName, index) => {
        const chord = CHORD_LIBRARY.find(c => c.name === chordName);
        const startTime = audioContext.currentTime + (index * beatDuration);
        
        // Play each note in the chord
        chord.frequencies.forEach(freq => {
            playNote(freq, startTime, beatDuration * 0.9);
        });
        
        // Animate the chord slot
        setTimeout(() => {
            const slot = document.querySelector(`[data-slot="${progression.indexOf(chordName)}"]`);
            if (slot) {
                slot.classList.add('playing');
                setTimeout(() => slot.classList.remove('playing'), 500);
            }
        }, index * beatDuration * 1000);
    });
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
    if (flowVisualizer) {
        flowVisualizer.setupCanvas();
        flowVisualizer.drawFlowLines(progression);
    }
});