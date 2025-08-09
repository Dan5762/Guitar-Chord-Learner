let canvas;
let ctx;
let audioContext;
let tempo = 120;
let fretboard;

function initializeApp() {
    // Set up canvas
    canvas = document.getElementById('flow-visualization');
    ctx = canvas.getContext('2d');
    
    // Note: Main fretboard removed, using mini fretboards instead
    
    // Set up audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Set up control buttons
    document.getElementById('play-btn').addEventListener('click', playProgression);
    document.getElementById('clear-btn').addEventListener('click', () => {
        clearProgression();
        clearCanvas();
    });
    document.getElementById('tempo-btn').addEventListener('click', changeTempo);
    
    // Initial canvas setup
    setupCanvas();
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
    clearCanvas();
    
    const chordWidth = canvas.width / 5;
    const noteHeight = canvas.height / 4;
    
    // Draw each chord and connections
    progression.forEach((chordName, index) => {
        if (!chordName) return;
        
        const chord = CHORD_LIBRARY.find(c => c.name === chordName);
        const x = (index + 1) * chordWidth;
        
        // Draw chord name
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(chordName, x, 30);
        
        // Draw notes
        chord.notes.forEach((note, noteIndex) => {
            const y = 60 + noteIndex * noteHeight;
            
            // Draw note circle
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw note name
            ctx.fillStyle = '#000000';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(note, x, y);
        });
        
        // Draw connections to next chord
        if (index < progression.length - 1 && progression[index + 1]) {
            const nextChord = CHORD_LIBRARY.find(c => c.name === progression[index + 1]);
            const nextX = (index + 2) * chordWidth;
            
            chord.frequencies.forEach((freq1, i) => {
                nextChord.frequencies.forEach((freq2, j) => {
                    const ratio = calculateIntervalRatio(freq1, freq2);
                    if (ratio) {
                        const y1 = 60 + i * noteHeight;
                        const y2 = 60 + j * noteHeight;
                        
                        // Draw curved connection line
                        ctx.beginPath();
                        ctx.strokeStyle = '#000000';
                        ctx.lineWidth = 2;
                        ctx.globalAlpha = 0.5;
                        
                        const controlX = (x + nextX) / 2;
                        const controlY = (y1 + y2) / 2 - 30;
                        
                        ctx.moveTo(x + 20, y1);
                        ctx.quadraticCurveTo(controlX, controlY, nextX - 20, y2);
                        ctx.stroke();
                        
                        // Draw interval label
                        ctx.globalAlpha = 1;
                        ctx.fillStyle = '#000000';
                        ctx.font = '12px sans-serif';
                        ctx.fillText(ratio.name, controlX, controlY);
                    }
                });
            });
        }
    });
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
    setupCanvas();
    drawFlowVisualization(progression);
});