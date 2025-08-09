let draggedElement = null;
let progression = [null, null, null, null];
let currentFilter = 'major';
let miniFretboards = [];

function initializeDragDrop() {
    const chordContainer = document.getElementById('chord-cards-container');
    const typeButtons = document.querySelectorAll('.type-btn');
    
    // Create chord cards
    CHORD_LIBRARY.forEach(chord => {
        const card = createChordCard(chord.name, chord);
        chordContainer.appendChild(card);
    });
    
    // Apply initial filter
    filterChords(currentFilter);
    
    // Set up type selector buttons
    typeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active button
            typeButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Filter chords
            currentFilter = e.target.dataset.type;
            filterChords(currentFilter);
        });
    });
    
    // Set up chord card click handlers for navigation
    setupChordNavigation();
}

function setupChordNavigation() {
    const chordCards = document.querySelectorAll('.chord-card');
    chordCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const chordName = card.dataset.chord;
            handleChordNavigation(chordName);
        });
    });
}

function filterChords(type) {
    const chordCards = document.querySelectorAll('.chord-card');
    
    chordCards.forEach(card => {
        const chordName = card.dataset.chord;
        const chord = CHORD_LIBRARY.find(c => c.name === chordName);
        
        if (chord.type === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Re-setup click handlers after filtering
    setupChordNavigation();
}

function createChordCard(chordName, chordData) {
    const card = document.createElement('div');
    card.className = `chord-card ${chordData.type}`;
    card.draggable = true;
    card.dataset.chord = chordName;
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'chord-name';
    nameDiv.textContent = chordName;
    
    const notesDiv = document.createElement('div');
    notesDiv.className = 'chord-notes';
    notesDiv.textContent = chordData.notes.join(' - ');
    
    card.appendChild(nameDiv);
    card.appendChild(notesDiv);
    
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    
    return card;
}

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', e.target.dataset.chord);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedElement = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

// Navigation-based drop handler (no longer using slots)
function handleChordNavigation(chordName) {
    if (window.harmonicMap) {
        window.harmonicMap.navigateToChord(chordName);
    }
}

// createSlotChord function no longer needed - using integrated chord-slot design

function updateVisualization() {
    // This will be called to update the canvas visualization
    if (window.drawFlowVisualization) {
        window.drawFlowVisualization(progression);
    }
}

function clearProgression() {
    progression = [null, null, null, null];
    const chordSlots = document.querySelectorAll('.chord-slot');
    
    chordSlots.forEach((slot, index) => {
        slot.classList.remove('has-chord');
        
        // Reset chord title
        const chordTitle = slot.querySelector('.chord-title');
        chordTitle.textContent = 'Drop chord here';
        
        // Clear mini fretboard
        if (miniFretboards[index]) {
            miniFretboards[index].clear();
        }
    });
    
    updateVisualization();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeDragDrop);