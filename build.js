const { execSync } = require('child_process');
const path = require('path');

// Change to the package directory
process.chdir(__dirname);

try {
  // Run the deno task
  execSync('deno task dnt:crystals-kyber-js', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}