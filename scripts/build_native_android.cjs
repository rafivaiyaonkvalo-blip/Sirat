const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const ANDROID_PROJECT_DIR = path.join(ROOT_DIR, 'android-project');
const RELEASE_DIR = path.join(ROOT_DIR, 'release');
const KEYSTORE_FILE = path.join(RELEASE_DIR, 'arbigo-release-key.keystore');
const KEYSTORE_PASS = 'arbigo2026';
const KEY_ALIAS = 'arbigo';
const KEY_PASS = 'arbigo2026';

const JDK_PATH = 'R:\\DevTools\\jdk-17';
const ANDROID_SDK_PATH = 'R:\\DevTools\\AndroidSDK';

process.env['JAVA_HOME'] = JDK_PATH;
process.env['ANDROID_HOME'] = ANDROID_SDK_PATH;
process.env['ANDROID_SDK_ROOT'] = ANDROID_SDK_PATH;

console.log('===============================================================');
console.log('🚀 BUILDING 100% PURE NATIVE ANDROID APP (ARBI SHIKHI)');
console.log('===============================================================');

// 1. Ensure directories
const appDir = path.join(ANDROID_PROJECT_DIR, 'app');
const javaSrcDir = path.join(appDir, 'src', 'main', 'java', 'com', 'markazuliman', 'arbigo');
const resDir = path.join(appDir, 'src', 'main', 'res');
const valuesDir = path.join(resDir, 'values');
const layoutDir = path.join(resDir, 'layout');

[javaSrcDir, valuesDir, layoutDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Remove obsolete folders from previous TWA project
['drawable-anydpi', 'xml'].forEach(d => {
  const p = path.join(resDir, d);
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
});

// 2. Write Root build.gradle
const rootBuildGradle = `// Top-level build file
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.9.1'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`;
fs.writeFileSync(path.join(ANDROID_PROJECT_DIR, 'build.gradle'), rootBuildGradle, 'utf8');

// 3. Write settings.gradle
const settingsGradle = `rootProject.name = "ArbiShikhi"
include ':app'
`;
fs.writeFileSync(path.join(ANDROID_PROJECT_DIR, 'settings.gradle'), settingsGradle, 'utf8');

// 4. Write gradle.properties
const gradleProps = `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
android.nonTransitiveRClass=false
`;
fs.writeFileSync(path.join(ANDROID_PROJECT_DIR, 'gradle.properties'), gradleProps, 'utf8');

// 5. Write app/build.gradle
const keystoreEscaped = KEYSTORE_FILE.replace(/\\/g, '/');
const appBuildGradle = `plugins {
    id 'com.android.application'
}

android {
    namespace 'com.markazuliman.arbigo'
    compileSdk 35

    defaultConfig {
        applicationId "com.markazuliman.arbigo"
        minSdk 21
        targetSdk 35
        versionCode 4
        versionName "1.0.3"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        release {
            storeFile file('../../release/arbigo-release-key.keystore')
            storePassword '${KEYSTORE_PASS}'
            keyAlias '${KEY_ALIAS}'
            keyPassword '${KEY_PASS}'
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            signingConfig signingConfigs.release
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.7.0'
    implementation 'com.google.android.material:material:1.12.0'
    implementation 'androidx.webkit:webkit:1.12.1'
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'
}
`;
fs.writeFileSync(path.join(appDir, 'build.gradle'), appBuildGradle, 'utf8');

// 6. Write app/proguard-rules.pro
const proguardRules = `# Keep WebView JavaScript interface if needed
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
`;
fs.writeFileSync(path.join(appDir, 'proguard-rules.pro'), proguardRules, 'utf8');

// 7. Write strings.xml
const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Arbi Shikhi</string>
    <string name="launcher_name">Arbi Shikhi</string>
    <string name="press_back_again_to_exit">অ্যাপ থেকে বের হতে আবার ব্যাক বাটন চাপুন</string>
    <string name="network_error_title">ইন্টারনেট সংযোগ নেই</string>
    <string name="network_error_message">অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ চেক করে পুনরায় চেষ্টা করুন।</string>
    <string name="retry">পুনরায় চেষ্টা করুন</string>
</resources>
`;
fs.writeFileSync(path.join(valuesDir, 'strings.xml'), stringsXml, 'utf8');

// 8. Write colors.xml
const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#059669</color>
    <color name="primary_dark">#0A0D12</color>
    <color name="accent">#10B981</color>
    <color name="background_dark">#0A0D12</color>
</resources>
`;
fs.writeFileSync(path.join(valuesDir, 'colors.xml'), colorsXml, 'utf8');

// 9. Write styles.xml / themes.xml
const themesXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.ArbiShikhi" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryDark">@color/primary_dark</item>
        <item name="colorAccent">@color/accent</item>
        <item name="android:windowBackground">@color/background_dark</item>
        <item name="android:statusBarColor">@color/background_dark</item>
        <item name="android:navigationBarColor">@color/background_dark</item>
    </style>
</resources>
`;
fs.writeFileSync(path.join(valuesDir, 'themes.xml'), themesXml, 'utf8');

// 10. Write activity_main.xml
const activityMainXml = `<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/background_dark">

    <androidx.swiperefreshlayout.widget.SwipeRefreshLayout
        android:id="@+id/swipeRefresh"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <WebView
            android:id="@+id/webView"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:background="@color/background_dark" />

    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>

    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="3dp"
        android:layout_gravity="top"
        android:indeterminate="false"
        android:max="100"
        android:visibility="gone"
        android:progressTint="@color/accent" />

    <LinearLayout
        android:id="@+id/errorView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        android:gravity="center"
        android:padding="24dp"
        android:background="@color/background_dark"
        android:visibility="gone">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/network_error_title"
            android:textColor="#FFFFFF"
            android:textSize="20sp"
            android:textStyle="bold"
            android:layout_marginBottom="12dp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/network_error_message"
            android:textColor="#9CA3AF"
            android:textSize="14sp"
            android:gravity="center"
            android:layout_marginBottom="24dp" />

        <Button
            android:id="@+id/btnRetry"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/retry"
            android:textColor="#FFFFFF"
            android:backgroundTint="@color/primary"
            android:paddingLeft="24dp"
            android:paddingRight="24dp" />

    </LinearLayout>

</FrameLayout>
`;
fs.writeFileSync(path.join(layoutDir, 'activity_main.xml'), activityMainXml, 'utf8');

// 11. Write AndroidManifest.xml
const androidManifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/Theme.ArbiShikhi"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="false">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:label="@string/app_name"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
`;
fs.writeFileSync(path.join(appDir, 'src', 'main', 'AndroidManifest.xml'), androidManifestXml, 'utf8');

// 12. Write MainActivity.java
const mainActivityJava = `package com.markazuliman.arbigo;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {

    private static final String APP_URL = "https://arabic.markazuliman.com";
    private WebView webView;
    private SwipeRefreshLayout swipeRefresh;
    private ProgressBar progressBar;
    private View errorView;
    private Button btnRetry;
    private long lastBackPressTime = 0;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Make Status Bar & Navigation Bar obsidian black (#0A0D12)
        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(Color.parseColor("#0A0D12"));
        window.setNavigationBarColor(Color.parseColor("#0A0D12"));

        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        swipeRefresh = findViewById(R.id.swipeRefresh);
        progressBar = findViewById(R.id.progressBar);
        errorView = findViewById(R.id.errorView);
        btnRetry = findViewById(R.id.btnRetry);

        // Configure SwipeRefresh
        swipeRefresh.setColorSchemeColors(Color.parseColor("#10B981"), Color.parseColor("#059669"));
        swipeRefresh.setProgressBackgroundColorSchemeColor(Color.parseColor("#1E293B"));
        swipeRefresh.setOnRefreshListener(() -> webView.reload());
        
        // Prevent swipe down refresh when not at the very top
        swipeRefresh.getViewTreeObserver().addOnScrollChangedListener(() -> {
            swipeRefresh.setEnabled(webView.getScrollY() == 0);
        });

        btnRetry.setOnClickListener(v -> {
            errorView.setVisibility(View.GONE);
            webView.setVisibility(View.VISIBLE);
            webView.reload();
        });

        // Setup WebView settings
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        // Custom User-Agent tag to identify official native app
        String defaultUa = settings.getUserAgentString();
        settings.setUserAgentString(defaultUa + " ArbiShikhiNativeAndroid/1.0.3");

        // Enable Cookies
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);

        // WebViewClient to keep links inside app
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost();
                String scheme = uri.getScheme();

                if (scheme != null && (scheme.equals("tel") || scheme.equals("mailto") || scheme.equals("whatsapp") || scheme.equals("sms"))) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                        startActivity(intent);
                        return true;
                    } catch (Exception ignored) {
                        return true;
                    }
                }

                if (host != null && (host.contains("markazuliman.com") || host.contains("vercel.app") || host.contains("firebaseapp.com") || host.contains("google.com"))) {
                    return false; // Keep in WebView
                }

                // External websites open in external browser
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                    startActivity(intent);
                    return true;
                } catch (Exception ignored) {
                    return false;
                }
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                progressBar.setVisibility(View.VISIBLE);
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                progressBar.setVisibility(View.GONE);
                swipeRefresh.setRefreshing(false);
                errorView.setVisibility(View.GONE);
                super.onPageFinished(view, url);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    // If network fails completely at startup, show friendly retry
                    if (webView.getProgress() < 50) {
                        webView.setVisibility(View.GONE);
                        errorView.setVisibility(View.VISIBLE);
                    }
                }
                super.onReceivedError(view, request, error);
            }
        });

        // WebChromeClient for progress bar & media permissions
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                if (newProgress >= 100) {
                    progressBar.setVisibility(View.GONE);
                }
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                request.grant(request.getResources());
            }
        });

        // Native Back Button Handling
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    long currentTime = System.currentTimeMillis();
                    if (currentTime - lastBackPressTime < 2000) {
                        finish();
                    } else {
                        lastBackPressTime = currentTime;
                        Toast.makeText(MainActivity.this, getString(R.string.press_back_again_to_exit), Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });

        // Load the live platform
        webView.loadUrl(APP_URL);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onPause() {
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
`;
fs.writeFileSync(path.join(javaSrcDir, 'MainActivity.java'), mainActivityJava, 'utf8');

// 13. Clean all old TWA java files (Application.java, DelegationService.java, LauncherActivity.java, etc.)
const existingJavaFiles = fs.readdirSync(javaSrcDir);
for (const file of existingJavaFiles) {
  if (file !== 'MainActivity.java') {
    fs.unlinkSync(path.join(javaSrcDir, file));
    console.log(' - Removed legacy TWA file:', file);
  }
}

console.log('✓ Pure Native Android project files created successfully!');

// 14. Compile Release APK & AAB using gradlew
console.log('\nCompiling Release APK & AAB via Gradle...');
const prevCwd = process.cwd();
try {
  process.chdir(ANDROID_PROJECT_DIR);
  
  // Assemble Release APK
  console.log(' - Running: gradlew.bat assembleRelease');
  execSync('cmd /c gradlew.bat assembleRelease', { stdio: 'inherit' });

  // Bundle Release AAB
  console.log(' - Running: gradlew.bat bundleRelease');
  execSync('cmd /c gradlew.bat bundleRelease', { stdio: 'inherit' });

  // Find generated release APK
  const apkPath = path.join(appDir, 'build', 'outputs', 'apk', 'release', 'app-release.apk');
  const targetApk = path.join(RELEASE_DIR, 'ArbiShikhi-release-signed.apk');
  const publicApk = path.join(ROOT_DIR, 'public', 'downloads', 'ArbiShikhi-release-signed.apk');
  const distApk = path.join(ROOT_DIR, 'dist', 'downloads', 'ArbiShikhi-release-signed.apk');

  if (fs.existsSync(apkPath)) {
    fs.copyFileSync(apkPath, targetApk);
    fs.copyFileSync(apkPath, publicApk);
    if (fs.existsSync(path.dirname(distApk))) fs.copyFileSync(apkPath, distApk);
    console.log('✓ Native Release APK created:', targetApk, `(${Math.round(fs.statSync(targetApk).size / 1024)} KB)`);
  } else {
    throw new Error('Could not find compiled APK at: ' + apkPath);
  }

  // Find generated release AAB
  const aabPath = path.join(appDir, 'build', 'outputs', 'bundle', 'release', 'app-release.aab');
  const targetAab = path.join(RELEASE_DIR, 'ArbiShikhi-release-bundle.aab');
  const publicAab = path.join(ROOT_DIR, 'public', 'downloads', 'ArbiShikhi-release-bundle.aab');
  const distAab = path.join(ROOT_DIR, 'dist', 'downloads', 'ArbiShikhi-release-bundle.aab');

  if (fs.existsSync(aabPath)) {
    fs.copyFileSync(aabPath, targetAab);
    fs.copyFileSync(aabPath, publicAab);
    if (fs.existsSync(path.dirname(distAab))) fs.copyFileSync(aabPath, distAab);
    console.log('✓ Native Release AAB created:', targetAab, `(${Math.round(fs.statSync(targetAab).size / 1024)} KB)`);
  }

  console.log('\n===============================================================');
  console.log('🎉 100% PURE NATIVE ANDROID APP BUILT & SIGNED SUCCESSFULLY!');
  console.log('===============================================================');
  console.log('📱 APK (Direct Install): public/downloads/ArbiShikhi-release-signed.apk');
  console.log('🏬 AAB (Play Store):     public/downloads/ArbiShikhi-release-bundle.aab');
  console.log('===============================================================');

} finally {
  process.chdir(prevCwd);
}
