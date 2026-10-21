const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const BUBBLEWRAP_BASE = 'C:/Users/Abdul Hakim/AppData/Local/npm-cache/_npx/881cef4662d2c421/node_modules';
const {
  TwaManifest,
  TwaGenerator,
  ConsoleLog
} = require(path.join(BUBBLEWRAP_BASE, '@bubblewrap/core'));
const Color = require(path.join(BUBBLEWRAP_BASE, 'color'));
const { build } = require(path.join(BUBBLEWRAP_BASE, '@bubblewrap/cli/dist/lib/cmds/build.js'));

const JDK_PATH = 'R:\\DevTools\\jdk-17';
const ANDROID_SDK_PATH = 'R:\\DevTools\\AndroidSDK';
const KEYTOOL_PATH = path.join(JDK_PATH, 'bin', 'keytool.exe');

const ROOT_DIR = path.resolve(__dirname, '..');
const RELEASE_DIR = path.join(ROOT_DIR, 'release');
const ANDROID_PROJECT_DIR = path.join(ROOT_DIR, 'android-project');
const KEYSTORE_FILE = path.join(RELEASE_DIR, 'arbigo-release-key.keystore');
const KEYSTORE_PASS = 'arbigo2026';
const KEY_ALIAS = 'arbigo';
const KEY_PASS = 'arbigo2026';

process.env['BUBBLEWRAP_KEYSTORE_PASSWORD'] = KEYSTORE_PASS;
process.env['BUBBLEWRAP_KEY_PASSWORD'] = KEY_PASS;
process.env['JAVA_HOME'] = JDK_PATH;
process.env['ANDROID_HOME'] = ANDROID_SDK_PATH;

function computeChecksum(data) {
  return crypto.createHash('sha1').update(data).digest('hex');
}

async function generateManifestChecksumFile(manifestFile, targetDirectory) {
  const manifestContents = await fs.promises.readFile(manifestFile);
  const checksumFile = path.join(targetDirectory, 'manifest-checksum.txt');
  const sum = computeChecksum(manifestContents);
  await fs.promises.writeFile(checksumFile, sum);
}

async function main() {
  console.log('=====================================================');
  console.log('🚀 ARBI SHIKHI ANDROID APP BUILD PIPELINE (মারকাযুল ঈমান)');
  console.log('=====================================================');

  console.log('\n[1/4] Checking Release Keystore...');
  if (!fs.existsSync(RELEASE_DIR)) {
    fs.mkdirSync(RELEASE_DIR, { recursive: true });
  }

  if (!fs.existsSync(KEYSTORE_FILE)) {
    console.log('Generating release keystore...');
    const keytoolArgs = [
      '-genkeypair',
      '-v',
      '-keystore', KEYSTORE_FILE,
      '-alias', KEY_ALIAS,
      '-keyalg', 'RSA',
      '-keysize', '2048',
      '-validity', '10000',
      '-storepass', KEYSTORE_PASS,
      '-keypass', KEY_PASS,
      '-dname', 'CN=Arbi Shikhi, OU=Markazul Iman, O=Markazul Iman, L=Dhaka, ST=Dhaka, C=BD'
    ];
    execFileSync(KEYTOOL_PATH, keytoolArgs, { stdio: 'inherit' });
    console.log('✓ Keystore created successfully at:', KEYSTORE_FILE);
  } else {
    console.log('✓ Existing keystore found at:', KEYSTORE_FILE);
  }

  console.log('\n[2/4] Initializing TWA Manifest...');
  const webManifestUrl = 'https://arabic.markazuliman.com/manifest.json';
  console.log('Fetching live manifest from:', webManifestUrl);
  const twaManifest = await TwaManifest.fromWebManifest(webManifestUrl);

  // Set production metadata
  twaManifest.packageId = 'com.markazuliman.arbigo';
  twaManifest.name = 'Arbi Shikhi - এসো আরবী শিখি';
  twaManifest.launcherName = 'Arbi Shikhi';
  twaManifest.host = 'arabic.markazuliman.com';
  twaManifest.startUrl = '/';
  twaManifest.themeColor = new Color('#059669');
  twaManifest.themeColorDark = new Color('#0A0D12');
  twaManifest.navigationColor = new Color('#0A0D12');
  twaManifest.navigationColorDark = new Color('#0A0D12');
  twaManifest.backgroundColor = new Color('#0A0D12');
  twaManifest.splashScreenFadeOutDuration = 0;
  twaManifest.iconUrl = 'https://arabic.markazuliman.com/logo-512.png';
  twaManifest.maskableIconUrl = 'https://arabic.markazuliman.com/logo-512.png';
  twaManifest.appVersionCode = 3;
  twaManifest.appVersionName = '1.0.2';
  twaManifest.minSdkVersion = 21;
  twaManifest.signingKey = {
    path: KEYSTORE_FILE,
    alias: KEY_ALIAS
  };

  console.log('Configured Manifest Details:');
  console.log(' - Name:         ', twaManifest.name);
  console.log(' - Launcher Name:', twaManifest.launcherName);
  console.log(' - Package ID:   ', twaManifest.packageId);
  console.log(' - Version:      ', `${twaManifest.appVersionName} (code ${twaManifest.appVersionCode})`);
  console.log(' - Host:         ', twaManifest.host);
  console.log(' - Theme Color:  ', twaManifest.themeColor.hex());
  console.log(' - Bg Color:     ', twaManifest.backgroundColor.hex());
  console.log(' - Icon URL:     ', twaManifest.iconUrl);

  console.log('\n[3/4] Generating Android Studio / Gradle Project...');
  if (fs.existsSync(ANDROID_PROJECT_DIR)) {
    console.log('Cleaning old android project folder...');
    fs.rmSync(ANDROID_PROJECT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(ANDROID_PROJECT_DIR, { recursive: true });

  const log = new ConsoleLog('TwaGenerator');
  const generator = new TwaGenerator();
  await generator.createTwaProject(ANDROID_PROJECT_DIR, twaManifest, log, (current, total) => {
    process.stdout.write(`Project generation progress: [${current}/${total}]\r`);
  });
  console.log('\n✓ Android project generated at:', ANDROID_PROJECT_DIR);

  // Post-process project to remove static splash logo so app opens directly into animated web intro
  console.log('\n[3.5] Removing static splash logo (transparent splash for direct web intro)...');
  const transparentPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const transparentPngBuf = Buffer.from(transparentPngBase64, 'base64');

  const resDir = path.join(ANDROID_PROJECT_DIR, 'app', 'src', 'main', 'res');
  const drawableDirs = ['drawable-hdpi', 'drawable-mdpi', 'drawable-xhdpi', 'drawable-xxhdpi', 'drawable-xxxhdpi'];
  for (const dir of drawableDirs) {
    const splashFile = path.join(resDir, dir, 'splash.png');
    if (fs.existsSync(splashFile)) {
      fs.writeFileSync(splashFile, transparentPngBuf);
      console.log(` - Replaced ${dir}/splash.png with transparent 1x1`);
    }
  }

  // Remove SPLASH_IMAGE_DRAWABLE from AndroidManifest.xml so TWA doesn't display any static logo
  const manifestXmlPath = path.join(ANDROID_PROJECT_DIR, 'app', 'src', 'main', 'AndroidManifest.xml');
  if (fs.existsSync(manifestXmlPath)) {
    let manifestContent = fs.readFileSync(manifestXmlPath, 'utf8');
    manifestContent = manifestContent.replace(
      /<meta-data\s+android:name="android\.support\.customtabs\.trusted\.SPLASH_IMAGE_DRAWABLE"[\s\S]*?\/>\s*/g,
      ''
    );
    fs.writeFileSync(manifestXmlPath, manifestContent, 'utf8');
    console.log(' - Removed SPLASH_IMAGE_DRAWABLE meta-data from AndroidManifest.xml');
  }

  // Save twa-manifest.json and checksum
  const twaManifestFilePath = path.join(ANDROID_PROJECT_DIR, 'twa-manifest.json');
  await twaManifest.saveToFile(twaManifestFilePath);
  await generateManifestChecksumFile(twaManifestFilePath, ANDROID_PROJECT_DIR);
  console.log('✓ Checksum generated to prevent interactive update prompts.');

  console.log('\n[4/4] Compiling and Signing APK & AAB Packages...');
  const config = {
    jdkPath: JDK_PATH,
    androidSdkPath: ANDROID_SDK_PATH
  };
  const args = {
    directory: ANDROID_PROJECT_DIR,
    manifest: twaManifestFilePath
  };

  const prevCwd = process.cwd();
  process.chdir(ANDROID_PROJECT_DIR);

  try {
    const buildResult = await build(config, args, log);
    if (!buildResult) {
      throw new Error('Build command failed in bubblewrap CLI.');
    }

    // Copy built packages to release/ folder
    const sourceApk = path.join(ANDROID_PROJECT_DIR, 'app-release-signed.apk');
    const targetApk = path.join(RELEASE_DIR, 'ArbiShikhi-release-signed.apk');
    const legacyTargetApk = path.join(RELEASE_DIR, 'ArbiGo-release-signed.apk');
    if (fs.existsSync(sourceApk)) {
      fs.copyFileSync(sourceApk, targetApk);
      fs.copyFileSync(sourceApk, legacyTargetApk);
      console.log('✓ Copied APK to:', targetApk);
    }

    const sourceAab = path.join(ANDROID_PROJECT_DIR, 'app-release-bundle.aab');
    const targetAab = path.join(RELEASE_DIR, 'ArbiShikhi-release-bundle.aab');
    const legacyTargetAab = path.join(RELEASE_DIR, 'ArbiGo-release-bundle.aab');
    if (fs.existsSync(sourceAab)) {
      fs.copyFileSync(sourceAab, targetAab);
      fs.copyFileSync(sourceAab, legacyTargetAab);
      console.log('✓ Copied AAB to:', targetAab);
    }

    // Also copy directly to public/downloads for live website download button
    const publicDownloadsDir = path.join(ROOT_DIR, 'public', 'downloads');
    if (!fs.existsSync(publicDownloadsDir)) {
      fs.mkdirSync(publicDownloadsDir, { recursive: true });
    }
    const publicApk = path.join(publicDownloadsDir, 'ArbiShikhi-release-signed.apk');
    const legacyPublicApk = path.join(publicDownloadsDir, 'ArbiGo-release-signed.apk');
    const publicAab = path.join(publicDownloadsDir, 'ArbiShikhi-release-bundle.aab');
    const legacyPublicAab = path.join(publicDownloadsDir, 'ArbiGo-release-bundle.aab');
    if (fs.existsSync(sourceApk)) {
      fs.copyFileSync(sourceApk, publicApk);
      fs.copyFileSync(sourceApk, legacyPublicApk);
      console.log('✓ Copied APK to live downloads:', publicApk);
    }
    if (fs.existsSync(sourceAab)) {
      fs.copyFileSync(sourceAab, publicAab);
      fs.copyFileSync(sourceAab, legacyPublicAab);
      console.log('✓ Copied AAB to live downloads:', publicAab);
    }

    console.log('\n=============================================================');
    console.log('🎉 ARBI SHIKHI ANDROID PACKAGES BUILT & SIGNED SUCCESSFULLY!');
    console.log('=============================================================');
    console.log('📱 Direct Install APK:   release/ArbiShikhi-release-signed.apk');
    console.log('🌐 Web Download APK:     public/downloads/ArbiShikhi-release-signed.apk');
    console.log('🏬 Google Play Store AAB: release/ArbiShikhi-release-bundle.aab');
    console.log('🔑 Release Keystore:     release/arbigo-release-key.keystore');
    console.log('   - Alias:              arbigo');
    console.log('   - Password:           arbigo2026');
    console.log('=============================================================');

  } finally {
    process.chdir(prevCwd);
  }
}

main().catch((err) => {
  console.error('\n❌ BUILD FAILED:', err);
  process.exit(1);
});
