/**
 * Patches @tiptap/pm package.json to add a missing "." exports entry.
 * Without this, Vite dev server cannot resolve the bare "@tiptap/pm" import.
 * This runs automatically after `npm install` via the "postinstall" script.
 */
const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'node_modules', '@tiptap', 'pm', 'package.json');

try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    if (pkg.exports && !pkg.exports['.']) {
        // Add a root "." entry that re-exports from state (the most common entry point)
        pkg.exports['.'] = {
            types: { import: './dist/state/index.d.ts', require: './dist/state/index.d.cts' },
            import: './dist/state/index.js',
            require: './dist/state/index.cjs',
        };
        // Also add a "main" field fallback
        if (!pkg.main) pkg.main = './dist/state/index.cjs';
        if (!pkg.module) pkg.module = './dist/state/index.js';

        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        console.log('✅ Patched @tiptap/pm package.json — added "." exports entry');
    } else {
        console.log('ℹ️  @tiptap/pm already has "." exports entry, skipping patch');
    }
} catch (err) {
    console.warn('⚠️  Could not patch @tiptap/pm:', err.message);
}
