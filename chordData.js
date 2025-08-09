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
  }
];

const INTERVAL_RATIOS = {
  '1:1': { name: 'unison', color: '#0066ff' },
  '2:1': { name: 'octave', color: '#0066ff' },
  '3:2': { name: 'perfect fifth', color: '#0099ff' },
  '4:3': { name: 'perfect fourth', color: '#00ccff' },
  '5:4': { name: 'major third', color: '#00ff99' },
  '6:5': { name: 'minor third', color: '#66ff66' },
  '9:8': { name: 'major second', color: '#ffff66' },
  '16:15': { name: 'minor second', color: '#ff9966' },
  '45:32': { name: 'tritone', color: '#ff3333' }
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