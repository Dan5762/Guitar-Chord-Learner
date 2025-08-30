const fs = require('fs');
const path = require('path');

// Import chord data
const chordDataPath = path.join(__dirname, 'app', 'chordData.js');
const chordDataContent = fs.readFileSync(chordDataPath, 'utf8');
// Remove const declaration and eval to make CHORD_LIBRARY global
const chordDataCode = chordDataContent.replace('const CHORD_LIBRARY', 'global.CHORD_LIBRARY');
eval(chordDataCode);
const CHORD_LIBRARY = global.CHORD_LIBRARY;

// Common progressions data
const PROGRESSIONS = [
  {
    name: 'ii-V-I',
    slug: 'ii-v-i',
    description: 'The most important jazz progression',
    chords: ['Dm', 'G', 'Cmaj'],
    theory: 'A ii-V-I progression in C major. Creates strong harmonic motion through the circle of fifths.',
    examples: ['Autumn Leaves', 'All The Things You Are', 'Giant Steps'],
    keys: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db']
  },
  {
    name: 'vi-IV-I-V',
    slug: 'vi-iv-i-v',
    description: 'The pop progression that conquered the world',
    chords: ['Am', 'F', 'C', 'G'],
    theory: 'Also known as the "axis progression." Creates emotional tension and resolution.',
    examples: ['Let It Be', 'Don\'t Stop Believin\'', 'With or Without You'],
    keys: ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'Bb', 'Eb', 'Ab']
  },
  {
    name: 'I-V-vi-IV',
    slug: 'i-v-vi-iv',
    description: 'The eternal pop progression',
    chords: ['C', 'G', 'Am', 'F'],
    theory: 'Creates a sense of journey and return. The vi chord adds emotional depth.',
    examples: ['Someone Like You', 'Let It Go', 'Poker Face'],
    keys: ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'Bb', 'Eb', 'Ab']
  },
  {
    name: 'I-vi-IV-V',
    slug: 'i-vi-iv-v',
    description: 'Classic 50s doo-wop progression',
    chords: ['C', 'Am', 'F', 'G'],
    theory: 'The foundation of early rock and roll. Simple but effective harmonic movement.',
    examples: ['Stand By Me', 'Blue Moon', 'Heart and Soul'],
    keys: ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'Bb', 'Eb', 'Ab']
  }
];

// Utility functions
function slugify(str) {
  return str.toLowerCase()
    .replace(/[#♯]/g, '-sharp')
    .replace(/[♭b]/g, '-flat')
    .replace(/maj7?/g, '-major')
    .replace(/min7?/g, '-minor')
    .replace(/dim7?/g, '-diminished')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateChordPage(chord) {
  const slug = slugify(chord.name);
  const displayName = chord.name.replace(/maj/, ' Major').replace(/min/, ' Minor').replace(/dim/, ' Diminished');
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${displayName} Guitar Chord | Learn Chords</title>
    <meta name="description" content="Learn the ${displayName} guitar chord with interactive fretboard diagram, music theory, and common progressions. Perfect for guitarists at any level.">
    <meta name="keywords" content="${displayName} guitar chord, ${chord.notes.join(' ')}, guitar fretboard, music theory, chord progressions">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${displayName} Guitar Chord">
    <meta property="og:description" content="Interactive ${displayName} chord with fretboard diagram and theory explanation">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://learn-chords.com/chords/${slug}/">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MusicComposition",
      "name": "${displayName} Guitar Chord",
      "description": "Guitar chord diagram and theory for ${displayName}",
      "musicalKey": "${chord.notes[0]}",
      "genre": "Guitar Instruction",
      "composer": {
        "@type": "Organization",
        "name": "Learn Chords"
      }
    }
    </script>
    
    <link rel="stylesheet" href="../../styles.css">
    <link rel="canonical" href="https://learn-chords.com/chords/${slug}/">
</head>
<body>
    <nav class="breadcrumb">
        <a href="../../">Learn Chords</a> > 
        <a href="../../chord-types/${chord.type}/">${chord.type.charAt(0).toUpperCase() + chord.type.slice(1)} Chords</a> > 
        <span>${displayName}</span>
    </nav>
    
    <main class="chord-page">
        <header class="chord-header">
            <h1>${displayName} Guitar Chord</h1>
            <p class="chord-notes">Notes: ${chord.notes.join(' • ')}</p>
        </header>
        
        <section class="chord-diagram-section">
            <div class="fretboard-container" id="chord-fretboard"></div>
            <a href="../../app/index.html?chord=${encodeURIComponent(chord.name)}" class="app-link">Practice in Interactive App</a>
        </section>
        
        <section class="chord-theory">
            <h2>Music Theory</h2>
            <p class="theory-explanation">
                The ${displayName} chord is built from the ${chord.notes.join(', ')} notes, 
                ${chord.type === 'major' ? 'creating a bright, stable sound.' : 
                  chord.type === 'minor' ? 'creating a darker, more emotional sound.' : 
                  'creating a tense, unstable sound that seeks resolution.'}
            </p>
        </section>
        
        <section class="related-progressions">
            <h2>Common Progressions</h2>
            <div class="progression-links">
                ${getRelatedProgressions(chord.name).map(prog => 
                    `<a href="../progressions/${prog.slug}/" class="progression-card">
                        <h3>${prog.name}</h3>
                        <p>${prog.chords.join(' → ')}</p>
                    </a>`
                ).join('')}
            </div>
        </section>
    </main>
    
    <script src="../app/fretboard.js"></script>
    <script>
        // Initialize fretboard with chord data
        const chordData = ${JSON.stringify(chord)};
        const fretboard = new Fretboard('chord-fretboard');
        fretboard.render(chordData);
    </script>
</body>
</html>`;
  
  return { slug, html };
}

function generateProgressionPage(progression) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${progression.name} Chord Progression | Learn Chords</title>
    <meta name="description" content="Learn the ${progression.name} chord progression: ${progression.description}. Includes theory, examples, and interactive practice.">
    <meta name="keywords" content="${progression.name} progression, ${progression.chords.join(' ')}, music theory, chord progressions, guitar">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${progression.name} Chord Progression">
    <meta property="og:description" content="${progression.description}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://learn-chords.com/progressions/${progression.slug}/">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MusicComposition",
      "name": "${progression.name} Chord Progression",
      "description": "${progression.description}",
      "genre": "Music Theory",
      "composer": {
        "@type": "Organization",
        "name": "Learn Chords"
      },
      "musicalKey": "C Major"
    }
    </script>
    
    <link rel="stylesheet" href="../../styles.css">
    <link rel="canonical" href="https://learn-chords.com/progressions/${progression.slug}/">
</head>
<body>
    <nav class="breadcrumb">
        <a href="../../">Learn Chords</a> > 
        <a href="../../progressions/">Progressions</a> > 
        <span>${progression.name}</span>
    </nav>
    
    <main class="progression-page">
        <header class="progression-header">
            <h1>${progression.name} Chord Progression</h1>
            <p class="progression-chords">${progression.chords.join(' → ')}</p>
        </header>
        
        <section class="progression-theory">
            <h2>Theory Explanation</h2>
            <p>${progression.theory}</p>
        </section>
        
        <section class="chord-breakdown">
            <h2>Chord Breakdown</h2>
            <div class="chord-list">
                ${progression.chords.map(chordName => {
                  const chord = CHORD_LIBRARY.find(c => c.name === chordName);
                  if (!chord) return `<div class="chord-item">${chordName}</div>`;
                  const chordSlug = slugify(chordName);
                  return `<a href="../../chords/${chordSlug}/" class="chord-item">
                    <h3>${chordName}</h3>
                    <p>${chord.notes.join(' • ')}</p>
                  </a>`;
                }).join('')}
            </div>
        </section>
        
        <section class="song-examples">
            <h2>Famous Songs</h2>
            <ul class="song-list">
                ${progression.examples.map(song => `<li>${song}</li>`).join('')}
            </ul>
        </section>
        
        <section class="practice-section">
            <a href="../../app/index.html?progression=${encodeURIComponent(progression.name)}" class="app-link large">
                Practice This Progression
            </a>
        </section>
    </main>
</body>
</html>`;
  
  return { slug: progression.slug, html };
}

function getRelatedProgressions(chordName) {
  return PROGRESSIONS.filter(prog => 
    prog.chords.some(chord => chord === chordName)
  ).slice(0, 3);
}

function generateCategoryPage(type) {
  const chords = CHORD_LIBRARY.filter(chord => chord.type === type);
  const typeName = type.charAt(0).toUpperCase() + type.slice(1);
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${typeName} Guitar Chords | Learn Chords</title>
    <meta name="description" content="Complete collection of ${typeName.toLowerCase()} guitar chords with diagrams, theory, and practice tools. Learn all ${typeName.toLowerCase()} chords in every key.">
    <meta name="keywords" content="${typeName.toLowerCase()} guitar chords, ${typeName.toLowerCase()} chord chart, guitar ${typeName.toLowerCase()}, music theory">
    
    <link rel="stylesheet" href="../../styles.css">
    <link rel="canonical" href="https://learn-chords.com/chord-types/${type}/">
</head>
<body>
    <nav class="breadcrumb">
        <a href="../">Learn Chords</a> > 
        <a href="../chord-types/">Chord Types</a> > 
        <span>${typeName} Chords</span>
    </nav>
    
    <main class="category-page">
        <header class="category-header">
            <h1>${typeName} Guitar Chords</h1>
            <p>Complete collection of ${typeName.toLowerCase()} chords with interactive diagrams and theory.</p>
        </header>
        
        <section class="chord-grid">
            ${chords.map(chord => {
              const slug = slugify(chord.name);
              const displayName = chord.name.replace(/maj/, ' Major').replace(/min/, ' Minor').replace(/dim/, ' Diminished');
              return `<a href="../chords/${slug}/" class="chord-card">
                <h3>${displayName}</h3>
                <p>${chord.notes.join(' • ')}</p>
              </a>`;
            }).join('')}
        </section>
        
        <section class="practice-section">
            <a href="../../app/index.html?type=${type}" class="app-link large">
                Practice ${typeName} Chords
            </a>
        </section>
    </main>
</body>
</html>`;
  
  return { type, html };
}

// Generate all pages
console.log('Generating content pages...');

// Create chord pages
CHORD_LIBRARY.forEach(chord => {
  const { slug, html } = generateChordPage(chord);
  const dir = path.join(__dirname, 'chords', slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`Created: chords/${slug}/index.html`);
});

// Create progression pages
PROGRESSIONS.forEach(progression => {
  const { slug, html } = generateProgressionPage(progression);
  const dir = path.join(__dirname, 'progressions', slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`Created: progressions/${slug}/index.html`);
});

// Create category pages
const chordTypes = [...new Set(CHORD_LIBRARY.map(chord => chord.type))];
chordTypes.forEach(type => {
  const { html } = generateCategoryPage(type);
  const dir = path.join(__dirname, 'chord-types', type);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`Created: chord-types/${type}/index.html`);
});

// Create index pages
const progressionsIndex = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guitar Chord Progressions | Learn Chords</title>
    <meta name="description" content="Complete guide to guitar chord progressions. Learn ii-V-I, vi-IV-I-V, and other essential progressions with theory and examples.">
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <nav class="breadcrumb">
        <a href="../">Learn Chords</a> > <span>Progressions</span>
    </nav>
    
    <main class="index-page">
        <header>
            <h1>Guitar Chord Progressions</h1>
            <p>Essential progressions every guitarist should know</p>
        </header>
        
        <section class="progression-grid">
            ${PROGRESSIONS.map(prog => 
              `<a href="${prog.slug}/" class="progression-card">
                <h3>${prog.name}</h3>
                <p class="progression-chords">${prog.chords.join(' → ')}</p>
                <p>${prog.description}</p>
              </a>`
            ).join('')}
        </section>
    </main>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'progressions', 'index.html'), progressionsIndex);

const chordTypesIndex = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guitar Chord Types | Learn Chords</title>
    <meta name="description" content="Explore different types of guitar chords: major, minor, diminished, and more. Complete chord charts and theory explanations.">
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <nav class="breadcrumb">
        <a href="../">Learn Chords</a> > <span>Chord Types</span>
    </nav>
    
    <main class="index-page">
        <header>
            <h1>Guitar Chord Types</h1>
            <p>Understanding different chord qualities and their sounds</p>
        </header>
        
        <section class="type-grid">
            ${chordTypes.map(type => {
              const typeName = type.charAt(0).toUpperCase() + type.slice(1);
              const count = CHORD_LIBRARY.filter(c => c.type === type).length;
              return `<a href="${type}/" class="type-card">
                <h3>${typeName} Chords</h3>
                <p>${count} chords available</p>
              </a>`;
            }).join('')}
        </section>
    </main>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'chord-types', 'index.html'), chordTypesIndex);

console.log('Content generation complete!');
console.log(`Generated ${CHORD_LIBRARY.length} chord pages`);
console.log(`Generated ${PROGRESSIONS.length} progression pages`);
console.log(`Generated ${chordTypes.length} category pages`);