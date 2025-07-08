// Windows-specific CLI for PJSUA2-Desktop
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = process.cwd();
const isWin = true;
const BUILD_META_FILE = path.join(root, '.buildmeta.json');

function run(cmd, opts) {
  opts = opts || {};
  try {
    execSync(cmd, { stdio: 'inherit', cwd: opts.cwd ? opts.cwd : root, shell: true });
  } catch (e) {
    console.error(`\n[ERROR] Command failed: ${cmd}\n`);
    process.exit(1);
  }
}

function findPjsipSln() {
  const pjsipDir = path.join(root, 'pjsip');
  if (!fs.existsSync(pjsipDir)) return null;
  const files = fs.readdirSync(pjsipDir);
  if (files.includes('pjproject-vs14.sln')) {
    return path.join(pjsipDir, 'pjproject-vs14.sln');
  }
  if (files.includes('pjproject-vs8.sln')) {
    return path.join(pjsipDir, 'pjproject-vs8.sln');
  }
  const sln = files.find(f => f.endsWith('.sln'));
  return sln ? path.join(pjsipDir, sln) : null;
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
  const libExt = '.lib';
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

function getLastBuildMeta() {
  if (fs.existsSync(BUILD_META_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(BUILD_META_FILE, 'utf8'));
    } catch (e) {}
  }
  return {};
}

function setLastBuildMeta(meta) {
  fs.writeFileSync(BUILD_META_FILE, JSON.stringify(meta));
}

function getMenuChoices() {
  const choices = [
    { name: 'Build PJSIP (Visual Studio/MSBuild)', value: 'build_pjsip_vs' },
    { name: 'Sync PJSIP headers/libs to local pjsip_build', value: 'sync_pjsip_build' },
    { name: 'Build SIP core (CMake)', value: 'build_core' },
    { name: 'Build Node/Electron bindings', value: 'build_node' },
    { name: 'Copy PJSIP libs for Node', value: 'copy_libs' },
  ];
  const cliExe = path.join(root, 'build/bindings/cli/pjsip-cli.exe');
  const cliExeRelease = path.join(root, 'build/bindings/cli/Release/pjsip-cli.exe');
  if (fs.existsSync(cliExe) || fs.existsSync(cliExeRelease)) {
    choices.push({ name: 'Run CLI app', value: 'run_cli' });
  }
  if (
    fs.existsSync(path.join(root, 'apps/electron-app/main.js')) &&
    fs.existsSync(path.join(root, 'bindings/node/build/Release/sipaddon.node'))
  ) {
    choices.push({ name: 'Run Electron app', value: 'run_electron' });
  }
  choices.push({ name: 'Run Expo dev server', value: 'run_expo_dev' });
  choices.push({ name: 'Run Expo Electron shell', value: 'run_expo_electron_shell' });
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
      case 'build_pjsip_vs': {
        // Ensure pjsip directory exists
        const pjsipDir = path.join(root, 'pjsip');
        if (!fs.existsSync(pjsipDir)) {
          console.log('PJSIP source not found. Cloning from official repository...');
          run('git clone https://github.com/pjsip/pjproject.git pjsip', {});
        }
        // Ensure config_site.h exists
        const configSitePath = path.join(pjsipDir, 'pjlib', 'include', 'pj', 'config_site.h');
        if (!fs.existsSync(configSitePath)) {
          console.log('config_site.h not found. Creating an empty config_site.h...');
          fs.writeFileSync(configSitePath, '/* User config overrides for PJSIP. Leave empty or add custom defines. */\n');
        }
        const { arch, config } = await inquirer.prompt([
          {
            type: 'list',
            name: 'arch',
            message: 'Select architecture for PJSIP build:',
            choices: [
              { name: 'x64', value: 'x64' },
              { name: 'ARM64 (recommended)', value: 'ARM64' },
            ],
            default: 'ARM64',
          },
          {
            type: 'list',
            name: 'config',
            message: 'Select configuration for PJSIP build:',
            choices: [
              { name: 'Release (recommended)', value: 'Release' },
              { name: 'Debug', value: 'Debug' },
            ],
            default: 'Release',
          },
        ]);
        const last = getLastBuildMeta();
        if (last.pjsip_arch !== arch || last.pjsip_config !== config) {
          const winDirs = [
            'build',
            'sip-core-cpp\\pjsip_build',
            'bindings\\node\\build',
          ];
          for (const dir of winDirs) {
            if (fs.existsSync(path.join(root, dir))) {
              run(`rmdir /s /q ${dir}`, {});
            }
          }
        }
        setLastBuildMeta({ ...last, pjsip_arch: arch, pjsip_config: config });
        const sln = findPjsipSln();
        if (!sln) {
          console.error('Could not find a .sln file in the pjsip directory. Please ensure PJSIP source is present.');
          process.exit(1);
        }
        const toolset = process.env.PJSIP_VS_TOOLSET || 'v143';
        run(`msbuild "${sln}" /p:Configuration=${config} /p:Platform=${arch} /p:PlatformToolset=${toolset}`, {});
        break;
      }
      case 'sync_pjsip_build':
        syncPjsipBuild();
        break;
      case 'build_core': {
        const { arch, config } = await inquirer.prompt([
          {
            type: 'list',
            name: 'arch',
            message: 'Select architecture for SIP core build:',
            choices: [
              { name: 'x64', value: 'x64' },
              { name: 'ARM64 (recommended)', value: 'ARM64' },
            ],
            default: 'ARM64',
          },
          {
            type: 'list',
            name: 'config',
            message: 'Select configuration for SIP core build:',
            choices: [
              { name: 'Release (recommended)', value: 'Release' },
              { name: 'Debug', value: 'Debug' },
            ],
            default: 'Release',
          },
        ]);
        const last = getLastBuildMeta();
        if (last.core_arch !== arch || last.core_config !== config) {
          const winDirs = [
            'build',
            'sip-core-cpp\\pjsip_build',
            'bindings\\node\\build',
          ];
          for (const dir of winDirs) {
            if (fs.existsSync(path.join(root, dir))) {
              run(`rmdir /s /q ${dir}`, {});
            }
          }
        }
        setLastBuildMeta({ ...last, core_arch: arch, core_config: config });
        run(`cmake -A ${arch} -S . -B build -DCMAKE_BUILD_TYPE=${config} -DPJSIP_ARCH=${arch} && cmake --build build --config ${config}`, { cwd: root });
        break;
      }
      case 'build_node':
        run('node-gyp configure --directory bindings/node', {});
        run('node bindings/node/patch_vcxproj.js', {});
        run('node-gyp build --directory bindings/node', {});
        break;
      case 'copy_libs':
        run('bash bindings/node/copy_pjsip_libs.sh sip-core-cpp/pjsip_build/lib', {});
        break;
      case 'run_cli': {
        const cliExe = path.join(root, 'build/bindings/cli/pjsip-cli.exe');
        const cliExeRelease = path.join(root, 'build/bindings/cli/Release/pjsip-cli.exe');
        if (fs.existsSync(cliExeRelease)) {
          run(cliExeRelease, {});
        } else if (fs.existsSync(cliExe)) {
          run(cliExe, {});
        } else {
          console.error('CLI executable not found. Please build the SIP core first.');
        }
        break;
      }
      case 'run_electron':
        run('npm start --prefix apps/electron-app', {});
        break;
      case 'run_expo_dev': {
        // Start Expo dev server in foreground
        const expoDir = path.join(root, 'apps', 'expo-app');
        console.log('Starting Expo dev server...');
        run('npm start', { cwd: expoDir });
        break;
      }
      case 'run_expo_electron_shell': {
        // Launch Electron shell (waits for Expo dev server)
        const electronDir = path.join(root, 'apps', 'expo-app', 'electron');
        console.log('Launching Electron shell (will wait for Expo dev server if needed)...');
        run('npm start', { cwd: electronDir });
        break;
      }
      case 'clean': {
        // Confirm with the user before cleaning all builds
        const { confirmClean } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmClean',
            message: 'Are you sure you want to clean all builds? This cannot be undone.',
            default: false,
          },
        ]);
        if (!confirmClean) {
          console.log('Clean cancelled.');
          break;
        }
        // Clean all build artifacts, including CMake, MSBuild, and Node outputs
        const winDirs = [
          'build',
          'sip-core-cpp\\pjsip_build',
          'bindings\\node\\build',
        ];
        for (const dir of winDirs) {
          if (fs.existsSync(path.join(root, dir))) {
            run(`rmdir /s /q ${dir}`, {});
          }
        }
        // Remove all generated files in the root and subdirs
        const patterns = [
          '*.sln', '*.vcxproj*', '*.user', '*.obj', '*.exe', '*.dll', '*.lib', '*.pdb', '*.app', '*.o', '*.a', '*.so', '*.dylib', '*.tmp', '*.log', '*.out', '*.test', '*.bak', '*.swp', '*.swo', '*.dSYM', '*.tar.gz', '*.zip', 'CMakeFiles', 'CMakeCache.txt', 'cmake_install.cmake', 'Makefile'
        ];
        for (const pattern of patterns) {
          run(`powershell -Command "Get-ChildItem -Path . -Recurse -Include ${pattern} | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue"`, {});
        }
        break;
      }
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