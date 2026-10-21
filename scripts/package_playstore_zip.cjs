const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const RELEASE_DIR = path.join(ROOT_DIR, 'release');
const PACKAGE_DIR = path.join(RELEASE_DIR, 'ArbiShikhi-PlayStore-Package');
const ZIP_FILE = path.join(RELEASE_DIR, 'ArbiShikhi-PlayStore-Package.zip');
const PUBLIC_DOWNLOADS_DIR = path.join(ROOT_DIR, 'public', 'downloads');
const PUBLIC_ZIP_FILE = path.join(PUBLIC_DOWNLOADS_DIR, 'ArbiShikhi-PlayStore-Package.zip');
const DIST_DOWNLOADS_DIR = path.join(ROOT_DIR, 'dist', 'downloads');
const DIST_ZIP_FILE = path.join(DIST_DOWNLOADS_DIR, 'ArbiShikhi-PlayStore-Package.zip');

console.log('===============================================================');
console.log('📦 CREATING GOOGLE PLAY STORE PUBLISHING ZIP PACKAGE');
console.log('===============================================================');

// Clean and prepare package directory
if (fs.existsSync(PACKAGE_DIR)) {
  fs.rmSync(PACKAGE_DIR, { recursive: true, force: true });
}
fs.mkdirSync(PACKAGE_DIR, { recursive: true });

const screenshotsDir = path.join(PACKAGE_DIR, 'screenshots');
fs.mkdirSync(screenshotsDir, { recursive: true });

// 1. Copy AAB (Google Play Store Release Bundle)
const aabSource = path.join(RELEASE_DIR, 'ArbiShikhi-release-bundle.aab');
fs.copyFileSync(aabSource, path.join(PACKAGE_DIR, 'ArbiShikhi-release-bundle.aab'));
console.log('✓ Copied AAB Bundle');

// 2. Copy APK (For direct test installation)
const apkSource = path.join(RELEASE_DIR, 'ArbiShikhi-release-signed.apk');
fs.copyFileSync(apkSource, path.join(PACKAGE_DIR, 'ArbiShikhi-release-signed.apk'));
console.log('✓ Copied Release APK');

// 3. Copy Keystore
const keystoreSource = path.join(RELEASE_DIR, 'arbigo-release-key.keystore');
fs.copyFileSync(keystoreSource, path.join(PACKAGE_DIR, 'arbigo-release-key.keystore'));
console.log('✓ Copied Keystore');

// 4. Copy 512x512 App Icon
const iconSource = path.join(ROOT_DIR, 'public', 'logo-512.png');
fs.copyFileSync(iconSource, path.join(PACKAGE_DIR, 'app_icon_512x512.png'));
console.log('✓ Copied 512x512 App Icon');

// 5. Copy 1024x500 Feature Graphic
const featureSource = path.join(ROOT_DIR, 'public', 'feature-graphic.png');
fs.copyFileSync(featureSource, path.join(PACKAGE_DIR, 'feature_graphic_1024x500.png'));
console.log('✓ Copied 1024x500 Feature Graphic Banner');

// 6. Copy Screenshots
const srcScreenshots = path.join(RELEASE_DIR, 'playstore-assets', 'screenshots');
const shotFiles = ['01_lessons_roadmap.png', '02_vocabulary_builder.png', '03_interactive_flashcards.png', '04_interactive_practice.png'];
shotFiles.forEach((file, index) => {
  const src = path.join(srcScreenshots, file);
  if (fs.existsSync(src)) {
    const targetName = file === '04_interactive_practice.png' ? '04_interactive_quiz.png' : file;
    fs.copyFileSync(src, path.join(screenshotsDir, targetName));
    console.log(`✓ Copied Screenshot ${index + 1}:`, targetName);
  }
});

// 7. Write Keystore Credentials info
const keystoreInfo = `===============================================================
ARBI SHIKHI - ANDROID RELEASE KEYSTORE CREDENTIALS
===============================================================

File Name:          arbigo-release-key.keystore
Key Alias:          arbigo
Keystore Password:  arbigo2026
Key Password:       arbigo2026
Validity:           Until February 2054
Algorithm:          RSA 2048-bit (SHA256withRSA)

CERTIFICATE FINGERPRINTS:
- SHA-1:
  3E:CB:A9:9B:87:BD:FC:65:CA:4B:79:D6:BA:D0:5A:C1:74:00:01:0C

- SHA-256:
  B9:76:DF:A2:85:55:77:BF:5F:73:D2:53:7E:31:AF:A2:31:9B:EF:65:8F:09:E8:22:7C:E8:3E:D7:AD:A6:4F:7A

IMPORTANT:
এই কী-ফাইলটি অত্যন্ত মূল্যবান। ভবিষ্যতে প্লে-স্টোরে অ্যাপটির নতুন ভার্সন বা আপডেট দেওয়ার সময় এই কীস্টোর ফাইলটি প্রয়োজন হবে। এটি গুগল ড্রাইভ বা সুরক্ষিত ড্রাইভে সংরক্ষণ করে রাখুন।
`;
fs.writeFileSync(path.join(PACKAGE_DIR, 'KEYSTORE_CREDENTIALS.txt'), keystoreInfo, 'utf8');
console.log('✓ Created KEYSTORE_CREDENTIALS.txt');

// 8. Write Store Listing Details (Metadata for Google Play Console)
const storeListingInfo = `# গুগল প্লে-স্টোর লিস্টিং তথ্য (Store Listing Details)

নিচের তথ্যগুলো গুগল প্লে কনসোলে (Google Play Console) অ্যাপ তৈরির সময় হুবহু কপি করে পেস্ট করে দেবেন:

---

### ১. সাধারণ তথ্য (General Details)
- **App Name (সর্বোচ্চ ৩০ অক্ষর):**  
  \`Arbi Shikhi - এসো আরবী শিখি\`
- **Short Description (সর্বোচ্চ ৮০ অক্ষর):**  
  \`সহজে কুরআন ও হাদিসের ভাষা এসো আরবী শিখি পদ্ধতিতে শিখুন।\`
- **Default Language:**  
  \`Bengali (bn-BD)\` অথবা \`English (United States) - en-US\`

---

### ২. বিস্তারিত বিবরণ (Full Description - সর্বোচ্চ ৪০০০ অক্ষর)
\`\`\`text
"এসো আরবী শিখি" ও "আত-তামরীনুল কিতাবী" পাঠ্যক্রমের আলোকে মারকাযুল ঈমান (Markazul Iman) পরিচালিত ডিজিটাল আরবি ভাষা শিক্ষার পূর্ণাঙ্গ ইন্টারেক্টিভ প্ল্যাটফর্ম।

মাওলানা আবু তাহের মেছবাহ (দা.বা.) রচিত কালজয়ী পাঠ্যবইয়ের আধুনিক ডিজিটাল রূপান্তর নিয়ে তৈরি এই অ্যাপটি শিক্ষার্থী, মাদরাসা ছাত্র এবং সাধারণ আগ্রহী যে কারো জন্য আরবি ভাষা সহজ ও প্রাঞ্জলভাবে শেখার একটি স্বয়ংসম্পূর্ণ মাধ্যম।

মূল বৈশিষ্ট্যসমূহ:
★ ৭০টি পূর্ণাঙ্গ পাঠ: ধাপে ধাপে সাজানো শব্দভাণ্ডার, বাক্য গঠন, কথোপকথন ও প্রশ্নোত্তর।
★ ১,৩৪৩টি বিশুদ্ধ আরবি শব্দভাণ্ডার: পূর্ণাঙ্গ হরকত ও বিশুদ্ধ বাংলা অর্থসহ সমৃদ্ধ ডিকশনারি।
★ আত-তামরীনুল কিতাবী: মূল অনুশীলনী ও কিতাবী অনুশীলনের সহজ সমাধান।
★ ইন্টারেক্টিভ কুইজ ও ফ্ল্যাশ কার্ড: প্রতিটি পাঠের পর নিজের প্রস্তুতি যাচাই করার চমৎকার সুযোগ।
★ অডিও উচ্চারণ ও অনুশীলন: প্রতিটি আরবি শব্দের শুদ্ধ উচ্চারণ শোনার সুবিধা।
★ অফলাইন ক্যাশিং ও সুপার ফাস্ট ইন্টারফেস: খুব অল্প এমবি ডাটা খরচ করে বিদ্যুৎ গতিতে ব্যবহার।

আরবি হোক আমাদের হৃদয়ের ভাষা, কুরআনের ভাষা। 
মারকাযুল ঈমান — দ্বীন ও ভাষার বিশুদ্ধ খেদমতে।
ওয়েবসাইট: https://arabic.markazuliman.com
\`\`\`

---

### ৩. ক্যাটাগরি ও ট্যাগ (Category & Tags)
- **Application Type:** \`App\`
- **Category:** \`Education (শিক্ষা)\`
- **Tags:** \`Education\`, \`Language Learning\`, \`Arabic\`, \`Islamic\`

---

### ৪. ডেভেলপার ও সাপোর্ট যোগাযোগ (Store Contact Details)
- **Email Address:** \`info@markazuliman.com\` (বা আপনার পছন্দের সাপোর্ট ইমেইল)
- **Website URL:** \`https://arabic.markazuliman.com\`
- **Privacy Policy URL:**  
  \`https://arabic.markazuliman.com/privacy.html\` (গুগল প্লে স্টোরে এই লিংকটি অবশ্যই দিতে হবে)

---

### ৫. কনটেন্ট রেটিং (Content Rating Questionnaire)
- **Category:** Education / Reference
- Violence / Sexual / Bad language: সবগুলোতে \`NO\` সিলেক্ট করবেন।
- রেটিং আসবে: \`Everyone / All Ages (সব বয়সের জন্য উপযুক্ত)\`।

---

### ৬. ডাটা নিরাপত্তা (Data Safety Questionnaire)
- Does your app collect or share user data?  
  \`No\` (যদি ইউজার লগইন না দেওয়া হয়) অথবা \`Yes\` দিলে \`User Account / Analytics (Name, Email for learning progress only)\`।
- Data is encrypted in transit: \`Yes\`
- Users can request data deletion: \`Yes\`
`;
fs.writeFileSync(path.join(PACKAGE_DIR, 'STORE_LISTING_INFO.md'), storeListingInfo, 'utf8');
console.log('✓ Created STORE_LISTING_INFO.md');

// 9. Write Step-by-Step Publish Guide in Bengali
const publishGuide = `# গুগল প্লে স্টোরে অ্যাপ পাবলিশ করার পূর্ণাঙ্গ গাইড (Step-by-Step Bangla Guide)

এই ফোল্ডারে গুগল প্লে স্টোরে অ্যাপ আপলোড করার জন্য প্রয়োজনীয় প্রতিটি ফাইল রয়েছে। নিচে সহজে প্লে-স্টোরে ছাড়ার ধাপগুলো দেওয়া হলো:

---

### ধাপ ১: গুগল প্লে কনসোলে প্রবেশ
1. ব্রাউজারে **[Google Play Console](https://play.google.com/console)** এ যান।
2. আপনার গুগল ডেভেলপার একাউন্টে লগইন করুন।
3. ডানপাশের নীল বাটন **\`Create app\`** এ ক্লিক করুন।

---

### ধাপ ২: অ্যাপের প্রাথমিক তথ্য পূরণ
- **App name:** \`Arbi Shikhi - এসো আরবী শিখি\`
- **Default language:** \`Bengali\` বা \`English\`
- **App or game:** \`App\` সিলেক্ট করুন।
- **Free or paid:** \`Free\` সিলেক্ট করুন।
- ডিক্লারেশন বক্সগুলোতে টিক চিহ্ন দিয়ে নিচে **\`Create app\`** বাটনে ক্লিক করুন।

---

### ধাপ ৩: গ্রাফিক্স ও ছবি আপলোড (Store Presence -> Main store listing)
বাম পাশের মেনু থেকে **\`Grow users\`** -> **\`Store presence\`** -> **\`Main store listing\`** এ যান:
1. **Short description & Full description:** \`STORE_LISTING_INFO.md\` ফাইল থেকে কপি করে পেস্ট করুন।
2. **App icon:** ফোল্ডারের \`app_icon_512x512.png\` ফাইলটি আপলোড করুন।
3. **Feature graphic:** ফোল্ডারের \`feature_graphic_1024x500.png\` ফাইলটি আপলোড করুন।
4. **Phone screenshots:** \`screenshots\` ফোল্ডারের ৪টি স্ক্রিনশট টেনে এনে আপলোড করে দিন।
5. নিচে **\`Save\`** বাটনে ক্লিক করুন।

---

### ধাপ ৪: অ্যাপ কনটেন্ট ও পলিসি পূরণ (Policy and programs -> App content)
বাম পাশের মেনুর নিচে **\`App content\`** এ গিয়ে একে একে পূরণ করুন:
- **Privacy policy:** \`https://arabic.markazuliman.com/privacy.html\` দিয়ে Save করুন।
- **Ads:** \`No, my app does not contain ads\` দিন।
- **App access:** \`All functionality is available without special access\` দিন।
- **Content ratings:** প্রশ্নগুলোর উত্তর দিন (সব \`No\`)।
- **Target audience:** \`13 and older\` বা \`All ages\` নির্বাচন করুন।
- **Data safety:** প্রশ্নগুলোর সহজ উত্তর দিন।

---

### ধাপ ৫: AAB ফাইল আপলোড (Production Release)
1. বাম পাশের মেনু থেকে **\`Release\`** -> **\`Production\`** এ যান।
2. উপরে ডানপাশে **\`Create new release\`** এ ক্লিক করুন।
3. **App bundles:** ফোল্ডারের **\`ArbiShikhi-release-bundle.aab\`** ফাইলটি ড্রপ করে আপলোড করুন।
4. **Release name:** স্বয়ংক্রিয়ভাবে \`1.0.3 (4)\` চলে আসবে।
5. **Release notes:** লিখুন—\`প্রাথমিক রিলিজ: এসো আরবী শিখি ও আত-তামরীনুল কিতাবীর পূর্ণাঙ্গ ডিজিটাল প্ল্যাটফর্ম।\`
6. **\`Next\`** -> **\`Save\`** -> **\`Send for review\`** বাটনে ক্লিক করুন!

সাধারণত **২ থেকে ৪ কার্যদিবসের মধ্যে** গুগল অ্যাপটি রিভিউ করে প্লে-স্টোরে লাইভ করে দেয়!
`;
fs.writeFileSync(path.join(PACKAGE_DIR, 'PLAY_STORE_PUBLISH_GUIDE_BANGLA.md'), publishGuide, 'utf8');
console.log('✓ Created PLAY_STORE_PUBLISH_GUIDE_BANGLA.md');

// 10. Create ZIP using PowerShell Compress-Archive
console.log('\nCreating ZIP Archive...');
if (fs.existsSync(ZIP_FILE)) fs.unlinkSync(ZIP_FILE);
if (fs.existsSync(PUBLIC_ZIP_FILE)) fs.unlinkSync(PUBLIC_ZIP_FILE);

const psZipCmd = `powershell -Command "Compress-Archive -Path '${PACKAGE_DIR}\\*' -DestinationPath '${ZIP_FILE}' -Force"`;
execSync(psZipCmd, { stdio: 'inherit' });

if (fs.existsSync(ZIP_FILE)) {
  fs.copyFileSync(ZIP_FILE, PUBLIC_ZIP_FILE);
  if (!fs.existsSync(DIST_DOWNLOADS_DIR)) fs.mkdirSync(DIST_DOWNLOADS_DIR, { recursive: true });
  fs.copyFileSync(ZIP_FILE, DIST_ZIP_FILE);
  const sizeMb = (fs.statSync(ZIP_FILE).size / (1024 * 1024)).toFixed(2);
  console.log('\n===============================================================');
  console.log(`🎉 ZIP PACKAGE CREATED SUCCESSFULLY! (${sizeMb} MB)`);
  console.log('===============================================================');
  console.log('📁 Local Zip Path:   release/ArbiShikhi-PlayStore-Package.zip');
  console.log('🌐 Web Download:     public/downloads/ArbiShikhi-PlayStore-Package.zip');
  console.log('===============================================================');
}
