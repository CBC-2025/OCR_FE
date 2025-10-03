const fs = require('fs');
const path = require('path');

function copyWorker() {
  try {
    const buildDir = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build');
    const destDir = path.join(__dirname, '..', 'public');
    const dest = path.join(destDir, 'pdf.worker.min.js');

    if (!fs.existsSync(buildDir)) {
      console.error('pdfjs-dist build folder not found. Did you install pdfjs-dist?');
      process.exit(0);
    }

    // Look for common worker filenames (.js, .mjs)
    const candidates = [
      'pdf.worker.min.js',
      'pdf.worker.js',
      'pdf.worker.min.mjs',
      'pdf.worker.mjs'
    ];

    let found = null;
    for (const c of candidates) {
      const p = path.join(buildDir, c);
      if (fs.existsSync(p)) {
        found = p;
        break;
      }
    }

    if (!found) {
      // fallback: try to glob for any pdf.worker* file
      const files = fs.readdirSync(buildDir);
      const any = files.find(f => f.startsWith('pdf.worker'));
      if (any) found = path.join(buildDir, any);
    }

    if (!found) {
      console.error('No pdf.worker file found in pdfjs-dist build folder.');
      process.exit(0);
    }

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Copy and rename to pdf.worker.min.js so app can reference a stable path
    fs.copyFileSync(found, dest);
    console.log('Copied', path.basename(found), 'to public/pdf.worker.min.js');
  } catch (err) {
    console.error('Failed to copy pdf.worker.min.js', err);
  }
}

copyWorker();
