#!/usr/bin/env node

/**
 * NBOPC CLI - Post-install branding patch
 */

const fs = require('fs');
const path = require('path');

// Try multiple possible locations for cli.js
const candidates = [
  path.resolve(__dirname, 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
  path.resolve(__dirname, '..', '@anthropic-ai', 'claude-code', 'cli.js'),
  path.resolve(__dirname, '..', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
];

let CLI_PATH = null;
for (const p of candidates) {
  if (fs.existsSync(p)) {
    CLI_PATH = p;
    break;
  }
}

if (!CLI_PATH) {
  console.log('[nbopc] cli.js not found yet - branding will apply on first run.');
  // Write a marker so bin script can patch on first run
  fs.writeFileSync(path.resolve(__dirname, '.needs-patch'), '', 'utf8');
  process.exit(0);
}

applyPatch(CLI_PATH);

function applyPatch(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  const original = code;

  // ── 1. Border titles: "Claude Code" → "NBOPC" ──
  code = code.replace(
    /(\$\{(\w+)\("claude",\w+\)\()"Claude Code"(\)\})/g,
    '$1"NBOPC"$3'
  );

  // Compact border title
  code = code.replace(
    /(\w+\("claude",\w+\)\()" Claude Code "(\))/g,
    '$1" NBOPC "$2'
  );

  // ── 2. CondensedLogo: bold "Claude Code" → rainbow NBOPC ──
  code = code.replace(
    /createElement\((\w+),\{bold:\s*!0\},"Claude Code"\)/g,
    'createElement($1,{bold:!0},createElement($1,{color:"#2857A4"},"N"),createElement($1,{color:"#1EAF8E"},"B"),createElement($1,{color:"#FFFFFF"},"O"),createElement($1,{color:"#2857A4"},"P"),createElement($1,{color:"#1EAF8E"},"C"))'
  );

  // ── 3. System prompt identity ──
  code = code.replace(
    /You are Claude Code, Anthropic's official CLI for Claude\./g,
    'You are NBOPC CLI, an AI-powered coding assistant.'
  );

  // ── 4. Tagline ──
  code = code.replace(
    /"Anthropic's official CLI for Claude"/g,
    '"AI Community \\u00b7 Empowered by AI"'
  );

  if (code !== original) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('[nbopc] Branding applied successfully.');
    return true;
  } else {
    console.log('[nbopc] No patches needed.');
    return false;
  }
}
