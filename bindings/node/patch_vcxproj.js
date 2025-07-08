const fs = require('fs');
const path = require('path');

const vcxproj = path.join(__dirname, 'build', 'sipaddon.vcxproj');
if (fs.existsSync(vcxproj)) {
  let content = fs.readFileSync(vcxproj, 'utf8');
  const replaced = content.replace(/<RuntimeLibrary>MultiThreaded<\/RuntimeLibrary>/g, '<RuntimeLibrary>MultiThreadedDLL</RuntimeLibrary>');
  if (replaced !== content) {
    fs.writeFileSync(vcxproj, replaced);
    console.log('Patched sipaddon.vcxproj: forced MultiThreadedDLL (/MD)');
  } else {
    console.log('No patch needed: sipaddon.vcxproj already uses MultiThreadedDLL');
  }
} else {
  console.error('sipaddon.vcxproj not found. Run node-gyp configure first.');
} 