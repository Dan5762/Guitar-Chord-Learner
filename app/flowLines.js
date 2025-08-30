class FlowVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.noteYPositions = {}; // Track Y position for each note
    this.minFreq = 82.41; // Low E (E2)
    this.maxFreq = 659.25; // High E (E5)
    this.canvasHeight = 400; // Increased height for more space
    this.canvasWidth = 1000; // Increased width
    this.margin = 60; // Increased margins
    this.topMargin = 80; // Extra top margin for relationship indicators
    this.bottomMargin = 40; // Bottom margin for tension curve
  }

  setupCanvas() {
    // Set canvas size based on container
    const container = this.canvas.parentElement;
    this.canvasWidth = Math.max(1000, container.clientWidth - 40); // Minimum width
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    
    // Clear canvas
    this.clearCanvas();
  }

  clearCanvas() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Draw subtle background grid
    this.ctx.strokeStyle = 'rgba(236, 240, 241, 0.5)';
    this.ctx.lineWidth = 1;
    
    // Vertical lines for chord positions
    for (let i = 0; i < 4; i++) {
      const x = this.getChordX(i);
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.topMargin);
      this.ctx.lineTo(x, this.canvasHeight - this.bottomMargin);
      this.ctx.stroke();
    }
  }

  // Convert frequency to Y position (higher frequency = lower Y)
  frequencyToY(frequency) {
    const normalizedFreq = Math.log(frequency / this.minFreq) / Math.log(this.maxFreq / this.minFreq);
    const availableHeight = this.canvasHeight - this.topMargin - this.bottomMargin;
    return this.canvasHeight - this.bottomMargin - (normalizedFreq * availableHeight);
  }

  // Get X position for chord at index
  getChordX(index) {
    const availableWidth = this.canvasWidth - 2 * this.margin;
    const chordSpacing = availableWidth / 4; // 4 chord slots, so 4 segments
    return this.margin + (index * chordSpacing) + (chordSpacing / 2);
  }

  drawFlowLines(progression) {
    this.clearCanvas();
    
    if (!progression || progression.length === 0) return;
    
    const validChords = progression.filter(chord => chord !== null);
    if (validChords.length === 0) return;

    // Draw chord names first
    validChords.forEach((chordName, index) => {
      const actualIndex = progression.indexOf(chordName, index > 0 ? progression.indexOf(validChords[index - 1]) + 1 : 0);
      const x = this.getChordX(actualIndex);
      
      this.ctx.fillStyle = '#2c3e50';
      this.ctx.font = 'bold 18px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(chordName, x, 30);
    });

    // Draw interval bands first (background)
    this.drawAllIntervalBands(progression);
    
    // Draw tension curve for the progression
    this.drawTensionCurve(progression);
    
    // Draw note flow lines
    this.drawNoteFlowLines(progression);
    
    // Draw note circles on top
    this.drawNoteCircles(progression);
    
    // Draw harmonic context indicators
    this.drawHarmonicContext(progression);
  }

  drawAllIntervalBands(progression) {
    progression.forEach((chordName, index) => {
      if (!chordName) return;
      
      const chord = CHORD_LIBRARY.find(c => c.name === chordName);
      if (!chord) return;
      
      this.drawIntervalBands(chord, index);
    });
  }

  drawIntervalBands(chord, chordIndex) {
    const x = this.getChordX(chordIndex);
    const availableWidth = (this.canvasWidth - 2 * this.margin) / 4;
    const bandWidth = Math.min(120, availableWidth * 0.8); // Responsive width
    
    // Draw bands between each pair of notes
    for (let i = 0; i < chord.frequencies.length - 1; i++) {
      for (let j = i + 1; j < chord.frequencies.length; j++) {
        const freq1 = chord.frequencies[i];
        const freq2 = chord.frequencies[j];
        const y1 = this.frequencyToY(freq1);
        const y2 = this.frequencyToY(freq2);
        
        const intervalData = this.getIntervalData(freq1, freq2);
        if (!intervalData) continue;
        
        const height = Math.abs(y2 - y1);
        const minY = Math.min(y1, y2);
        
        // Create gradient based on consonance/tension
        const gradient = this.ctx.createLinearGradient(0, minY, 0, minY + height);
        const baseOpacity = Math.min(0.6, intervalData.consonance / 100 * 0.8);
        
        gradient.addColorStop(0, intervalData.color + Math.floor(baseOpacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, intervalData.color + Math.floor((baseOpacity + 0.2) * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, intervalData.color + Math.floor(baseOpacity * 255).toString(16).padStart(2, '0'));
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x - bandWidth/2, minY, bandWidth, height);
        
        // Add tension indicator (border intensity)
        if (intervalData.tension > 50) {
          this.ctx.strokeStyle = intervalData.color;
          this.ctx.lineWidth = Math.max(1, intervalData.tension / 25);
          this.ctx.strokeRect(x - bandWidth/2, minY, bandWidth, height);
        }
        
        // Add interval label and feel description
        if (height > 50) { // Only show labels if there's enough space
          const centerY = minY + height/2;
          
          // Draw semi-transparent background for text
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          this.ctx.fillRect(x - bandWidth/2 + 6, centerY - 25, bandWidth - 12, 45);
          
          // Draw interval name
          this.ctx.fillStyle = intervalData.color;
          this.ctx.font = 'bold 12px sans-serif';
          this.ctx.textAlign = 'center';
          this.ctx.fillText(intervalData.name, x, centerY - 8);
          
          // Draw feel description
          this.ctx.fillStyle = '#2c3e50';
          this.ctx.font = '10px sans-serif';
          this.ctx.fillText(intervalData.feel, x, centerY + 8);
        }
      }
    }
  }

  drawNoteFlowLines(progression) {
    const validChords = progression.map((chordName, index) => {
      if (!chordName) return null;
      const chord = CHORD_LIBRARY.find(c => c.name === chordName);
      return { chord, index, name: chordName };
    }).filter(item => item !== null);

    // Draw connections between consecutive chords
    for (let i = 0; i < validChords.length - 1; i++) {
      const currentChord = validChords[i];
      const nextChord = validChords[i + 1];
      
      this.drawChordTransition(currentChord, nextChord);
    }
  }

  drawChordTransition(currentChord, nextChord) {
    const x1 = this.getChordX(currentChord.index);
    const x2 = this.getChordX(nextChord.index);
    
    // Track which notes have been connected
    const connectedNotes = new Set();
    
    // First pass: connect identical or very close notes (unisons/octaves)
    currentChord.chord.frequencies.forEach((freq1, i) => {
      nextChord.chord.frequencies.forEach((freq2, j) => {
        if (connectedNotes.has(`next-${j}`)) return;
        
        const ratio = Math.max(freq1, freq2) / Math.min(freq1, freq2);
        
        // Connect unisons and octaves with solid lines
        if (ratio <= 1.01 || Math.abs(ratio - 2) < 0.01) {
          const y1 = this.frequencyToY(freq1);
          const y2 = this.frequencyToY(freq2);
          
          this.drawNoteLine(x1, y1, x2, y2, 'continue', freq1, freq2);
          connectedNotes.add(`current-${i}`);
          connectedNotes.add(`next-${j}`);
        }
      });
    });
    
    // Second pass: connect remaining notes with curved lines
    currentChord.chord.frequencies.forEach((freq1, i) => {
      if (connectedNotes.has(`current-${i}`)) return;
      
      // Find best match among unconnected notes
      let bestMatch = -1;
      let bestDistance = Infinity;
      
      nextChord.chord.frequencies.forEach((freq2, j) => {
        if (connectedNotes.has(`next-${j}`)) return;
        
        const distance = Math.abs(Math.log(freq2 / freq1));
        if (distance < bestDistance) {
          bestDistance = distance;
          bestMatch = j;
        }
      });
      
      if (bestMatch !== -1) {
        const y1 = this.frequencyToY(freq1);
        const y2 = this.frequencyToY(nextChord.chord.frequencies[bestMatch]);
        
        this.drawNoteLine(x1, y1, x2, y2, 'move', freq1, nextChord.chord.frequencies[bestMatch]);
        connectedNotes.add(`current-${i}`);
        connectedNotes.add(`next-${bestMatch}`);
      } else {
        // Note disappears
        const y1 = this.frequencyToY(freq1);
        this.drawNoteLine(x1, y1, x2, y1, 'disappear', freq1, null);
      }
    });
    
    // Third pass: handle appearing notes
    nextChord.chord.frequencies.forEach((freq2, j) => {
      if (!connectedNotes.has(`next-${j}`)) {
        const y2 = this.frequencyToY(freq2);
        this.drawNoteLine(x1, y2, x2, y2, 'appear', null, freq2);
      }
    });
  }

  drawNoteLine(x1, y1, x2, y2, type, freq1, freq2) {
    this.ctx.lineWidth = 3;
    
    switch (type) {
      case 'continue':
        // Solid thick line for unchanged notes
        this.ctx.strokeStyle = '#27ae60';
        this.ctx.setLineDash([]);
        this.drawStraightLine(x1, y1, x2, y2);
        break;
        
      case 'move':
        // Curved line for moving notes
        this.ctx.strokeStyle = '#3498db';
        this.ctx.setLineDash([]);
        this.drawCurvedLine(x1, y1, x2, y2);
        break;
        
      case 'disappear':
        // Dashed line fading out
        this.ctx.strokeStyle = '#e74c3c';
        this.ctx.setLineDash([8, 4]);
        this.drawFadeOutLine(x1, y1, x2, y2);
        break;
        
      case 'appear':
        // Line fading in
        this.ctx.strokeStyle = '#f39c12';
        this.ctx.setLineDash([]);
        this.drawFadeInLine(x1, y1, x2, y2);
        break;
    }
    
    this.ctx.setLineDash([]); // Reset dash pattern
  }

  drawStraightLine(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1 + 18, y1);
    this.ctx.lineTo(x2 - 18, y2);
    this.ctx.stroke();
  }

  drawCurvedLine(x1, y1, x2, y2) {
    const controlX = (x1 + x2) / 2;
    const controlY = (y1 + y2) / 2 - Math.abs(y2 - y1) * 0.3;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x1 + 18, y1);
    this.ctx.quadraticCurveTo(controlX, controlY, x2 - 18, y2);
    this.ctx.stroke();
  }

  drawFadeOutLine(x1, y1, x2, y2) {
    const gradient = this.ctx.createLinearGradient(x1, 0, x2, 0);
    gradient.addColorStop(0, '#e74c3c');
    gradient.addColorStop(1, 'rgba(231, 76, 60, 0.2)');
    
    this.ctx.strokeStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(x1 + 18, y1);
    this.ctx.lineTo(x2 - 18, y2);
    this.ctx.stroke();
  }

  drawFadeInLine(x1, y1, x2, y2) {
    const gradient = this.ctx.createLinearGradient(x1, 0, x2, 0);
    gradient.addColorStop(0, 'rgba(243, 156, 18, 0.2)');
    gradient.addColorStop(1, '#f39c12');
    
    this.ctx.strokeStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(x1 + 18, y1);
    this.ctx.lineTo(x2 - 18, y2);
    this.ctx.stroke();
  }

  drawNoteCircles(progression) {
    progression.forEach((chordName, index) => {
      if (!chordName) return;
      
      const chord = CHORD_LIBRARY.find(c => c.name === chordName);
      if (!chord) return;
      
      const x = this.getChordX(index);
      
      chord.frequencies.forEach((freq, noteIndex) => {
        const y = this.frequencyToY(freq);
        
        // Draw note circle with more space
        this.ctx.beginPath();
        this.ctx.arc(x, y, 15, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw note name
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = 'bold 11px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(chord.notes[noteIndex], x, y);
      });
    });
  }

  getIntervalColor(freq1, freq2) {
    const ratio = calculateIntervalRatio(freq1, freq2);
    if (ratio && ratio.color) {
      return ratio.color;
    }
    return '#95a5a6'; // Default gray for unrecognized intervals
  }

  getIntervalData(freq1, freq2) {
    return calculateIntervalRatio(freq1, freq2);
  }

  // Calculate harmonic tension for chord progressions
  calculateProgressionTension(progression) {
    let tensions = [];
    
    for (let i = 0; i < progression.length - 1; i++) {
      if (!progression[i] || !progression[i + 1]) {
        tensions.push(0);
        continue;
      }
      
      const currentChord = CHORD_LIBRARY.find(c => c.name === progression[i]);
      const nextChord = CHORD_LIBRARY.find(c => c.name === progression[i + 1]);
      
      if (!currentChord || !nextChord) {
        tensions.push(0);
        continue;
      }
      
      let totalTension = 0;
      let connectionCount = 0;
      
      // Calculate tension based on voice leading
      currentChord.frequencies.forEach(freq1 => {
        nextChord.frequencies.forEach(freq2 => {
          const intervalData = this.getIntervalData(freq1, freq2);
          if (intervalData) {
            totalTension += intervalData.tension;
            connectionCount++;
          }
        });
      });
      
      tensions.push(connectionCount > 0 ? totalTension / connectionCount : 0);
    }
    
    return tensions;
  }

  // Draw tension curve over the progression
  drawTensionCurve(progression) {
    const tensions = this.calculateProgressionTension(progression);
    if (tensions.length === 0) return;
    
    this.ctx.strokeStyle = 'rgba(231, 76, 60, 0.7)';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    
    tensions.forEach((tension, i) => {
      const x1 = this.getChordX(i);
      const x2 = this.getChordX(i + 1);
      const x = (x1 + x2) / 2;
      const availableHeight = this.canvasHeight - this.topMargin - this.bottomMargin;
      const y = this.canvasHeight - this.bottomMargin - (tension / 100) * availableHeight * 0.3; // Only use 30% of height
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      
      // Add tension indicator dots
      this.ctx.fillStyle = tension > 70 ? '#e74c3c' : tension > 40 ? '#f39c12' : '#27ae60';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 5, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.ctx.stroke();
    
    // Add tension scale labels
    this.ctx.fillStyle = 'rgba(44, 62, 80, 0.6)';
    this.ctx.font = '11px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Tension:', 10, this.canvasHeight - 25);
    this.ctx.fillText('High', 10, this.canvasHeight - this.bottomMargin - availableHeight * 0.25);
    this.ctx.fillText('Low', 10, this.canvasHeight - this.bottomMargin);
  }

  // Draw harmonic context indicators
  drawHarmonicContext(progression) {
    const validChords = progression.filter(chord => chord !== null);
    if (validChords.length < 2) return;
    
    // Analyze chord relationships and draw context indicators
    for (let i = 0; i < validChords.length - 1; i++) {
      const currentChord = CHORD_LIBRARY.find(c => c.name === validChords[i]);
      const nextChord = CHORD_LIBRARY.find(c => c.name === validChords[i + 1]);
      
      if (!currentChord || !nextChord) continue;
      
      const currentIndex = progression.indexOf(validChords[i]);
      const nextIndex = progression.indexOf(validChords[i + 1]);
      const x1 = this.getChordX(currentIndex);
      const x2 = this.getChordX(nextIndex);
      const midX = (x1 + x2) / 2;
      
      // Analyze harmonic relationship
      const relationship = this.analyzeHarmonicRelationship(currentChord, nextChord);
      
      // Draw relationship indicator with more space
      const boxWidth = 100;
      const boxHeight = 35;
      const boxY = 40;
      
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      this.ctx.fillRect(midX - boxWidth/2, boxY, boxWidth, boxHeight);
      
      this.ctx.strokeStyle = relationship.color;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(midX - boxWidth/2, boxY, boxWidth, boxHeight);
      
      this.ctx.fillStyle = relationship.color;
      this.ctx.font = 'bold 11px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(relationship.type, midX, boxY + 15);
      
      this.ctx.fillStyle = '#2c3e50';
      this.ctx.font = '9px sans-serif';
      this.ctx.fillText(relationship.feel, midX, boxY + 28);
    }
  }

  analyzeHarmonicRelationship(chord1, chord2) {
    const type1 = chord1.type;
    const type2 = chord2.type;
    const root1 = chord1.notes[0];
    const root2 = chord2.notes[0];
    
    // Calculate interval between roots
    const freq1 = chord1.frequencies[0];
    const freq2 = chord2.frequencies[0];
    const intervalData = this.getIntervalData(freq1, freq2);
    
    // Determine harmonic function and feeling
    if (root1 === root2) {
      return {
        type: 'Modal Exchange',
        feel: type1 !== type2 ? 'Light/Dark Shift' : 'Same Chord',
        color: '#9b59b6'
      };
    }
    
    if (intervalData) {
      switch (intervalData.name) {
        case 'perfect fifth':
          return {
            type: 'Circle of 5ths',
            feel: 'Strong Resolution',
            color: '#27ae60'
          };
        case 'perfect fourth':
          return {
            type: 'Plagal Motion',
            feel: 'Gentle Resolution',
            color: '#16a085'
          };
        case 'minor second':
        case 'major second':
          return {
            type: 'Stepwise Motion',
            feel: 'Smooth Voice Leading',
            color: '#f39c12'
          };
        case 'major third':
        case 'minor third':
          return {
            type: 'Mediant Relation',
            feel: 'Colorful Harmony',
            color: '#e67e22'
          };
        case 'tritone':
          return {
            type: 'Tritone Sub',
            feel: 'Jazz Substitution',
            color: '#e74c3c'
          };
        default:
          return {
            type: 'Chromatic',
            feel: 'Complex Harmony',
            color: '#95a5a6'
          };
      }
    }
    
    return {
      type: 'Unknown',
      feel: 'Complex Relation',
      color: '#95a5a6'
    };
  }
}

// Make FlowVisualizer available globally
window.FlowVisualizer = FlowVisualizer;