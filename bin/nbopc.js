#!/usr/bin/env node

const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const pkgRoot = path.resolve(__dirname, '..');

// Find claude cli.js
const candidates = [
  path.resolve(pkgRoot, 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
  path.resolve(pkgRoot, '..', '@anthropic-ai', 'claude-code', 'cli.js'),
];

let claudeCli = null;
for (const p of candidates) {
  if (fs.existsSync(p)) {
    claudeCli = p;
    break;
  }
}

if (!claudeCli) {
  console.error('Error: Could not find CLI engine. Try reinstalling: npm install -g github:lil-prince-lil/NBOPC-CLI');
  process.exit(1);
}

// Apply branding patch on first run
const patchMarker = claudeCli + '.nbopc-patched';
if (!fs.existsSync(patchMarker)) {
  try {
    let code = fs.readFileSync(claudeCli, 'utf8');
    const original = code;

    // ── 1. Border titles: "Claude Code" → "NBOPC" ──
    code = code.replace(
      /(\$\{(\w+)\("claude",\w+\)\()"Claude Code"(\)\})/g,
      '$1"NBOPC"$3'
    );
    code = code.replace(
      /(\w+\("claude",\w+\)\()" Claude Code "(\))/g,
      '$1" NBOPC "$2'
    );

    // ── 2. CondensedLogo: rainbow NBOPC ──
    code = code.replace(
      /createElement\((\w+),\{bold:\s*!0\},"Claude Code"\)/g,
      'createElement($1,{bold:!0},createElement($1,{color:"#2857A4"},"N"),createElement($1,{color:"#1EAF8E"},"B"),createElement($1,{color:"#FFFFFF"},"O"),createElement($1,{color:"#2857A4"},"P"),createElement($1,{color:"#1EAF8E"},"C"))'
    );

    // ── 3. Replace "Welcome back" greeting ──
    code = code.replace(
      /return`Welcome back \$\{q\}!`/g,
      'return"\\u2728 NBOPC CLI \\u2728"'
    );
    code = code.replace(
      /return"Welcome back!"/g,
      'return"\\u2728 NBOPC CLI \\u2728"'
    );

    // ── 4. Force single-column layout (never use horizontal/split) ──
    code = code.replace(
      /function tkK\(q\)\{if\(q>=70\)return"horizontal";return"compact"\}/,
      'function tkK(q){return"compact"}'
    );

    // ── 5. Replace the entire Clawd mascot component (oR6) with rainbow ASCII art ──
    code = code.replace(
      /function oR6\(q\)\{let K=Y6\(26\)[\s\S]*?return P\}/,
      'function oR6(q){' +
        'return WY.createElement(m,{flexDirection:"column"},' +
          'WY.createElement(m,{flexDirection:"row"},' +
            'WY.createElement(v,{color:"#2857A4"},"\\u2588\\u2588\\u2588\\u2557   \\u2588\\u2588\\u2557"),' +
            'WY.createElement(v,{color:"#1EAF8E"},"\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2557 "),' +
            'WY.createElement(v,{color:"#FFFFFF"}," \\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2557 "),' +
            'WY.createElement(v,{color:"#2857A4"},"\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2557 "),' +
            'WY.createElement(v,{color:"#1EAF8E"}," \\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2557")),' +
          'WY.createElement(m,{flexDirection:"row"},' +
            'WY.createElement(v,{color:"#2857A4"},"\\u2588\\u2588\\u2588\\u2588\\u2557  \\u2588\\u2588\\u2551"),' +
            'WY.createElement(v,{color:"#1EAF8E"},"\\u2588\\u2588\\u2554\\u2550\\u2550\\u2588\\u2588\\u2557"),' +
            'WY.createElement(v,{color:"#FFFFFF"},"\\u2588\\u2588\\u2554\\u2550\\u2550\\u2550\\u2588\\u2588\\u2557"),' +
            'WY.createElement(v,{color:"#2857A4"},"\\u2588\\u2588\\u2554\\u2550\\u2550\\u2588\\u2588\\u2557"),' +
            'WY.createElement(v,{color:"#1EAF8E"},"\\u2588\\u2588\\u2554\\u2550\\u2550\\u2550\\u2550\\u255D")),' +
          'WY.createElement(m,{flexDirection:"row"},' +
            'WY.createElement(v,{color:"#2857A4"},"\\u2588\\u2588\\u2554\\u2588\\u2588\\u2557 \\u2588\\u2588\\u2551"),' +
            'WY.createElement(v,{color:"#1EAF8E"},"\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2554\\u255D"),' +
            'WY.createElement(v,{color:"#FFFFFF"},"\\u2588\\u2588\\u2551   \\u2588\\u2588\\u2551"),' +
            'WY.createElement(v,{color:"#2857A4"},"\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2554\\u255D"),' +
            'WY.createElement(v,{color:"#1EAF8E"},"\\u2588\\u2588\\u2551     ")),' +
          'WY.createElement(m,{flexDirection:"row"},' +
            'WY.createElement(v,{color:"#2857A4"},"\\u2588\\u2588\\u2551\\u255A\\u2588\\u2588\\u2557\\u2588\\u2588\\u2551"),' +
            'WY.createElement(v,{color:"#1EAF8E"},"\\u2588\\u2588\\u2554\\u2550\\u2550\\u2588\\u2588\\u2557"),' +
            'WY.createElement(v,{color:"#FFFFFF"},"\\u2588\\u2588\\u2551   \\u2588\\u2588\\u2551"),' +
            'WY.createElement(v,{color:"#2857A4"},"\\u2588\\u2588\\u2554\\u2550\\u2550\\u2550\\u255D "),' +
            'WY.createElement(v,{color:"#1EAF8E"},"\\u2588\\u2588\\u2551     ")),' +
          'WY.createElement(m,{flexDirection:"row"},' +
            'WY.createElement(v,{color:"#2857A4"},"\\u2588\\u2588\\u2551 \\u255A\\u2588\\u2588\\u2588\\u2588\\u2551"),' +
            'WY.createElement(v,{color:"#1EAF8E"},"\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2554\\u255D"),' +
            'WY.createElement(v,{color:"#FFFFFF"},"\\u255A\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2554\\u255D"),' +
            'WY.createElement(v,{color:"#2857A4"},"\\u2588\\u2588\\u2551     "),' +
            'WY.createElement(v,{color:"#1EAF8E"},"\\u255A\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2557")),' +
          'WY.createElement(m,{flexDirection:"row"},' +
            'WY.createElement(v,{color:"#2857A4"},"\\u255A\\u2550\\u255D  \\u255A\\u2550\\u2550\\u2550\\u255D"),' +
            'WY.createElement(v,{color:"#1EAF8E"},"\\u255A\\u2550\\u2550\\u2550\\u2550\\u2550\\u255D "),' +
            'WY.createElement(v,{color:"#FFFFFF"}," \\u255A\\u2550\\u2550\\u2550\\u2550\\u2550\\u255D "),' +
            'WY.createElement(v,{color:"#2857A4"},"\\u255A\\u2550\\u255D     "),' +
            'WY.createElement(v,{color:"#1EAF8E"}," \\u255A\\u2550\\u2550\\u2550\\u2550\\u2550\\u255D")))'  +
        '}'
    );

    // ── 6. System prompt identity ──
    code = code.replace(
      /You are Claude Code, Anthropic's official CLI for Claude\./g,
      'You are NBOPC CLI, an AI-powered coding assistant.'
    );

    code = code.replace(
      /"Anthropic's official CLI for Claude"/g,
      '"AI Community \\u00b7 Empowered by AI"'
    );

    if (code !== original) {
      fs.writeFileSync(claudeCli, code, 'utf8');
      fs.writeFileSync(patchMarker, Date.now().toString(), 'utf8');
    }
  } catch (e) {
    // Patch failed, continue anyway
  }
}

try {
  execFileSync(process.execPath, [claudeCli, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: process.env
  });
} catch (e) {
  process.exitCode = e.status || 1;
}
