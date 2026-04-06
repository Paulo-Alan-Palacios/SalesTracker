#!/usr/bin/env node
/**
 * One-time setup script for local development.
 * Run via: npm run setup (from the repo root)
 *
 * What it does:
 *  1. Installs root deps (concurrently, needed for `npm run dev`)
 *  2. Creates backend/.env from .env.example if missing — auto-generates JWT_SECRET
 *  3. Creates frontend/.env from .env.example if missing — points to localhost:3000
 *  4. Installs backend and frontend dependencies
 *  5. Seeds the SQLite database with the demo user
 */

const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

const root     = path.join(__dirname, '..');
const backend  = path.join(root, 'backend');
const frontend = path.join(root, 'frontend');

function run(cmd, cwd = root) {
  const label = path.relative(root, cwd) || '.';
  console.log(`\n▶  ${cmd}  [${label}]`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function ensureEnv(dir, replacements) {
  const dest    = path.join(dir, '.env');
  const example = path.join(dir, '.env.example');

  if (fs.existsSync(dest)) {
    console.log(`⏭   ${path.relative(root, dest)} already exists — skipping`);
    return;
  }

  let content = fs.readFileSync(example, 'utf8');
  for (const [from, to] of replacements) {
    content = content.replace(from, to);
  }
  fs.writeFileSync(dest, content);
  console.log(`✅  ${path.relative(root, dest)} created`);
}

console.log('\n🚀  SalesTracker — local setup\n' + '─'.repeat(40));

// 1. Root install (gets `concurrently` for `npm run dev`)
run('npm install');

// 2. backend/.env
ensureEnv(backend, [
  ['your_strong_secret_here_minimum_32_chars', crypto.randomBytes(32).toString('hex')],
]);

// 3. frontend/.env
ensureEnv(frontend, [
  ['https://your-backend.onrender.com', 'http://localhost:3000'],
]);

// 4. Install workspace deps
run('npm install', backend);
run('npm install', frontend);

// 5. Seed the database
run('npm run seed', backend);

console.log('\n' + '─'.repeat(40));
console.log('✅  Setup complete!');
console.log('👉  Run  npm run dev  to start backend + frontend.\n');
