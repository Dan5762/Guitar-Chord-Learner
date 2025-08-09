class HarmonicMap {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.radius = 200; // Distance from center to chord positions
    this.currentChord = null;
    this.hoveredChord = null;
    this.surroundingChords = [];
    this.chordPositions = new Map();
    
    // Bind event handlers
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('click', this.handleClick.bind(this));
    this.canvas.addEventListener('dragover', this.handleDragOver.bind(this));
    this.canvas.addEventListener('drop', this.handleDrop.bind(this));
    
    this.setupCanvas();
  }

  setupCanvas() {
    // Set canvas size based on container
    const container = this.canvas.parentElement;
    const containerRect = container.getBoundingClientRect();
    
    // Calculate canvas size to fit container with some padding
    const availableWidth = containerRect.width - 80; // Account for container padding
    const availableHeight = containerRect.height - 80;
    
    // Make canvas square using the smaller dimension
    const canvasSize = Math.min(availableWidth, availableHeight, 600);
    
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.canvasWidth = canvasSize;
    this.canvasHeight = canvasSize;
    
    // Update center points
    this.centerX = canvasSize / 2;
    this.centerY = canvasSize / 2;
    
    // Initial render
    this.render();
  }

  // Calculate harmonically related chords for a given center chord
  calculateSurroundingChords(centerChord) {
    if (!centerChord) return [];
    
    const related = [];
    const centerRoot = centerChord.notes[0];
    const centerType = centerChord.type;
    
    // Circle of Fifths relationships
    const fifthsUp = this.getChordByInterval(centerRoot, 7, centerType); // Perfect 5th up
    const fifthsDown = this.getChordByInterval(centerRoot, 5, centerType); // Perfect 4th up (5th down)
    
    // Relative major/minor
    const relative = this.getRelativeChord(centerChord);
    
    // Parallel major/minor
    const parallel = this.getParallelChord(centerChord);
    
    // Mediant relationships (3rd up/down)
    const mediantUp = this.getChordByInterval(centerRoot, 4, centerType); // Major 3rd up
    const mediantDown = this.getChordByInterval(centerRoot, 9, centerType); // Minor 3rd down (major 6th up)
    
    // Secondary dominants (for more advanced harmony)
    const dominant = this.getChordByInterval(centerRoot, 7, 'major7'); // V7 of center
    const subdominant = this.getChordByInterval(centerRoot, 5, 'major7'); // IV7 of center
    
    // Add chords in order of harmonic strength
    if (fifthsUp) related.push({ chord: fifthsUp, relationship: 'dominant', strength: 10 });
    if (fifthsDown) related.push({ chord: fifthsDown, relationship: 'subdominant', strength: 9 });
    if (relative) related.push({ chord: relative, relationship: 'relative', strength: 8 });
    if (parallel) related.push({ chord: parallel, relationship: 'parallel', strength: 7 });
    if (mediantUp) related.push({ chord: mediantUp, relationship: 'mediant', strength: 6 });
    if (mediantDown) related.push({ chord: mediantDown, relationship: 'submediant', strength: 6 });
    if (dominant) related.push({ chord: dominant, relationship: 'secondary_dominant', strength: 5 });
    if (subdominant) related.push({ chord: subdominant, relationship: 'secondary_subdominant', strength: 4 });
    
    // Return top 6 most harmonically related chords
    return related
      .filter(item => item.chord && item.chord !== centerChord)
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 6);
  }

  // Helper methods for chord relationships
  getChordByInterval(rootNote, semitones, preferredType = 'major') {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = noteNames.indexOf(rootNote);
    if (rootIndex === -1) return null;
    
    const newRootIndex = (rootIndex + semitones) % 12;
    const newRoot = noteNames[newRootIndex];
    
    // Try to find chord with preferred type first
    const preferredChord = CHORD_LIBRARY.find(c => 
      c.notes[0] === newRoot && c.type === preferredType
    );
    
    if (preferredChord) return preferredChord;
    
    // Fallback to any chord with that root
    return CHORD_LIBRARY.find(c => c.notes[0] === newRoot);
  }

  getRelativeChord(chord) {
    const root = chord.notes[0];
    
    if (chord.type === 'major') {
      // Relative minor is 3 semitones down
      return this.getChordByInterval(root, 9, 'minor'); // 9 semitones up = 3 down
    } else if (chord.type === 'minor') {
      // Relative major is 3 semitones up
      return this.getChordByInterval(root, 3, 'major');
    }
    
    return null;
  }

  getParallelChord(chord) {
    const root = chord.notes[0];
    
    if (chord.type === 'major') {
      return this.getChordByInterval(root, 0, 'minor');
    } else if (chord.type === 'minor') {
      return this.getChordByInterval(root, 0, 'major');
    }
    
    return null;
  }

  // Set the center chord and calculate surrounding chords
  setCurrentChord(chordName) {
    const chord = CHORD_LIBRARY.find(c => c.name === chordName);
    if (!chord) return;
    
    this.currentChord = chord;
    this.surroundingChords = this.calculateSurroundingChords(chord);
    this.calculateChordPositions();
    this.render();
    
    // Update the current chord display
    this.updateCurrentChordDisplay(chord);
  }

  // Calculate positions for surrounding chords in a circle
  calculateChordPositions() {
    this.chordPositions.clear();
    
    // Center chord position
    if (this.currentChord) {
      this.chordPositions.set(this.currentChord.name, {
        x: this.centerX,
        y: this.centerY,
        chord: this.currentChord,
        isCenter: true
      });
    }
    
    // Surrounding chord positions
    this.surroundingChords.forEach((item, index) => {
      const angle = (index * 2 * Math.PI) / this.surroundingChords.length - Math.PI / 2; // Start at top
      const x = this.centerX + Math.cos(angle) * this.radius;
      const y = this.centerY + Math.sin(angle) * this.radius;
      
      this.chordPositions.set(item.chord.name, {
        x: x,
        y: y,
        chord: item.chord,
        relationship: item.relationship,
        strength: item.strength,
        isCenter: false
      });
    });
  }

  // Render the harmonic map
  render() {
    // Clear canvas
    this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw instruction text if no chord is selected
    if (!this.currentChord) {
      this.drawInstructions();
    }
    
    // Draw connection lines first (background)
    this.drawConnections();
    
    // Draw chord circles
    this.drawChords();
    
    // Draw center highlight - removed pulsing animation
    // if (this.currentChord) {
    //   this.drawCenterHighlight();
    // }
  }

  drawConnections() {
    if (!this.currentChord) return;
    
    const centerPos = this.chordPositions.get(this.currentChord.name);
    
    this.surroundingChords.forEach(item => {
      const pos = this.chordPositions.get(item.chord.name);
      if (!pos) return;
      
      // Line style based on relationship strength
      this.ctx.strokeStyle = this.getRelationshipColor(item.relationship);
      this.ctx.lineWidth = Math.max(1, item.strength / 2);
      this.ctx.globalAlpha = 0.6;
      
      this.ctx.beginPath();
      this.ctx.moveTo(centerPos.x, centerPos.y);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    });
    
    this.ctx.globalAlpha = 1;
  }

  drawChords() {
    this.chordPositions.forEach((pos, chordName) => {
      const isHovered = this.hoveredChord === chordName;
      const isCenter = pos.isCenter;
      
      // Chord circle
      this.ctx.beginPath();
      const radius = isCenter ? 50 : (isHovered ? 35 : 30);
      this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      
      // Fill based on chord type and state
      if (isCenter) {
        this.ctx.fillStyle = '#2c3e50';
      } else if (isHovered) {
        this.ctx.fillStyle = '#3498db';
      } else {
        this.ctx.fillStyle = this.getChordTypeColor(pos.chord.type);
      }
      this.ctx.fill();
      
      // Border
      this.ctx.strokeStyle = isCenter ? '#ffffff' : '#34495e';
      this.ctx.lineWidth = isCenter ? 4 : 2;
      this.ctx.stroke();
      
      // Chord name
      this.ctx.fillStyle = isCenter || isHovered ? '#ffffff' : '#2c3e50';
      this.ctx.font = `bold ${isCenter ? '18px' : '14px'} sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(chordName, pos.x, pos.y);
      
      // Relationship label for surrounding chords
      if (!isCenter && pos.relationship) {
        this.ctx.fillStyle = 'rgba(44, 62, 80, 0.7)';
        this.ctx.font = '10px sans-serif';
        this.ctx.fillText(pos.relationship.replace('_', ' '), pos.x, pos.y + radius + 15);
      }
    });
  }

  drawCenterHighlight() {
    const centerPos = this.chordPositions.get(this.currentChord.name);
    if (!centerPos) return;
    
    // Animated ring around center chord
    const time = Date.now() * 0.002;
    const ringRadius = 60 + Math.sin(time) * 5;
    
    this.ctx.beginPath();
    this.ctx.arc(centerPos.x, centerPos.y, ringRadius, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  }

  drawInstructions() {
    // Draw main title
    this.ctx.fillStyle = 'rgba(52, 73, 94, 0.9)';
    this.ctx.font = 'bold 28px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Harmonic Map', this.centerX, this.centerY - 60);
    
    // Draw main instruction text
    this.ctx.fillStyle = 'rgba(52, 73, 94, 0.8)';
    this.ctx.font = 'bold 20px sans-serif';
    this.ctx.fillText('Drop chords here to build progression', this.centerX, this.centerY - 20);
    
    // Draw secondary instruction
    this.ctx.fillStyle = 'rgba(127, 140, 141, 0.7)';
    this.ctx.font = '16px sans-serif';
    this.ctx.fillText('and explore harmonic relationships', this.centerX, this.centerY + 10);
  }

  drawDragArrow() {
    const arrowX = this.centerX - 120;
    const arrowY = this.centerY + 20;
    const arrowLength = 80;
    const arrowHeadSize = 15;
    
    // Arrow line
    this.ctx.strokeStyle = 'rgba(52, 152, 219, 0.6)';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(arrowX, arrowY);
    this.ctx.lineTo(arrowX + arrowLength, arrowY);
    this.ctx.stroke();
    
    // Arrow head
    this.ctx.fillStyle = 'rgba(52, 152, 219, 0.6)';
    this.ctx.beginPath();
    this.ctx.moveTo(arrowX + arrowLength, arrowY);
    this.ctx.lineTo(arrowX + arrowLength - arrowHeadSize, arrowY - arrowHeadSize/2);
    this.ctx.lineTo(arrowX + arrowLength - arrowHeadSize, arrowY + arrowHeadSize/2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // Color helpers
  getRelationshipColor(relationship) {
    const colors = {
      'dominant': '#27ae60',        // Green - strong resolution
      'subdominant': '#16a085',     // Teal - gentle resolution  
      'relative': '#9b59b6',        // Purple - modal relationship
      'parallel': '#e67e22',        // Orange - major/minor shift
      'mediant': '#f39c12',         // Yellow - colorful harmony
      'submediant': '#f39c12',      // Yellow - colorful harmony
      'secondary_dominant': '#e74c3c', // Red - tension
      'secondary_subdominant': '#95a5a6' // Gray - mild relationship
    };
    
    return colors[relationship] || '#95a5a6';
  }

  getChordTypeColor(type) {
    const colors = {
      'major': 'rgba(52, 152, 219, 0.8)',     // Blue
      'minor': 'rgba(155, 89, 182, 0.8)',     // Purple  
      'major7': 'rgba(46, 204, 113, 0.8)',    // Green
      'minor7': 'rgba(241, 196, 15, 0.8)',    // Yellow
      'diminished7': 'rgba(231, 76, 60, 0.8)' // Red
    };
    
    return colors[type] || 'rgba(149, 165, 166, 0.8)';
  }

  // Event handlers
  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    let newHoveredChord = null;
    
    this.chordPositions.forEach((pos, chordName) => {
      const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      const radius = pos.isCenter ? 50 : 30;
      
      if (distance <= radius) {
        newHoveredChord = chordName;
      }
    });
    
    if (newHoveredChord !== this.hoveredChord) {
      this.hoveredChord = newHoveredChord;
      this.render();
      
      // Update next chord display
      if (newHoveredChord && newHoveredChord !== this.currentChord?.name) {
        this.updateNextChordDisplay(newHoveredChord);
      } else {
        this.clearNextChordDisplay();
      }
    }
    
    // Change cursor
    this.canvas.style.cursor = newHoveredChord ? 'pointer' : 'default';
  }

  handleClick(event) {
    if (this.hoveredChord && this.hoveredChord !== this.currentChord?.name) {
      this.navigateToChord(this.hoveredChord);
    }
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    const chordName = event.dataTransfer.getData('text/plain');
    if (chordName) {
      this.navigateToChord(chordName);
    }
  }

  // Navigation
  navigateToChord(chordName) {
    this.setCurrentChord(chordName);
    
    // Trigger audio feedback
    if (window.playChord) {
      window.playChord(chordName);
    }
  }

  // UI Updates
  updateCurrentChordDisplay(chord) {
    const nameEl = document.getElementById('current-chord-name');
    const fretboardEl = document.getElementById('current-fretboard');
    
    if (nameEl) nameEl.textContent = chord.name;
    
    if (fretboardEl && window.currentFretboard) {
      window.currentFretboard.render(chord);
    }
  }

  updateNextChordDisplay(chordName) {
    const chord = CHORD_LIBRARY.find(c => c.name === chordName);
    if (!chord) return;
    
    const nameEl = document.getElementById('next-chord-name');
    const fretboardEl = document.getElementById('next-fretboard');
    
    if (nameEl) nameEl.textContent = chord.name;
    
    if (fretboardEl && window.nextFretboard) {
      window.nextFretboard.render(chord);
    }
  }

  clearNextChordDisplay() {
    const nameEl = document.getElementById('next-chord-name');
    if (nameEl) nameEl.textContent = 'Hover to preview';
    
    if (window.nextFretboard) {
      window.nextFretboard.clear();
    }
  }

  // Animation loop for the center highlight
  startAnimation() {
    const animate = () => {
      this.render();
      requestAnimationFrame(animate);
    };
    animate();
  }
}

// Make HarmonicMap available globally
window.HarmonicMap = HarmonicMap;