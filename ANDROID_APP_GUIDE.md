# 📱 Dhan Suraksha — Android App Guide

Complete step-by-step guide to create an Android app from the Dhan Suraksha website and install it on your phone.

---

## Prerequisites

1. **Android Studio** — Download from [developer.android.com/studio](https://developer.android.com/studio)
2. **USB Cable** — To connect your Android phone to your computer
3. **Enable Developer Options** on your phone:
   - Go to **Settings → About Phone → Tap "Build Number" 7 times**
   - Go to **Settings → Developer Options → Enable "USB Debugging"**

---

## Step 1: Create New Project in Android Studio

1. Open **Android Studio** → Click **"New Project"**
2. Select **"Empty Views Activity"** → Click **Next**
3. Fill in:
   - **Name:** `Dhan Suraksha`
   - **Package name:** `com.dhansuraksha.app`
   - **Save location:** Choose any folder
   - **Language:** `Java`
   - **Minimum SDK:** `API 24 (Android 7.0)`
4. Click **Finish** and wait for the project to build

---

## Step 2: Copy Website Files

1. In your project, find the folder: `app/src/main/`
2. Create a new folder called **`assets`** inside it:
   - Right-click on `main` → **New → Directory** → Type `assets`
3. Copy ALL these files into the `assets` folder:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `1.jpeg`
   - `2.jpeg`
   - `3.jpeg`
   - `4.jpeg`
   - `5.jpeg`

Your folder structure should look like:
```
app/src/main/
├── assets/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── 1.jpeg
│   ├── 2.jpeg
│   ├── 3.jpeg
│   ├── 4.jpeg
│   └── 5.jpeg
├── java/
├── res/
└── AndroidManifest.xml
```

---

## Step 3: Update AndroidManifest.xml

Open `app/src/main/AndroidManifest.xml` and **replace its entire content** with:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Dhan Suraksha"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.DhanSuraksha"
        android:usesCleartextTraffic="true"
        tools:targetApi="31">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboard|keyboardHidden"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>
</manifest>
```

---

## Step 4: Update the Layout File

Open `app/src/main/res/layout/activity_main.xml` and **replace its content** with:

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#0a0a0a">

    <!-- Splash/Loading Screen -->
    <LinearLayout
        android:id="@+id/splash_screen"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:gravity="center"
        android:orientation="vertical"
        android:background="#0a0a0a"
        android:visibility="visible">

        <ImageView
            android:layout_width="200dp"
            android:layout_height="200dp"
            android:src="@mipmap/ic_launcher"
            android:contentDescription="Dhan Suraksha Logo" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Dhan Suraksha"
            android:textColor="#D4A843"
            android:textSize="28sp"
            android:textStyle="bold"
            android:layout_marginTop="16dp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Your Trusted Partner in Precious Metal Saving"
            android:textColor="#B0B0B0"
            android:textSize="14sp"
            android:layout_marginTop="8dp" />

        <ProgressBar
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="32dp"
            android:indeterminateTint="#D4A843" />

    </LinearLayout>

    <!-- WebView -->
    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:visibility="gone" />

</RelativeLayout>
```

---

## Step 5: Update MainActivity.java

Open `app/src/main/java/com/dhansuraksha/app/MainActivity.java` and **replace its content** with:

```java
package com.dhansuraksha.app;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private LinearLayout splashScreen;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Hide the action bar for full-screen experience
        if (getSupportActionBar() != null) {
            getSupportActionBar().hide();
        }

        webView = findViewById(R.id.webView);
        splashScreen = findViewById(R.id.splash_screen);

        // Configure WebView settings
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        // Handle external links (WhatsApp, Phone calls)
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();

                // Open WhatsApp links externally
                if (url.startsWith("https://wa.me/") || url.startsWith("whatsapp://")) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                }

                // Open phone calls externally
                if (url.startsWith("tel:")) {
                    Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse(url));
                    startActivity(intent);
                    return true;
                }

                // Open external links in browser
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    if (!url.contains("dhansuraksha")) {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    }
                }

                return false;
            }
        });

        webView.setWebChromeClient(new WebChromeClient());

        // Show splash for 2 seconds, then load the website
        new Handler().postDelayed(() -> {
            splashScreen.setVisibility(View.GONE);
            webView.setVisibility(View.VISIBLE);
            webView.loadUrl("file:///android_asset/index.html");
        }, 2000);
    }

    // Handle back button — go back in WebView history
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
```

---

## Step 6: Set App Theme (Dark Status Bar)

Open `app/src/main/res/values/themes.xml` and **replace** the style with:

```xml
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.DhanSuraksha" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">#D4A843</item>
        <item name="colorPrimaryVariant">#9A7B2F</item>
        <item name="colorOnPrimary">#0a0a0a</item>
        <item name="colorSecondary">#D4A843</item>
        <item name="android:statusBarColor">#0a0a0a</item>
        <item name="android:navigationBarColor">#0a0a0a</item>
        <item name="android:windowBackground">@android:color/black</item>
    </style>
</resources>
```

---

## Step 7: Add App Icon (Optional but Recommended)

1. Right-click on `res` → **New → Image Asset**
2. Select **"Image"** as asset type
3. Browse to `5.jpeg` (the Dhan Suraksha logo)
4. Name it `ic_launcher`
5. Click **Next → Finish**

---

## Step 8: Build the APK

1. In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for the build to finish
3. Click **"locate"** in the notification to find the APK file
4. The APK will be at: `app/build/outputs/apk/debug/app-debug.apk`

---

## Step 9: Install on Your Phone

### Method A: USB (Recommended)
1. Connect your phone via USB cable
2. In Android Studio, select your phone from the device dropdown
3. Click the **▶ Run** button (green play button)
4. The app will install and open automatically on your phone

### Method B: Transfer APK Manually
1. Copy the APK file (`app-debug.apk`) to your phone
2. On your phone, open a file manager
3. Navigate to the APK file and tap to install
4. If prompted, allow **"Install from unknown sources"**

---

## ✅ Done!

Your **Dhan Suraksha** app is now installed on your Android phone with:
- 🎨 Premium gold & black design
- 💰 Savings Calculator
- 📞 One-tap WhatsApp & Call buttons
- 🛡️ All service information
- 📱 Native splash screen
- 🔙 Smooth back-button navigation

---

> **Tip:** To create a **signed release APK** for Google Play Store distribution, go to **Build → Generate Signed Bundle/APK** and follow the wizard to create a signing key.
