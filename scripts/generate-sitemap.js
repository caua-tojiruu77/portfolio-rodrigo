const fs = require('fs');
const path = require('path');

const OUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');
const GALLERY_CONFIG = path.join(__dirname, '..', 'utils', 'galleryConfig.ts');
const BASE_URL = 'https://meu-portfolio-v1-chi.vercel.app';

function extractGalleryKeys(fileContent) {
  const start = fileContent.indexOf('export const galleryLibraries');
  if (start === -1) return [];
  const braceStart = fileContent.indexOf('{', start);
  if (braceStart === -1) return [];

  // naive parse: find top-level keys until matching closing brace
  let i = braceStart + 1;
  let depth = 1;
  let keys = [];
  let buffer = '';
  let inKey = true;

  while (i < fileContent.length && depth > 0) {
    const ch = fileContent[i];

    if (inKey) {
      // skip whitespace
      if (/\s/.test(ch)) { i++; continue; }
      // read key until ':'
      let key = '';
      while (i < fileContent.length && /[a-zA-Z0-9_\-]/.test(fileContent[i])) {
        key += fileContent[i]; i++;
      }
      // if we found a key followed by ':' then record
      const rest = fileContent.slice(i, i+2);
      if (key && fileContent.slice(i).trimStart().startsWith(':')) {
        keys.push(key);
        inKey = false;
      } else {
        // if not, advance
        i++;
      }
    } else {
      // skip until next top-level key or closing brace for the object
      if (fileContent[i] === '{') {
        depth++;
      } else if (fileContent[i] === '}') {
        depth--;
        if (depth === 1) {
          inKey = true; // expect another key
        }
      }
      i++;
    }
  }

  return keys;
}

function buildSitemap(categories) {
  const urls = [
    '/',
    '/about',
    '/academicFormation',
    '/danceExperience',
    '/experience',
    '/gallery',
  ];

  categories.forEach((c) => {
    urls.push(`/gallery/${c}`);
  });

  const lastmod = new Date().toISOString().split('T')[0];

  const urlset = urls
    .map((u) => `  <url>\n    <loc>${BASE_URL}${u}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>`;
  return xml;
}

function main() {
  let content;
  try {
    content = fs.readFileSync(GALLERY_CONFIG, 'utf8');
  } catch (err) {
    console.error('Could not read gallery config:', err);
    process.exit(1);
  }

  const categories = extractGalleryKeys(content);
  if (!categories.length) {
    console.warn('No gallery categories found, generating sitemap with static routes only.');
  }

  const xml = buildSitemap(categories);

  try {
    fs.writeFileSync(OUT_PATH, xml, 'utf8');
    console.log('Sitemap generated at', OUT_PATH);
  } catch (err) {
    console.error('Could not write sitemap:', err);
    process.exit(1);
  }
}

main();
