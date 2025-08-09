class Fretboard {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Fretboard container '${containerId}' not found`);
      return;
    }
    this.strings = 6;
    this.frets = options.frets || 5; // Show first 5 frets
    this.isMini = options.mini || false;
    
    if (this.isMini) {
      this.stringSpacing = 20;
      this.fretSpacing = 30;
    } else {
      this.stringSpacing = 40;
      this.fretSpacing = 60;
    }
    
    // Swap width and height for vertical orientation
    this.width = (this.strings - 1) * this.stringSpacing + (this.isMini ? 40 : 80);
    this.height = (this.frets + 1) * this.fretSpacing + (this.isMini ? 40 : 80);
    this.currentChord = null;
    
    this.initializeFretboard();
  }
  
  initializeFretboard() {
    if (!this.container) return;
    
    // Clear container
    this.container.innerHTML = '';
    
    // Create SVG element
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);
    this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
    this.svg.style.border = '1px solid #444'; // Debug border
    console.log('SVG created with dimensions:', this.width, 'x', this.height);
    this.container.appendChild(this.svg);
    
    this.drawFretboard();
  }
  
  drawFretboard() {
    if (!this.svg) {
      console.error('SVG not initialized');
      return;
    }
    
    console.log('Drawing fretboard...');
    // Clear SVG content
    this.svg.innerHTML = '';
    
    // Add a simple background rectangle
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', this.width);
    bg.setAttribute('height', this.height);
    bg.setAttribute('fill', 'transparent');
    bg.setAttribute('rx', '8');
    this.svg.appendChild(bg);
    
    const startX = this.isMini ? 20 : 40;
    const startY = this.isMini ? 30 : 60;
    
    // Draw nut (thick line at fret 0) - now horizontal at top
    const nut = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    nut.setAttribute('x1', startX);
    nut.setAttribute('y1', startY);
    nut.setAttribute('x2', startX + (this.strings - 1) * this.stringSpacing);
    nut.setAttribute('y2', startY);
    nut.setAttribute('stroke', '#34495e');
    nut.setAttribute('stroke-width', '3');
    this.svg.appendChild(nut);
    
    // Draw fret lines - now horizontal
    for (let fret = 1; fret <= this.frets; fret++) {
      const y = startY + fret * this.fretSpacing;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', startX);
      line.setAttribute('y1', y);
      line.setAttribute('x2', startX + (this.strings - 1) * this.stringSpacing);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', '#7f8c8d');
      line.setAttribute('stroke-width', this.isMini ? '1' : '1.5');
      this.svg.appendChild(line);
      
      // Add fret numbers on the right (only for full-size fretboards)
      if (!this.isMini) {
        const fretNumber = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        fretNumber.setAttribute('x', startX + (this.strings - 1) * this.stringSpacing + 20);
        fretNumber.setAttribute('y', y - this.fretSpacing / 2 + 5);
        fretNumber.setAttribute('fill', '#95a5a6');
        fretNumber.setAttribute('font-family', 'Arial, sans-serif');
        fretNumber.setAttribute('font-size', '12');
        fretNumber.setAttribute('text-anchor', 'middle');
        fretNumber.textContent = fret;
        this.svg.appendChild(fretNumber);
      }
    }
    
    // Draw strings (from low E to high e) - now vertical
    const stringNames = ['E', 'A', 'D', 'G', 'B', 'e'];
    for (let string = 0; string < this.strings; string++) {
      const x = startX + string * this.stringSpacing;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x);
      line.setAttribute('y1', startY);
      line.setAttribute('x2', x);
      line.setAttribute('y2', startY + this.frets * this.fretSpacing);
      line.setAttribute('stroke', '#bdc3c7');
      line.setAttribute('stroke-width', this.isMini ? '1' : '1.5');
      this.svg.appendChild(line);
      
      // Add string names at the top (only for full-size fretboards)
      if (!this.isMini) {
        const stringName = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        stringName.setAttribute('x', x);
        stringName.setAttribute('y', 25);
        stringName.setAttribute('fill', '#95a5a6');
        stringName.setAttribute('font-family', 'Arial, sans-serif');
        stringName.setAttribute('font-size', '12');
        stringName.setAttribute('text-anchor', 'middle');
        stringName.textContent = stringNames[string];
        this.svg.appendChild(stringName);
      }
    }
  }
  
  render(chordData) {
    console.log('Fretboard render called with:', chordData);
    if (!chordData) {
      this.clear();
      return;
    }
    
    if (!this.container) {
      console.error('Fretboard container not found');
      return;
    }
    
    this.currentChord = chordData;
    this.drawFretboard();
    
    const startX = this.isMini ? 20 : 40;
    const startY = this.isMini ? 30 : 60;
    const fretPattern = chordData.fretPattern;
    
    // Add chord name at bottom
    const chordName = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    chordName.setAttribute('x', this.width / 2);
    chordName.setAttribute('y', this.height - (this.isMini ? 5 : 10));
    chordName.setAttribute('fill', '#2c3e50');
    chordName.setAttribute('font-family', 'Arial, sans-serif');
    chordName.setAttribute('font-size', this.isMini ? '10' : '16');
    chordName.setAttribute('font-weight', 'bold');
    chordName.setAttribute('text-anchor', 'middle');
    chordName.textContent = chordData.name;
    this.svg.appendChild(chordName);
    
    // Draw finger positions and string markers
    for (let string = 0; string < this.strings; string++) {
      const fret = fretPattern.strings[string];
      const finger = fretPattern.fingers[string];
      const x = startX + string * this.stringSpacing;
      
      if (fret === -1) {
        // Muted string - draw X above the nut
        const y = startY - (this.isMini ? 10 : 20);
        const size = this.isMini ? 3 : 5;
        const mute1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        mute1.setAttribute('x1', x - size);
        mute1.setAttribute('y1', y - size);
        mute1.setAttribute('x2', x + size);
        mute1.setAttribute('y2', y + size);
        mute1.setAttribute('stroke', '#e74c3c');
        mute1.setAttribute('stroke-width', this.isMini ? '2' : '2.5');
        this.svg.appendChild(mute1);
        
        const mute2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        mute2.setAttribute('x1', x - size);
        mute2.setAttribute('y1', y + size);
        mute2.setAttribute('x2', x + size);
        mute2.setAttribute('y2', y - size);
        mute2.setAttribute('stroke', '#e74c3c');
        mute2.setAttribute('stroke-width', this.isMini ? '2' : '2.5');
        this.svg.appendChild(mute2);
      } else if (fret === 0) {
        // Open string - draw circle above the nut
        const y = startY - (this.isMini ? 10 : 20);
        const openCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        openCircle.setAttribute('cx', x);
        openCircle.setAttribute('cy', y);
        openCircle.setAttribute('r', this.isMini ? 4 : 8);
        openCircle.setAttribute('fill', 'none');
        openCircle.setAttribute('stroke', '#27ae60');
        openCircle.setAttribute('stroke-width', this.isMini ? '2' : '2.5');
        this.svg.appendChild(openCircle);
      } else {
        // Finger position - draw filled circle with finger number
        const y = startY + (fret - 0.5) * this.fretSpacing;
        
        // Draw finger dot
        const fingerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        fingerDot.setAttribute('cx', x);
        fingerDot.setAttribute('cy', y);
        fingerDot.setAttribute('r', this.isMini ? 6 : 12);
        fingerDot.setAttribute('fill', '#34495e');
        fingerDot.setAttribute('stroke', '#ffffff');
        fingerDot.setAttribute('stroke-width', this.isMini ? '1' : '2');
        this.svg.appendChild(fingerDot);
        
        // Add finger number (if not 0)
        if (finger > 0) {
          const fingerNumber = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          fingerNumber.setAttribute('x', x);
          fingerNumber.setAttribute('y', y + (this.isMini ? 2 : 5));
          fingerNumber.setAttribute('fill', 'white');
          fingerNumber.setAttribute('font-family', 'Arial, sans-serif');
          fingerNumber.setAttribute('font-size', this.isMini ? '8' : '14');
          fingerNumber.setAttribute('font-weight', 'bold');
          fingerNumber.setAttribute('text-anchor', 'middle');
          fingerNumber.textContent = finger;
          this.svg.appendChild(fingerNumber);
        }
      }
    }
  }
  
  highlight(fromChord, toChord) {
    if (!fromChord || !toChord) return;
    
    // This method can be used to show chord transitions
    // For now, just render the current chord
    this.render(toChord);
  }
  
  clear() {
    this.currentChord = null;
    this.drawFretboard();
  }
}