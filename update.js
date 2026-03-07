const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoUrl = 'https://github.com/Wolf2000Pi/monitor.git';
const repoPath = __dirname;

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: repoPath }, (err, stdout, stderr) => {
      if (err) reject(err);
      else resolve(stdout + stderr);
    });
  });
}

async function update() {
  console.log('🔄 Checking for updates...');
  
  try {
    await run('git fetch origin');
    const result = await run('git rev-parse HEAD');
    const currentCommit = result.trim();
    
    const remote = await run('git rev-parse origin/main');
    const remoteCommit = remote.trim();
    
    if (currentCommit !== remoteCommit) {
      console.log('⬇️  Pulling changes...');
      await run('git pull origin main');
      console.log('✅ Updated! Restart the server.');
      process.exit(0);
    } else {
      console.log('✅ Already up to date.');
      process.exit(0);
    }
  } catch (e) {
    console.error('❌ Update failed:', e.message);
    process.exit(1);
  }
}

if (require.main === module) {
  update();
}

module.exports = { update };
