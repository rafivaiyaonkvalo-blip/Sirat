const corePath = 'C:/Users/Abdul Hakim/AppData/Local/npm-cache/_npx/881cef4662d2c421/node_modules/@bubblewrap/core';
const { TwaManifest } = require(corePath);

async function run() {
  const manifest = await TwaManifest.fromWebManifest('https://arabic.markazuliman.com/manifest.json');
  console.log('Manifest loaded from live URL:');
  console.log('Name:', manifest.name);
  console.log('Launcher:', manifest.launcherName);
  console.log('Host:', manifest.host);
  console.log('PackageId:', manifest.packageId);
  console.log('Icon URL:', manifest.iconUrl);
}

run().catch(console.error);
