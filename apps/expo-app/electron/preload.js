console.log('[preload.js] loaded');

const { contextBridge, ipcRenderer } = require('electron');
const sipFunctions = [
    'initSIP',
    'registerAccount',
    'call',
    'mute',
    'unmute',
    'hold',
    'unhold',
    'hangup',
    'hangupAll',
    'cleanup',
    'setTransportType',
    'accept',
    'reject',
    'setIceEnabled',
    'setInterfaceIp',
];

contextBridge.exposeInMainWorld('sip', {
  ...sipFunctions.reduce((acc, fn) => {
    acc[fn] = (...args) => ipcRenderer.invoke('sip:' + fn, ...args);
    return acc;
  }, {}),
});

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  console.log('Dom Content Loaded from preload.js');
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});


