const fs = require('fs');
const path = require('path');

// Import chord data
const chordDataPath = path.join(__dirname, 'app', 'chordData.js');
const chordDataContent = fs.readFileSync(chordDataPath, 'utf8');
const chordDataCode = chordDataContent.replace('const CHORD_LIBRARY', 'global.CHORD_LIBRARY');
eval(chordDataCode);
const CHORD_LIBRARY = global.CHORD_LIBRARY;

// Progressions data
const PROGRESSIONS = [
  { slug: 'ii-v-i' },
  { slug: 'vi-iv-i-v' },
  { slug: 'i-v-vi-iv' },
  { slug: 'i-vi-iv-v' }
];

// Articles data
const ARTICLES = [
  { slug: 'circle-of-fifths-explained' },
  { slug: 'understanding-ii-v-i' },
  { slug: 'common-pop-progressions' },
  { slug: 'borrowed-chords-modal-interchange' },
  { slug: 'jazz-chord-substitutions' }
];

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

const baseUrl = 'https://learn-chords.com';
const today = new Date().toISOString().split('T')[0];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Homepage -->
    <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
    
    <!-- App -->
    <url>
        <loc>${baseUrl}/app/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    
    <!-- Learning Hub -->
    <url>
        <loc>${baseUrl}/learn/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <!-- Main Category Pages -->
    <url>
        <loc>${baseUrl}/chords/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <url>
        <loc>${baseUrl}/progressions/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <url>
        <loc>${baseUrl}/chord-types/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <!-- Chord Type Categories -->
    <url>
        <loc>${baseUrl}/chord-types/major/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <url>
        <loc>${baseUrl}/chord-types/minor/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <url>
        <loc>${baseUrl}/chord-types/major7/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <url>
        <loc>${baseUrl}/chord-types/minor7/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <url>
        <loc>${baseUrl}/chord-types/diminished7/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <!-- Articles -->
`;

// Add all articles
ARTICLES.forEach(article => {
    sitemap += `    <url>
        <loc>${baseUrl}/learn/articles/${article.slug}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
`;
});

// Add all chord pages
CHORD_LIBRARY.forEach(chord => {
    const slug = slugify(chord.name);
    sitemap += `    <url>
        <loc>${baseUrl}/chords/${slug}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    
`;
});

// Add all progression pages
PROGRESSIONS.forEach(progression => {
    sitemap += `    <url>
        <loc>${baseUrl}/progressions/${progression.slug}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
`;
});

sitemap += `</urlset>`;

// Write sitemap
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);

console.log('Sitemap generated successfully!');
console.log(`Added ${5 + CHORD_LIBRARY.length + PROGRESSIONS.length + ARTICLES.length + 7} URLs to sitemap`);