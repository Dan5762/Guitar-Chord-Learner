const CHORD_LIBRARY = [
  // A chords
  {
    name: 'Amaj',
    type: 'major',
    notes: ['A', 'C#', 'E'],
    frequencies: [220.00, 277.18, 329.63],
    fretPattern: {
      strings: [0, 0, 2, 2, 2, 0],
      fingers: [0, 0, 2, 3, 4, 0]
    }
  },
  {
    name: 'Am',
    type: 'minor',
    notes: ['A', 'C', 'E'],
    frequencies: [220.00, 261.63, 329.63],
    fretPattern: {
      strings: [0, 0, 2, 2, 1, 0],
      fingers: [0, 0, 2, 3, 1, 0]
    }
  },
  {
    name: 'A#maj',
    type: 'major',
    notes: ['A#', 'D', 'F'],
    frequencies: [233.08, 293.66, 349.23],
    fretPattern: {
      strings: [1, 1, 3, 3, 3, 1],
      fingers: [1, 1, 2, 3, 4, 1]
    }
  },
  {
    name: 'A#m',
    type: 'minor',
    notes: ['A#', 'C#', 'F'],
    frequencies: [233.08, 277.18, 349.23],
    fretPattern: {
      strings: [1, 1, 3, 3, 2, 1],
      fingers: [1, 1, 3, 4, 2, 1]
    }
  },
  // B chords
  {
    name: 'Bmaj',
    type: 'major',
    notes: ['B', 'D#', 'F#'],
    frequencies: [246.94, 311.13, 369.99],
    fretPattern: {
      strings: [2, 2, 4, 4, 4, 2],
      fingers: [1, 1, 2, 3, 4, 1]
    }
  },
  {
    name: 'Bm',
    type: 'minor',
    notes: ['B', 'D', 'F#'],
    frequencies: [246.94, 293.66, 369.99],
    fretPattern: {
      strings: [2, 2, 4, 4, 3, 2],
      fingers: [1, 1, 3, 4, 2, 1]
    }
  },
  // C chords
  {
    name: 'Cmaj',
    type: 'major',
    notes: ['C', 'E', 'G'],
    frequencies: [261.63, 329.63, 392.00],
    fretPattern: {
      strings: [3, 3, 2, 0, 1, 0],
      fingers: [3, 3, 2, 0, 1, 0]
    }
  },
  {
    name: 'Cm',
    type: 'minor',
    notes: ['C', 'D#', 'G'],
    frequencies: [261.63, 311.13, 392.00],
    fretPattern: {
      strings: [3, 3, 5, 5, 4, 3],
      fingers: [1, 1, 3, 4, 2, 1]
    }
  },
  {
    name: 'C#maj',
    type: 'major',
    notes: ['C#', 'F', 'G#'],
    frequencies: [277.18, 349.23, 415.30],
    fretPattern: {
      strings: [4, 4, 3, 1, 2, 1],
      fingers: [3, 3, 2, 1, 4, 1]
    }
  },
  {
    name: 'C#m',
    type: 'minor',
    notes: ['C#', 'E', 'G#'],
    frequencies: [277.18, 329.63, 415.30],
    fretPattern: {
      strings: [4, 4, 6, 6, 5, 4],
      fingers: [1, 1, 3, 4, 2, 1]
    }
  },
  // D chords
  {
    name: 'Dmaj',
    type: 'major',
    notes: ['D', 'F#', 'A'],
    frequencies: [293.66, 369.99, 440.00],
    fretPattern: {
      strings: [-1, -1, 0, 2, 3, 2],
      fingers: [0, 0, 0, 1, 3, 2]
    }
  },
  {
    name: 'Dm',
    type: 'minor',
    notes: ['D', 'F', 'A'],
    frequencies: [293.66, 349.23, 440.00],
    fretPattern: {
      strings: [-1, -1, 0, 2, 3, 1],
      fingers: [0, 0, 0, 2, 3, 1]
    }
  },
  {
    name: 'D#maj',
    type: 'major',
    notes: ['D#', 'G', 'A#'],
    frequencies: [311.13, 392.00, 466.16],
    fretPattern: {
      strings: [-1, -1, 1, 3, 4, 3],
      fingers: [0, 0, 1, 2, 4, 3]
    }
  },
  {
    name: 'D#m',
    type: 'minor',
    notes: ['D#', 'F#', 'A#'],
    frequencies: [311.13, 369.99, 466.16],
    fretPattern: {
      strings: [-1, -1, 1, 3, 4, 2],
      fingers: [0, 0, 1, 3, 4, 2]
    }
  },
  // E chords
  {
    name: 'Emaj',
    type: 'major',
    notes: ['E', 'G#', 'B'],
    frequencies: [164.81, 207.65, 246.94],
    fretPattern: {
      strings: [0, 2, 2, 1, 0, 0],
      fingers: [0, 2, 3, 1, 0, 0]
    }
  },
  {
    name: 'Em',
    type: 'minor',
    notes: ['E', 'G', 'B'],
    frequencies: [164.81, 196.00, 246.94],
    fretPattern: {
      strings: [0, 2, 2, 0, 0, 0],
      fingers: [0, 2, 3, 0, 0, 0]
    }
  },
  // F chords
  {
    name: 'Fmaj',
    type: 'major',
    notes: ['F', 'A', 'C'],
    frequencies: [349.23, 440.00, 523.25],
    fretPattern: {
      strings: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1]
    }
  },
  {
    name: 'Fm',
    type: 'minor',
    notes: ['F', 'G#', 'C'],
    frequencies: [349.23, 415.30, 523.25],
    fretPattern: {
      strings: [1, 3, 3, 1, 1, 1],
      fingers: [1, 3, 4, 1, 1, 1]
    }
  },
  {
    name: 'F#maj',
    type: 'major',
    notes: ['F#', 'A#', 'C#'],
    frequencies: [369.99, 466.16, 554.37],
    fretPattern: {
      strings: [2, 4, 4, 3, 2, 2],
      fingers: [1, 3, 4, 2, 1, 1]
    }
  },
  {
    name: 'F#m',
    type: 'minor',
    notes: ['F#', 'A', 'C#'],
    frequencies: [369.99, 440.00, 554.37],
    fretPattern: {
      strings: [2, 4, 4, 2, 2, 2],
      fingers: [1, 3, 4, 1, 1, 1]
    }
  },
  // G chords
  {
    name: 'Gmaj',
    type: 'major',
    notes: ['G', 'B', 'D'],
    frequencies: [196.00, 246.94, 293.66],
    fretPattern: {
      strings: [3, 2, 0, 0, 3, 3],
      fingers: [3, 2, 0, 0, 3, 4]
    }
  },
  {
    name: 'Gm',
    type: 'minor',
    notes: ['G', 'A#', 'D'],
    frequencies: [196.00, 233.08, 293.66],
    fretPattern: {
      strings: [3, 5, 5, 3, 3, 3],
      fingers: [1, 3, 4, 1, 1, 1]
    }
  },
  {
    name: 'G#maj',
    type: 'major',
    notes: ['G#', 'C', 'D#'],
    frequencies: [207.65, 261.63, 311.13],
    fretPattern: {
      strings: [4, 3, 1, 1, 4, 4],
      fingers: [3, 2, 1, 1, 3, 4]
    }
  },
  {
    name: 'G#m',
    type: 'minor',
    notes: ['G#', 'B', 'D#'],
    frequencies: [207.65, 246.94, 311.13],
    fretPattern: {
      strings: [4, 6, 6, 4, 4, 4],
      fingers: [1, 3, 4, 1, 1, 1]
    }
  },
  
  // Major 7th chords
  {
    name: 'Amaj7',
    type: 'major7',
    notes: ['A', 'C#', 'E', 'G#'],
    frequencies: [220.00, 277.18, 329.63, 415.30],
    fretPattern: {
      strings: [0, 0, 2, 1, 2, 0],
      fingers: [0, 0, 2, 1, 3, 0]
    }
  },
  {
    name: 'Bmaj7',
    type: 'major7',
    notes: ['B', 'D#', 'F#', 'A#'],
    frequencies: [246.94, 311.13, 369.99, 466.16],
    fretPattern: {
      strings: [2, 2, 4, 3, 4, 2],
      fingers: [1, 1, 3, 2, 4, 1]
    }
  },
  {
    name: 'Cmaj7',
    type: 'major7',
    notes: ['C', 'E', 'G', 'B'],
    frequencies: [261.63, 329.63, 392.00, 493.88],
    fretPattern: {
      strings: [3, 3, 2, 0, 0, 0],
      fingers: [3, 3, 2, 0, 0, 0]
    }
  },
  {
    name: 'Dmaj7',
    type: 'major7',
    notes: ['D', 'F#', 'A', 'C#'],
    frequencies: [293.66, 369.99, 440.00, 554.37],
    fretPattern: {
      strings: [-1, -1, 0, 2, 2, 2],
      fingers: [0, 0, 0, 1, 1, 1]
    }
  },
  {
    name: 'Emaj7',
    type: 'major7',
    notes: ['E', 'G#', 'B', 'D#'],
    frequencies: [164.81, 207.65, 246.94, 311.13],
    fretPattern: {
      strings: [0, 2, 1, 1, 0, 0],
      fingers: [0, 3, 1, 2, 0, 0]
    }
  },
  {
    name: 'Fmaj7',
    type: 'major7',
    notes: ['F', 'A', 'C', 'E'],
    frequencies: [349.23, 440.00, 523.25, 659.25],
    fretPattern: {
      strings: [1, 3, 2, 2, 1, 1],
      fingers: [1, 4, 2, 3, 1, 1]
    }
  },
  {
    name: 'Gmaj7',
    type: 'major7',
    notes: ['G', 'B', 'D', 'F#'],
    frequencies: [196.00, 246.94, 293.66, 369.99],
    fretPattern: {
      strings: [3, 2, 0, 0, 0, 2],
      fingers: [3, 2, 0, 0, 0, 1]
    }
  },
  {
    name: 'A#maj7',
    type: 'major7',
    notes: ['A#', 'D', 'F', 'A'],
    frequencies: [233.08, 293.66, 349.23, 440.00],
    fretPattern: {
      strings: [1, 1, 3, 2, 3, 1],
      fingers: [1, 1, 3, 2, 4, 1]
    }
  },
  {
    name: 'C#maj7',
    type: 'major7',
    notes: ['C#', 'F', 'G#', 'C'],
    frequencies: [277.18, 349.23, 415.30, 523.25],
    fretPattern: {
      strings: [4, 4, 6, 5, 6, 4],
      fingers: [1, 1, 3, 2, 4, 1]
    }
  },
  {
    name: 'D#maj7',
    type: 'major7',
    notes: ['D#', 'G', 'A#', 'D'],
    frequencies: [311.13, 392.00, 466.16, 587.33],
    fretPattern: {
      strings: [-1, -1, 1, 3, 3, 3],
      fingers: [0, 0, 1, 2, 2, 2]
    }
  },
  {
    name: 'F#maj7',
    type: 'major7',
    notes: ['F#', 'A#', 'C#', 'F'],
    frequencies: [369.99, 466.16, 554.37, 698.46],
    fretPattern: {
      strings: [2, 4, 3, 3, 2, 2],
      fingers: [1, 4, 2, 3, 1, 1]
    }
  },
  {
    name: 'G#maj7',
    type: 'major7',
    notes: ['G#', 'C', 'D#', 'G'],
    frequencies: [207.65, 261.63, 311.13, 392.00],
    fretPattern: {
      strings: [4, 3, 1, 1, 1, 3],
      fingers: [3, 2, 1, 1, 1, 4]
    }
  },

  // Minor 7th chords
  {
    name: 'Am7',
    type: 'minor7',
    notes: ['A', 'C', 'E', 'G'],
    frequencies: [220.00, 261.63, 329.63, 392.00],
    fretPattern: {
      strings: [0, 0, 2, 0, 1, 0],
      fingers: [0, 0, 2, 0, 1, 0]
    }
  },
  {
    name: 'Bm7',
    type: 'minor7',
    notes: ['B', 'D', 'F#', 'A'],
    frequencies: [246.94, 293.66, 369.99, 440.00],
    fretPattern: {
      strings: [2, 2, 4, 2, 3, 2],
      fingers: [1, 1, 3, 1, 2, 1]
    }
  },
  {
    name: 'Cm7',
    type: 'minor7',
    notes: ['C', 'D#', 'G', 'A#'],
    frequencies: [261.63, 311.13, 392.00, 466.16],
    fretPattern: {
      strings: [3, 3, 5, 3, 4, 3],
      fingers: [1, 1, 3, 1, 2, 1]
    }
  },
  {
    name: 'Dm7',
    type: 'minor7',
    notes: ['D', 'F', 'A', 'C'],
    frequencies: [293.66, 349.23, 440.00, 523.25],
    fretPattern: {
      strings: [-1, -1, 0, 2, 1, 1],
      fingers: [0, 0, 0, 2, 1, 1]
    }
  },
  {
    name: 'Em7',
    type: 'minor7',
    notes: ['E', 'G', 'B', 'D'],
    frequencies: [164.81, 196.00, 246.94, 293.66],
    fretPattern: {
      strings: [0, 2, 0, 0, 0, 0],
      fingers: [0, 2, 0, 0, 0, 0]
    }
  },
  {
    name: 'Fm7',
    type: 'minor7',
    notes: ['F', 'G#', 'C', 'D#'],
    frequencies: [349.23, 415.30, 523.25, 622.25],
    fretPattern: {
      strings: [1, 3, 1, 1, 1, 1],
      fingers: [1, 3, 1, 1, 1, 1]
    }
  },
  {
    name: 'Gm7',
    type: 'minor7',
    notes: ['G', 'A#', 'D', 'F'],
    frequencies: [196.00, 233.08, 293.66, 349.23],
    fretPattern: {
      strings: [3, 5, 3, 3, 3, 3],
      fingers: [1, 3, 1, 1, 1, 1]
    }
  },
  {
    name: 'A#m7',
    type: 'minor7',
    notes: ['A#', 'C#', 'F', 'G#'],
    frequencies: [233.08, 277.18, 349.23, 415.30],
    fretPattern: {
      strings: [1, 1, 3, 1, 2, 1],
      fingers: [1, 1, 3, 1, 2, 1]
    }
  },
  {
    name: 'C#m7',
    type: 'minor7',
    notes: ['C#', 'E', 'G#', 'B'],
    frequencies: [277.18, 329.63, 415.30, 493.88],
    fretPattern: {
      strings: [4, 4, 6, 4, 5, 4],
      fingers: [1, 1, 3, 1, 2, 1]
    }
  },
  {
    name: 'D#m7',
    type: 'minor7',
    notes: ['D#', 'F#', 'A#', 'C#'],
    frequencies: [311.13, 369.99, 466.16, 554.37],
    fretPattern: {
      strings: [-1, -1, 1, 3, 2, 2],
      fingers: [0, 0, 1, 3, 2, 2]
    }
  },
  {
    name: 'F#m7',
    type: 'minor7',
    notes: ['F#', 'A', 'C#', 'E'],
    frequencies: [369.99, 440.00, 554.37, 659.25],
    fretPattern: {
      strings: [2, 4, 2, 2, 2, 2],
      fingers: [1, 3, 1, 1, 1, 1]
    }
  },
  {
    name: 'G#m7',
    type: 'minor7',
    notes: ['G#', 'B', 'D#', 'F#'],
    frequencies: [207.65, 246.94, 311.13, 369.99],
    fretPattern: {
      strings: [4, 6, 4, 4, 4, 4],
      fingers: [1, 3, 1, 1, 1, 1]
    }
  },

  // Diminished 7th chords
  {
    name: 'Adim7',
    type: 'diminished7',
    notes: ['A', 'C', 'D#', 'F#'],
    frequencies: [220.00, 261.63, 311.13, 369.99],
    fretPattern: {
      strings: [5, 6, 5, 5, 5, 5],
      fingers: [1, 2, 1, 1, 1, 1]
    }
  },
  {
    name: 'Bdim7',
    type: 'diminished7',
    notes: ['B', 'D', 'F', 'G#'],
    frequencies: [246.94, 293.66, 349.23, 415.30],
    fretPattern: {
      strings: [2, 3, 2, 3, 2, 2],
      fingers: [1, 3, 1, 4, 1, 1]
    }
  },
  {
    name: 'Cdim7',
    type: 'diminished7',
    notes: ['C', 'D#', 'F#', 'A'],
    frequencies: [261.63, 311.13, 369.99, 440.00],
    fretPattern: {
      strings: [3, 4, 2, 3, 2, 3],
      fingers: [2, 4, 1, 3, 1, 2]
    }
  },
  {
    name: 'Ddim7',
    type: 'diminished7',
    notes: ['D', 'F', 'G#', 'B'],
    frequencies: [293.66, 349.23, 415.30, 493.88],
    fretPattern: {
      strings: [-1, -1, 0, 1, 0, 1],
      fingers: [0, 0, 0, 2, 0, 1]
    }
  },
  {
    name: 'Edim7',
    type: 'diminished7',
    notes: ['E', 'G', 'A#', 'C#'],
    frequencies: [164.81, 196.00, 233.08, 277.18],
    fretPattern: {
      strings: [0, 1, 2, 0, 2, 0],
      fingers: [0, 1, 3, 0, 4, 0]
    }
  },
  {
    name: 'Fdim7',
    type: 'diminished7',
    notes: ['F', 'G#', 'B', 'D'],
    frequencies: [349.23, 415.30, 493.88, 587.33],
    fretPattern: {
      strings: [1, 2, 0, 1, 0, 1],
      fingers: [2, 4, 0, 3, 0, 1]
    }
  },
  {
    name: 'Gdim7',
    type: 'diminished7',
    notes: ['G', 'A#', 'C#', 'E'],
    frequencies: [196.00, 233.08, 277.18, 329.63],
    fretPattern: {
      strings: [3, 4, 3, 4, 3, 3],
      fingers: [1, 3, 1, 4, 1, 1]
    }
  },
  {
    name: 'A#dim7',
    type: 'diminished7',
    notes: ['A#', 'C#', 'E', 'G'],
    frequencies: [233.08, 277.18, 329.63, 392.00],
    fretPattern: {
      strings: [6, 7, 6, 6, 6, 6],
      fingers: [1, 2, 1, 1, 1, 1]
    }
  },
  {
    name: 'C#dim7',
    type: 'diminished7',
    notes: ['C#', 'E', 'G', 'A#'],
    frequencies: [277.18, 329.63, 392.00, 466.16],
    fretPattern: {
      strings: [4, 5, 3, 4, 3, 4],
      fingers: [2, 4, 1, 3, 1, 2]
    }
  },
  {
    name: 'D#dim7',
    type: 'diminished7',
    notes: ['D#', 'F#', 'A', 'C'],
    frequencies: [311.13, 369.99, 440.00, 523.25],
    fretPattern: {
      strings: [-1, -1, 1, 2, 1, 2],
      fingers: [0, 0, 1, 3, 1, 4]
    }
  },
  {
    name: 'F#dim7',
    type: 'diminished7',
    notes: ['F#', 'A', 'C', 'D#'],
    frequencies: [369.99, 440.00, 523.25, 622.25],
    fretPattern: {
      strings: [2, 3, 1, 2, 1, 2],
      fingers: [3, 4, 1, 2, 1, 3]
    }
  },
  {
    name: 'G#dim7',
    type: 'diminished7',
    notes: ['G#', 'B', 'D', 'F'],
    frequencies: [415.30, 493.88, 587.33, 698.46],
    fretPattern: {
      strings: [4, 5, 4, 5, 4, 4],
      fingers: [1, 3, 1, 4, 1, 1]
    }
  }
];

const INTERVAL_RATIOS = {
  '1:1': { 
    name: 'unison', 
    color: '#2980b9',
    feel: 'identical',
    description: 'Same note - pure unity',
    tension: 0,
    consonance: 100
  },
  '2:1': { 
    name: 'octave', 
    color: '#3498db',
    feel: 'completion',
    description: 'Higher/lower version - feels complete',
    tension: 0,
    consonance: 95
  },
  '3:2': { 
    name: 'perfect fifth', 
    color: '#27ae60',
    feel: 'strong & stable',
    description: 'Rock solid foundation - very consonant',
    tension: 10,
    consonance: 90
  },
  '4:3': { 
    name: 'perfect fourth', 
    color: '#16a085',
    feel: 'open & anticipating',
    description: 'Wants to resolve down - slightly restless',
    tension: 20,
    consonance: 80
  },
  '5:4': { 
    name: 'major third', 
    color: '#f39c12',
    feel: 'bright & happy',
    description: 'Sweet and warm - major chord color',
    tension: 25,
    consonance: 75
  },
  '6:5': { 
    name: 'minor third', 
    color: '#e67e22',
    feel: 'sad & introspective',
    description: 'Melancholy warmth - minor chord color',
    tension: 30,
    consonance: 70
  },
  '9:8': { 
    name: 'major second', 
    color: '#f1c40f',
    feel: 'bright tension',
    description: 'Wants to move up or down - active',
    tension: 70,
    consonance: 40
  },
  '16:15': { 
    name: 'minor second', 
    color: '#e74c3c',
    feel: 'sharp dissonance',
    description: 'Very tense - demands resolution',
    tension: 90,
    consonance: 20
  },
  '45:32': { 
    name: 'tritone', 
    color: '#9b59b6',
    feel: 'unstable & mysterious',
    description: 'The "devil\'s interval" - maximum tension',
    tension: 100,
    consonance: 10
  },
  '8:5': {
    name: 'minor sixth',
    color: '#34495e',
    feel: 'yearning & longing',
    description: 'Bittersweet - wants to expand outward',
    tension: 40,
    consonance: 60
  },
  '5:3': {
    name: 'major sixth',
    color: '#7f8c8d',
    feel: 'expansive & hopeful',
    description: 'Open and reaching - gentle tension',
    tension: 35,
    consonance: 65
  }
};

function calculateIntervalRatio(freq1, freq2) {
  const ratio = freq2 / freq1;
  let closestRatio = null;
  let minDiff = Infinity;
  
  for (const [ratioStr, info] of Object.entries(INTERVAL_RATIOS)) {
    const [num, denom] = ratioStr.split(':').map(Number);
    const ratioValue = num / denom;
    const diff = Math.abs(ratio - ratioValue);
    
    if (diff < minDiff && diff < 0.1) {
      minDiff = diff;
      closestRatio = { ratio: ratioStr, ...info };
    }
  }
  
  return closestRatio;
}