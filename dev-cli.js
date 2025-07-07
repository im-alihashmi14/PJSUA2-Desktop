// #!/usr/bin/env bun
// Converted to Node.js compatible JavaScript
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = process.cwd();

function run(cmd, opts) {
  opts = opts || {};
  try {
    execSync(cmd, { stdio: 'inherit', cwd: opts.cwd ? opts.cwd : root });
  } catch (e) {
    console.error(`\n[ERROR] Command failed: ${cmd}\n`);
    process.exit(1);
  }
}

function getMenuChoices() {
  const choices = [
    { name: 'Build PJSIP (native C libs)', value: 'build_pjsip' },
    { name: 'Build SIP core (CMake)', value: 'build_core' },
    { name: 'Build Node/Electron bindings', value: 'build_node' },
    { name: 'Copy PJSIP libs for Node', value: 'copy_libs' },
  ];

  // Only show CLI if built
  if (fs.existsSync(path.join(root, 'build/bindings/cli/pjsip-cli'))) {
    choices.push({ name: 'Run CLI app', value: 'run_cli' });
  }
  // Only show Electron if Electron app exists
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
        run('bash sip-core-cpp/scripts/build_pjsip.sh', {});
        break;
      case 'build_core':
        run('cmake -S . -B build && cmake --build build', { cwd: root });
        break;
      case 'build_node':
        run('node-gyp configure build --directory bindings/node', {});
        break;
      case 'copy_libs':
        run('bash bindings/node/copy_pjsip_libs.sh sip-core-cpp/pjsip_build/lib', {});
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