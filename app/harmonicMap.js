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
    
    // Touch event handlers for mobile
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    this.setupCanvas();
  }

  setupCanvas() {
    // Set canvas size based on container
    const container = this.canvas.parentElement;
    const containerRect = container.getBoundingClientRect();
    
    // Calculate canvas size to fit container with some padding
    const availableWidth = containerRect.width - 40; // Account for container padding
    const availableHeight = containerRect.height - 40;
    
    // Make canvas square using the smaller dimension
    const canvasSize = Math.min(availableWidth, availableHeight, 600);
    
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.canvasWidth = canvasSize;
    this.canvasHeight = canvasSize;
    
    // Update center points
    this.centerX = canvasSize / 2;
    this.centerY = canvasSize / 2;
    
    // Adjust radius for mobile screens to ensure chords fit
    const isMobile = canvasSize < 400;
    this.radius = isMobile ? Math.min(canvasSize * 0.42, 160) : 200;
    
    // Initial render
    this.render();
  }

  // Generate context-aware chord layout based on chord type
  generateCircleOfFifths(centerChord) {
    if (!centerChord) return [];
    
    const chordType = centerChord.type;
    
    if (chordType === 'major7') {
      return this.generateMajorKeyContext(centerChord);
    } else if (chordType === 'minor7') {
      return this.generateMinorKeyContext(centerChord);
    } else if (chordType === 'diminished7') {
      return this.generateDiminishedContext(centerChord);
    } else {
      // For basic major/minor chords, use simple circle of fifths
      return this.generateSimpleCircleOfFifths(centerChord);
    }
  }
  
  // Single context for Major/Maj7 chords - stable tonic center
  generateMajorKeyContext(centerChord) {
    const circleChords = [];
    const centerRoot = centerChord.notes[0];
    const centerType = centerChord.type;
    
    // Build diatonic chords in the major key
    const scalePattern = [
      { interval: 0, type: centerType, numeral: 'I' },    // Use original chord type for tonic
      { interval: 2, type: 'minor7', numeral: 'ii' },     // Supertonic
      { interval: 4, type: 'minor7', numeral: 'iii' },    // Mediant
      { interval: 5, type: centerType === 'major' ? 'major' : 'major7', numeral: 'IV' }, // Match tonic type
      { interval: 7, type: 'major', numeral: 'V' },       // Dominant
      { interval: 9, type: 'minor7', numeral: 'vi' },     // Submediant
      { interval: 11, type: 'minor7', numeral: 'vii°' }   // Leading tone
    ];
    
    scalePattern.forEach((item, index) => {
      let chordRoot;
      if (index === 0) {
        // For tonic, use the exact center chord
        chordRoot = centerChord;
      } else {
        // For other chords, find by interval and type
        chordRoot = this.getChordByInterval(centerRoot, item.interval, item.type);
      }
      
      if (chordRoot) {
        circleChords.push({
          chord: chordRoot,
          relationship: item.numeral,
          strength: index === 0 ? 12 : 10 - Math.abs(index - 3), // Strongest around IV-I-V
          position: index,
          context: 'major-key'
        });
      }
    });
    
    return circleChords;
  }
  
  // Dual context for Minor/Min7 chords
  generateMinorKeyContext(centerChord) {
    if (this.currentContext === 'relative') {
      return this.generateMinorAsRelative(centerChord);
    } else {
      return this.generateMinorAsTonic(centerChord);
    }
  }
  
  // Minor chord as relative minor (vi of major key)
  generateMinorAsRelative(centerChord) {
    const circleChords = [];
    const centerRoot = centerChord.notes[0];
    
    // Find the relative major (3 semitones up)
    const relativeMajorRoot = this.getChordByInterval(centerRoot, 3, 'major');
    if (!relativeMajorRoot) return this.generateMinorAsTonic(centerChord);
    
    const relativeMajorRootNote = relativeMajorRoot.notes[0];
    
    // Build diatonic chords in the relative major key
    const scalePattern = [
      { interval: 0, type: 'major7', numeral: 'I' },      // Relative major
      { interval: 2, type: 'minor7', numeral: 'ii' },     
      { interval: 4, type: 'minor7', numeral: 'iii' },    
      { interval: 5, type: 'major7', numeral: 'IV' },     
      { interval: 7, type: 'major', numeral: 'V' },       
      { interval: 9, type: 'minor7', numeral: 'vi' },     // Our center chord
      { interval: 11, type: 'minor7', numeral: 'vii°' }   
    ];
    
    scalePattern.forEach((item, index) => {
      const chordRoot = this.getChordByInterval(relativeMajorRootNote, item.interval, item.type);
      if (chordRoot) {
        const isCenter = chordRoot.name === centerChord.name;
        circleChords.push({
          chord: chordRoot,
          relationship: item.numeral,
          strength: isCenter ? 12 : 10 - Math.abs(index - 5), // Center around vi
          position: index,
          context: 'relative-major'
        });
      }
    });
    
    return circleChords;
  }
  
  generateMinorAsTonic(centerChord) {
    const circleChords = [];
    const centerRoot = centerChord.notes[0];
    const centerType = centerChord.type;
    
    // Natural minor scale harmony
    const scalePattern = [
      { interval: 0, type: centerType, numeral: 'i' },    // Use original chord type for tonic
      { interval: 2, type: 'minor7', numeral: 'ii°' },    // Supertonic
      { interval: 3, type: 'major7', numeral: '♭III' },   // Mediant
      { interval: 5, type: centerType === 'minor' ? 'minor' : 'minor7', numeral: 'iv' }, // Match tonic type
      { interval: 7, type: 'minor', numeral: 'v' },       // Dominant
      { interval: 8, type: 'major7', numeral: '♭VI' },    // Submediant
      { interval: 10, type: 'major', numeral: '♭VII' }    // Subtonic
    ];
    
    scalePattern.forEach((item, index) => {
      let chordRoot;
      if (index === 0) {
        // For tonic, use the exact center chord
        chordRoot = centerChord;
      } else {
        // For other chords, find by interval and type
        chordRoot = this.getChordByInterval(centerRoot, item.interval, item.type);
      }
      
      if (chordRoot) {
        circleChords.push({
          chord: chordRoot,
          relationship: item.numeral,
          strength: index === 0 ? 12 : 10 - Math.abs(index - 3),
          position: index,
          context: 'minor-key'
        });
      }
    });
    
    return circleChords;
  }
  
  // Quad context for Dim7 chords - shows all four possible resolutions
  generateDiminishedContext(centerChord) {
    const circleChords = [];
    const centerRoot = centerChord.notes[0];
    
    // Diminished 7th chords resolve to four different keys
    // Each resolution is a minor 2nd up from each chord tone
    const resolutions = [
      { interval: 1, numeral: 'vii°7/I' },   // Leading tone to major
      { interval: 4, numeral: 'vii°7/♭III' }, // Resolution to relative major  
      { interval: 7, numeral: 'vii°7/V' },   // Leading to dominant
      { interval: 10, numeral: 'vii°7/♭VII' } // Leading to subtonic
    ];
    
    // Add the center diminished chord
    circleChords.push({
      chord: centerChord,
      relationship: 'vii°7',
      strength: 12,
      position: 0,
      context: 'diminished'
    });
    
    // Add resolution targets and their related chords
    resolutions.forEach((res, index) => {
      const targetChord = this.getChordByInterval(centerRoot, res.interval, 'major');
      if (targetChord) {
        circleChords.push({
          chord: targetChord,
          relationship: res.numeral,
          strength: 10,
          position: (index * 3) + 1, // Spread around circle
          context: 'diminished'
        });
        
        // Add some related chords for each resolution
        const relatedV = this.getChordByInterval(targetChord.notes[0], 7, 'major');
        const relatediv = this.getChordByInterval(targetChord.notes[0], 5, 'minor7');
        
        if (relatedV) {
          circleChords.push({
            chord: relatedV,
            relationship: 'V/' + res.numeral.split('/')[1],
            strength: 8,
            position: (index * 3) + 2,
            context: 'diminished'
          });
        }
        
        if (relatediv) {
          circleChords.push({
            chord: relatediv,
            relationship: 'iv/' + res.numeral.split('/')[1],
            strength: 6,
            position: (index * 3) + 3,
            context: 'diminished'
          });
        }
      }
    });
    
    return circleChords.slice(0, 12);
  }
  
  // Simple circle of fifths for basic major/minor chords
  generateSimpleCircleOfFifths(centerChord) {
    const circleChords = [];
    const centerRoot = centerChord.notes[0];
    const centerType = centerChord.type;
    
    // Add center chord
    circleChords.push({ 
      chord: centerChord, 
      relationship: 'I', 
      strength: 12, 
      position: 0,
      context: 'circle-of-fifths'
    });
    
    // Generate circle of fifths going clockwise (up by perfect fifths)
    let currentRoot = centerRoot;
    for (let i = 1; i < 12; i++) {
      // Get the root note that is a perfect fifth up
      const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const currentIndex = noteNames.indexOf(currentRoot);
      const nextIndex = (currentIndex + 7) % 12; // Perfect fifth = 7 semitones
      const nextRoot = noteNames[nextIndex];
      
      // Find a chord with this root note, preferring the same type as center chord
      let nextChord = this.getChordByRoot(nextRoot, centerType);
      if (!nextChord) {
        // Fallback to major if exact type not found
        nextChord = this.getChordByRoot(nextRoot, 'major');
      }
      
      if (nextChord) {
        // Calculate Roman numeral based on interval from center
        const interval = (nextIndex - noteNames.indexOf(centerRoot) + 12) % 12;
        const romanNumeral = this.getSimpleRomanNumeral(interval, nextChord.type);
        
        circleChords.push({ 
          chord: nextChord, 
          relationship: romanNumeral, 
          strength: 11 - Math.min(i, 12 - i), // Strength decreases with distance
          position: i,
          context: 'circle-of-fifths'
        });
        currentRoot = nextRoot;
      }
    }
    
    return circleChords.slice(0, 12);
  }
  
  // Simple Roman numeral mapping for circle of fifths
  getSimpleRomanNumeral(interval, chordType) {
    const romanMap = {
      0: 'I', 1: '♭II', 2: 'II', 3: '♭III', 4: 'III', 5: 'IV',
      6: '♭V', 7: 'V', 8: '♭VI', 9: 'VI', 10: '♭VII', 11: 'VII'
    };
    
    let numeral = romanMap[interval] || '';
    
    // Use lowercase for minor chords
    if (chordType === 'minor' || chordType === 'minor7') {
      numeral = numeral.toLowerCase();
    }
    
    return numeral;
  }
  
  // Get chord by root note and type
  getChordByRoot(rootNote, chordType) {
    return CHORD_LIBRARY.find(c => 
      c.notes[0] === rootNote && c.type === chordType
    );
  }
  
  // Get Roman numeral for chord position in circle of fifths
  getRomanNumeral(position, chordType) {
    // Map circle of fifths positions to scale degrees
    const romanNumerals = {
      1: { major: 'V', minor: 'v' },      // Dominant
      2: { major: 'II', minor: 'ii' },    // Supertonic  
      3: { major: 'VI', minor: 'vi' },    // Submediant
      4: { major: 'III', minor: 'iii' },  // Mediant
      5: { major: 'VII', minor: 'vii°' }, // Leading tone
      6: { major: 'IV♯', minor: 'iv♯' },  // Tritone substitute
      7: { major: 'I♯', minor: 'i♯' },    // Augmented tonic
      8: { major: 'V♯', minor: 'v♯' },    // Augmented dominant
      9: { major: 'II♯', minor: 'ii♯' },  // Augmented supertonic
      10: { major: 'VI♯', minor: 'vi♯' }, // Augmented submediant
      11: { major: 'IV', minor: 'iv' }    // Subdominant
    };
    
    const numeralMap = romanNumerals[position];
    if (!numeralMap) return '';
    
    // Return appropriate numeral based on chord type
    if (chordType === 'minor' || chordType === 'minor7') {
      return numeralMap.minor;
    } else if (chordType === 'diminished7') {
      return numeralMap.minor + '°';
    } else {
      return numeralMap.major;
    }
  }
  
  // Calculate harmonically related chords for spider web view (old method kept for compatibility)
  calculateSurroundingChords(centerChord) {
    // Now using circle of fifths
    const circleChords = this.generateCircleOfFifths(centerChord);
    
    // Return the most related chords (excluding the center)
    return circleChords
      .filter(item => item.chord !== centerChord)
      .slice(0, 11); // Return 11 chords (full circle minus center)
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
    this.currentContext = 'tonic'; // Default context
    this.surroundingChords = this.calculateSurroundingChords(chord);
    this.calculateChordPositions();
    this.render();
    
    // Update the current chord display
    this.updateCurrentChordDisplay(chord);
    
    // Show/hide context selector based on chord type
    this.updateContextSelector(chord);
  }
  
  // Show context selector for chords with multiple contexts
  updateContextSelector(chord) {
    const contextSelect = document.getElementById('context-select');
    if (!contextSelect) return;
    
    if (chord.type === 'minor' || chord.type === 'minor7') {
      // Show context selector for minor chords
      contextSelect.style.display = 'block';
      contextSelect.value = this.currentContext || 'tonic';
    } else if (chord.type === 'diminished7') {
      // TODO: Show quad context selector for diminished chords
      contextSelect.style.display = 'none';
    } else {
      // Hide for major chords (single context)
      contextSelect.style.display = 'none';
    }
  }

  // Calculate positions for circle of fifths
  calculateChordPositions() {
    this.chordPositions.clear();
    
    if (!this.currentChord) return;
    
    // Generate circle of fifths
    const circleChords = this.generateCircleOfFifths(this.currentChord);
    
    // Position chords in a circle
    circleChords.forEach((item, index) => {
      // Start at top (12 o'clock) and go clockwise
      const angle = (index * 2 * Math.PI) / 12 - Math.PI / 2;
      const x = this.centerX + Math.cos(angle) * this.radius;
      const y = this.centerY + Math.sin(angle) * this.radius;
      
      this.chordPositions.set(item.chord.name, {
        x: x,
        y: y,
        chord: item.chord,
        relationship: item.relationship,
        strength: item.strength,
        isCenter: index === 0,
        position: index
      });
    });
  }

  // Render the harmonic map
  render() {
    // Clear canvas with transparent background
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
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
    
    // Draw subtle circle outline to show the circle of fifths path
    this.ctx.strokeStyle = 'rgba(52, 152, 219, 0.1)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 10]);
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  drawChords() {
    this.chordPositions.forEach((pos, chordName) => {
      const isHovered = this.hoveredChord === chordName;
      const isCenter = pos.isCenter;
      const position = pos.position || 0;
      const context = pos.context || 'circle-of-fifths';
      
      // Mobile-responsive sizing
      const isMobile = this.canvas.width < 400;
      const baseRadius = isMobile ? 22 : 30;
      const centerRadius = isMobile ? 28 : 40;
      const hoveredRadius = isMobile ? 25 : 35;
      
      // Chord circle
      this.ctx.beginPath();
      const radius = isCenter ? centerRadius : (isHovered ? hoveredRadius : baseRadius);
      this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      
      // Context-aware styling
      if (isCenter) {
        // Selected chord - style based on context
        const gradient = this.ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
        if (context === 'major-key') {
          gradient.addColorStop(0, '#f39c12'); // Warm golden
          gradient.addColorStop(1, '#e67e22');
        } else if (context === 'minor-key') {
          gradient.addColorStop(0, '#9b59b6'); // Cool purple
          gradient.addColorStop(1, '#8e44ad');
        } else {
          gradient.addColorStop(0, '#3498db'); // Default blue
          gradient.addColorStop(1, '#2980b9');
        }
        this.ctx.fillStyle = gradient;
      } else if (isHovered) {
        this.ctx.fillStyle = '#3498db';
      } else {
        // Color based on harmonic function
        if (context === 'major-key') {
          // Warm colors for major key context
          const strength = pos.strength / 12;
          this.ctx.fillStyle = `rgba(243, 156, 18, ${strength * 0.8 + 0.2})`;
        } else if (context === 'minor-key') {
          // Cool colors for minor key context
          const strength = pos.strength / 12;
          this.ctx.fillStyle = `rgba(155, 89, 182, ${strength * 0.8 + 0.2})`;
        } else {
          // Default blue tones
          const strength = pos.strength / 12;
          this.ctx.fillStyle = `rgba(52, 152, 219, ${strength * 0.8 + 0.2})`;
        }
      }
      this.ctx.fill();
      
      // Border
      this.ctx.strokeStyle = isCenter ? '#ffffff' : 'rgba(52, 73, 94, 0.5)';
      this.ctx.lineWidth = isCenter ? 3 : 2;
      this.ctx.stroke();
      
      // Chord name with mobile-responsive font sizing
      this.ctx.fillStyle = isCenter || pos.strength > 8 ? '#ffffff' : '#2c3e50';
      const fontSize = isMobile ? (isCenter ? 12 : 10) : (isCenter ? 16 : 14);
      this.ctx.font = `bold ${fontSize}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(chordName, pos.x, pos.y);
      
      // Show Roman numeral analysis from relationship (smaller on mobile)
      if (!isCenter && pos.relationship) {
        this.ctx.fillStyle = 'rgba(44, 62, 80, 0.8)';
        const romanFontSize = isMobile ? 8 : 11;
        this.ctx.font = `bold ${romanFontSize}px sans-serif`;
        this.ctx.fillText(pos.relationship, pos.x, pos.y + radius + (isMobile ? 10 : 14));
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
    // Responsive text sizing based on canvas size
    const isMobile = this.canvas.width < 400;
    const titleSize = isMobile ? 20 : 28;
    const mainTextSize = isMobile ? 14 : 20;
    const secondaryTextSize = isMobile ? 12 : 16;
    
    // Draw main title
    this.ctx.fillStyle = 'rgba(52, 73, 94, 0.9)';
    this.ctx.font = `bold ${titleSize}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Harmonic Map', this.centerX, this.centerY - (isMobile ? 40 : 60));
    
    // Draw main instruction text
    this.ctx.fillStyle = 'rgba(52, 73, 94, 0.8)';
    this.ctx.font = `bold ${mainTextSize}px sans-serif`;
    
    if (isMobile) {
      this.ctx.fillText('Tap chords to build', this.centerX, this.centerY - 10);
      this.ctx.fillText('harmonic progression', this.centerX, this.centerY + 10);
    } else {
      this.ctx.fillText('Drop chords here to build progression', this.centerX, this.centerY - 20);
      
      // Draw secondary instruction
      this.ctx.fillStyle = 'rgba(127, 140, 141, 0.7)';
      this.ctx.font = `${secondaryTextSize}px sans-serif`;
      this.ctx.fillText('and explore harmonic relationships', this.centerX, this.centerY + 10);
    }
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
    
    this.updateHoveredChord(x, y);
  }
  
  // Touch event handlers
  handleTouchStart(event) {
    event.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    this.updateHoveredChord(x, y);
  }
  
  handleTouchMove(event) {
    event.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    this.updateHoveredChord(x, y);
  }
  
  handleTouchEnd(event) {
    event.preventDefault();
    if (this.hoveredChord && this.hoveredChord !== this.currentChord?.name) {
      this.navigateToChord(this.hoveredChord);
    }
    // Clear hover state after touch
    setTimeout(() => {
      this.hoveredChord = null;
      this.clearNextChordDisplay();
      this.render();
    }, 100);
  }
  
  // Unified method for updating hovered chord (used by both mouse and touch)
  updateHoveredChord(x, y) {
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
    
    // Change cursor (only relevant for desktop)
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
  navigateToChord(chordName, fromHistory = false) {
    const isCurrentChord = this.currentChord && this.currentChord.name === chordName;
    
    // Always play the chord sound
    if (window.playChord) {
      window.playChord(chordName);
    }
    
    // If clicking the same chord, don't update the map or history
    if (isCurrentChord) {
      return;
    }
    
    this.setCurrentChord(chordName);
    
    // Update chord history only if not navigating from history
    if (!fromHistory && window.updateChordHistory) {
      window.updateChordHistory(chordName);
    } else if (fromHistory) {
      // If navigating from history, just refresh the display to update current chord styling
      if (window.updateChordHistory) {
        const container = document.getElementById('chord-history');
        if (container) {
          const items = container.querySelectorAll('.chord-history-item');
          items.forEach((item) => {
            const position = parseInt(item.dataset.position);
            if (position < window.chordHistory.length) {
              const chord = window.chordHistory[position];
              const isCurrentChord = window.harmonicMap && 
                                   window.harmonicMap.currentChord && 
                                   window.harmonicMap.currentChord.name === chord;
              
              if (isCurrentChord) {
                item.classList.add('current-chord');
              } else {
                item.classList.remove('current-chord');
              }
            }
          });
        }
      }
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