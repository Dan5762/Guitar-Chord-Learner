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
    
    // Initialize mini fretboards
    for (let i = 0; i < 4; i++) {
        const miniFretboard = new Fretboard(`mini-fretboard-${i}`, { mini: true });
        miniFretboards[i] = miniFretboard;
    }
    
    // Set up drop zones - now using chord-slots instead of drop-slots
    const chordSlots = document.querySelectorAll('.chord-slot');
    chordSlots.forEach((slot, index) => {
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('drop', (e) => handleDrop(e, index));
        slot.addEventListener('dragleave', handleDragLeave);
        
        // Add click handler (no longer needed for main fretboard)
        slot.addEventListener('click', (e) => {
            // Click handling can be added here if needed
        });
    });
    
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
    
    // Set up chord card click handlers for fretboard preview
    setupChordPreview();
}

function setupChordPreview() {
    const chordCards = document.querySelectorAll('.chord-card');
    chordCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Chord preview functionality can be added here if needed
            // Currently using mini fretboards in progression slots
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
    setupChordPreview();
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

function handleDrop(e, slotIndex) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const chordName = e.dataTransfer.getData('text/plain');
    const slot = e.currentTarget;
    
    // Update progression array
    progression[slotIndex] = chordName;
    
    // Update slot visual
    slot.classList.add('has-chord');
    
    // Update chord title
    const chordTitle = slot.querySelector('.chord-title');
    chordTitle.textContent = chordName;
    
    // Show mini fretboard for the dropped chord
    const chordData = CHORD_LIBRARY.find(chord => chord.name === chordName);
    if (chordData && miniFretboards[slotIndex]) {
        miniFretboards[slotIndex].render(chordData);
    }
    
    // Trigger visualization update
    updateVisualization();
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