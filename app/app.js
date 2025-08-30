let canvas;
let ctx;
let audioContext;
let tempo = 120;
let harmonicMap;
let currentFretboard;
let nextFretboard;
let chordHistory = [];
let selectedHistoryChord = null;
let lastChordPlayTime = 0;

function initializeApp() {
    // Initialize HarmonicMap
    harmonicMap = new HarmonicMap('harmonic-map');
    harmonicMap.startAnimation();
    
    // Initialize fretboards for current/next chord display
    currentFretboard = new Fretboard('current-fretboard', { mini: true });
    nextFretboard = new Fretboard('next-fretboard', { mini: true });
    
    // Make fretboards and harmonicMap globally available
    window.harmonicMap = harmonicMap;
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
    
    // Prevent multiple plays of the same chord within 100ms
    const now = Date.now();
    if (now - lastChordPlayTime < 100) {
        return;
    }
    lastChordPlayTime = now;
    
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

function updateChordHistorySelection(selectedChord, clickedElement = null) {
    const container = document.getElementById('chord-history');
    if (!container) return;
    
    const items = container.querySelectorAll('.chord-history-item');
    
    // Remove selected class from all items
    items.forEach(item => {
        item.classList.remove('selected');
    });
    
    // Add selected class only to the specific clicked element
    if (clickedElement) {
        clickedElement.classList.add('selected');
    }
    
    selectedHistoryChord = selectedChord;
}

function updateChordHistory(chordName) {
    // Don't add the same chord twice in a row
    if (chordHistory.length > 0 && chordHistory[0] === chordName) {
        return;
    }
    
    // Clear any previous history selection when adding new chord
    selectedHistoryChord = null;
    
    // Add new chord to the beginning
    chordHistory.unshift(chordName);
    
    // Keep only the last 5 chords
    if (chordHistory.length > 5) {
        chordHistory = chordHistory.slice(0, 5);
    }
    
    // Update the display - right to left (newest on right)
    const container = document.getElementById('chord-history');
    if (!container) return;
    
    const items = container.querySelectorAll('.chord-history-item');
    
    // Update from right to left
    items.forEach((item) => {
        const position = parseInt(item.dataset.position);
        
        if (position < chordHistory.length) {
            // Display chords with newest (index 0) on the right (position 0)
            const chord = chordHistory[position];
            item.textContent = chord;
            item.classList.remove('empty');
            
            // Check if this is the currently displayed chord in harmonic map
            const isCurrentChord = window.harmonicMap && 
                                 window.harmonicMap.currentChord && 
                                 window.harmonicMap.currentChord.name === chord;
            
            // Add current chord styling
            if (isCurrentChord) {
                item.classList.add('current-chord');
            } else {
                item.classList.remove('current-chord');
            }
            
            // Add click handler to navigate to this chord (from history)
            item.onclick = (e) => {
                e.stopPropagation(); // Prevent event bubbling
                if (window.harmonicMap) {
                    updateChordHistorySelection(chord, item);
                    window.harmonicMap.navigateToChord(chord, true);
                }
            };
            item.style.cursor = 'pointer';
        } else {
            item.textContent = '-';
            item.classList.add('empty');
            item.classList.remove('current-chord');
            item.onclick = null;
            item.style.cursor = 'default';
        }
    });
}

function switchTab(tabName) {
    // Remove active class from all sections
    const chordLibrary = document.getElementById('chord-library');
    const chordDiagrams = document.getElementById('chord-diagrams');
    if (chordLibrary) chordLibrary.classList.remove('active');
    if (chordDiagrams) chordDiagrams.classList.remove('active');
    
    // Hide all tab panels
    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(panel => {
        panel.style.display = 'none';
        panel.classList.remove('active');
    });
    
    // Remove active state from all tab buttons
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab panel and add active class
    const targetPanel = document.getElementById(tabName);
    if (targetPanel) {
        targetPanel.style.display = 'flex';
        targetPanel.classList.add('active');
        
        // If this is the chord-diagrams tab, also show the chord displays
        if (tabName === 'chord-diagrams') {
            const currentDisplay = document.getElementById('current-chord-display');
            const nextDisplay = document.getElementById('next-chord-display');
            if (currentDisplay) currentDisplay.style.display = 'block';
            if (nextDisplay) nextDisplay.style.display = 'block';
        }
    }
    
    // Activate corresponding tab button
    const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    
    // Hide all tab panels initially
    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(panel => {
        panel.style.display = 'none';
    });
    
    // Hide chord displays that aren't in the tab system
    const orphanedDisplays = document.querySelectorAll('#current-chord-display, #next-chord-display');
    orphanedDisplays.forEach(display => {
        const parent = display.closest('.tab-panel');
        if (!parent) {
            display.style.display = 'none';
        }
    });
    
    // On mobile, hide the main sections initially to show only harmonic map
    if (window.innerWidth < 1024) {
        const chordLibrary = document.getElementById('chord-library');
        const chordDiagrams = document.getElementById('chord-diagrams');
        if (chordLibrary) chordLibrary.style.display = 'none';
        if (chordDiagrams) chordDiagrams.style.display = 'none';
    }
    
    // Set up tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const tabName = e.currentTarget.dataset.tab;
            if (tabName === 'harmonic-view') {
                // Remove active class from all sections
                const chordLibrary = document.getElementById('chord-library');
                const chordDiagrams = document.getElementById('chord-diagrams');
                if (chordLibrary) chordLibrary.classList.remove('active');
                if (chordDiagrams) chordDiagrams.classList.remove('active');
                
                // Hide all tab panels to show harmonic view
                panels.forEach(panel => {
                    panel.style.display = 'none';
                    panel.classList.remove('active');
                });
                // Hide any orphaned chord displays
                orphanedDisplays.forEach(display => {
                    display.style.display = 'none';
                });
                // Remove active from all tabs and set harmonic as active
                tabButtons.forEach(btn => btn.classList.remove('active'));
                e.currentTarget.classList.add('active');
            } else {
                switchTab(tabName);
            }
        });
    });
    
    // Set up view selector
    const viewSelect = document.getElementById('view-select');
    const contextSelect = document.getElementById('context-select');
    
    if (viewSelect) {
        // Auto-select circle of fifths on load
        viewSelect.value = 'circle-of-fifths';
        
        viewSelect.addEventListener('change', (e) => {
            const selectedView = e.target.value;
            if (selectedView === 'circle-of-fifths') {
                // Already implemented - refresh current view
                if (harmonicMap && harmonicMap.currentChord) {
                    harmonicMap.render();
                }
            } else {
                // Coming soon views - show notification
                e.target.value = 'circle-of-fifths'; // Reset to current view
            }
        });
    }
    
    // Set up context selector
    if (contextSelect) {
        contextSelect.addEventListener('change', (e) => {
            const selectedContext = e.target.value;
            if (harmonicMap) {
                harmonicMap.currentContext = selectedContext;
                harmonicMap.calculateChordPositions();
                harmonicMap.render();
            }
        });
    }
    
    // Make functions available globally for dragDrop.js
    window.drawFlowVisualization = drawFlowVisualization;
    window.updateChordHistory = updateChordHistory;
    window.updateChordHistorySelection = updateChordHistorySelection;
    window.switchTab = switchTab;
});

// Handle window resize
window.addEventListener('resize', () => {
    if (harmonicMap) {
        harmonicMap.setupCanvas();
    }
});