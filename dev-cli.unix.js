// Unix (macOS/Linux)-specific CLI for PJSUA2-Desktop
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = process.cwd();
const isWin = false;

function run(cmd, opts) {
  opts = opts || {};
  try {
    execSync(cmd, { stdio: 'inherit', cwd: opts.cwd ? opts.cwd : root, shell: true });
  } catch (e) {
    console.error(`\n[ERROR] Command failed: ${cmd}\n`);
    process.exit(1);
  }
}

function getBashCmd(scriptPath) {
  return `bash ${scriptPath}`;
}

function syncPjsipBuild() {
  const pjsipDir = path.join(root, 'pjsip');
  const buildDir = path.join(root, 'sip-core-cpp', 'pjsip_build');
  const libDir = path.join(buildDir, 'lib');
  const includeDir = path.join(buildDir, 'include');
  if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);
  if (!fs.existsSync(libDir)) fs.mkdirSync(libDir);
  if (!fs.existsSync(includeDir)) fs.mkdirSync(includeDir);
  const libSrcDirs = [path.join(pjsipDir, 'lib')];
  const subprojects = ['pjlib', 'pjlib-util', 'pjmedia', 'pjnath', 'pjsip', 'third_party'];
  for (const sub of subprojects) {
    const subLib = path.join(pjsipDir, sub, 'lib');
    if (fs.existsSync(subLib)) libSrcDirs.push(subLib);
  }
  const libExt = '.a';
  for (const dir of libSrcDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith(libExt));
    for (const file of files) {
      const src = path.join(dir, file);
      const dest = path.join(libDir, file);
      fs.copyFileSync(src, dest);
    }
  }
  const includeSrcDirs = [path.join(pjsipDir, 'include')];
  for (const sub of subprojects) {
    const subInc = path.join(pjsipDir, sub, 'include');
    if (fs.existsSync(subInc)) includeSrcDirs.push(subInc);
  }
  const copyRecursive = (src, dest) => {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      if (fs.lstatSync(srcPath).isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };
  for (const dir of includeSrcDirs) {
    copyRecursive(dir, includeDir);
  }
  console.log('PJSIP headers and libraries have been synced to sip-core-cpp/pjsip_build.');
}

function getMenuChoices() {
  const choices = [
    { name: 'Build PJSIP (native C libs)', value: 'build_pjsip' },
    { name: 'Sync PJSIP headers/libs to local pjsip_build', value: 'sync_pjsip_build' },
    { name: 'Build SIP core (CMake)', value: 'build_core' },
    { name: 'Build Node/Electron bindings', value: 'build_node' },
    { name: 'Copy PJSIP libs for Node', value: 'copy_libs' },
  ];
  if (fs.existsSync(path.join(root, 'build/bindings/cli/pjsip-cli'))) {
    choices.push({ name: 'Run CLI app', value: 'run_cli' });
  }
  if (
    fs.existsSync(path.join(root, 'apps/electron-app/main.js')) &&
    fs.existsSync(path.join(root, 'bindings/node/build/Release/sipaddon.node'))
  ) {
    choices.push({ name: 'Run Electron app', value: 'run_electron' });
  }
  choices.push({ name: 'Clean all builds', value: 'clean' });
  choices.push({ name: 'Show status', value: 'status' });
  choices.push({ name: 'Exit', value: 'exit' });
  return choices;
}

async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: getMenuChoices(),
    },
  ]);
  return action;
}

async function main() {
  while (true) {
    const action = await mainMenu();
    switch (action) {
      case 'build_pjsip':
        run(getBashCmd('sip-core-cpp/scripts/build_pjsip.sh'), {});
        break;
      case 'sync_pjsip_build':
        syncPjsipBuild();
        break;
      case 'build_core':
        run('cmake -S . -B build && cmake --build build', { cwd: root });
        break;
      case 'build_node':
        run('node-gyp configure build --directory bindings/node', {});
        break;
      case 'copy_libs':
        run(getBashCmd('bindings/node/copy_pjsip_libs.sh sip-core-cpp/pjsip_build/lib'), {});
        break;
      case 'run_cli':
        run('./build/bindings/cli/pjsip-cli', {});
        break;
      case 'run_electron':
        run('npm start --prefix apps/electron-app', {});
        break;
      case 'clean':
        run('rm -rf build sip-core-cpp/pjsip_build bindings/node/build', {});
        break;
      case 'status':
        run('git status', {});
        break;
      case 'exit':
        process.exit(0);
    }
    console.log('\n');
  }
}

main(); 