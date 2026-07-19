# 1. Install dependencies & automatically fix version mismatches
npm install
npx expo install --check

# 2. Start the local server
npx expo start
```[cite: 1]

* **Running via Expo Go (Remote/Separate Networks):** If your test phone and PC are not on the exact same Wi-Fi network, add the tunnel flag to connect successfully:
  ```bash
  npx expo start --tunnel
  ```[cite: 1]

---

## 3. How to Build & Pre-requisites (Windows)

To compile code locally into a production `.apk` or `.aab` file, configure your system using these specific environment steps[cite: 1].

### Step A: Java 24 Pre-requisite
1. Download and install **JDK 24** (e.g., from Adoptium Eclipse Temurin or Oracle)[cite: 1].
2. Open Windows **System Environment Variables**[cite: 1].
3. Create a new System Variable:
   * **Name:** `JAVA_HOME`[cite: 1]
   * **Value:** `C:\Program Files\Java\jdk-24` (or your specific installation path)[cite: 1]
4. Find the existing `Path` variable under System variables, edit it, and append: `%JAVA_HOME%\bin`[cite: 1]

### Step B: Android SDK & Cmd-line Tools
1. **Download:** Go to the Android Studio downloads page, scroll down to *Command line tools only*, and download the Windows zip package[cite: 1].
2. **Extract Directory Structure:** Extract the contents into `C:\Android\SDK`[cite: 1]. Inside that directory, create a subfolder path: `cmdline-tools\latest`[cite: 1]. Move your extracted files (`bin`, `lib`, etc.) inside that `latest` folder[cite: 1].
   * *Target Path Check:* `C:\Android\SDK\cmdline-tools\latest\bin`[cite: 1]
3. **Environment Setup:** 
   * Create a new System Variable named `ANDROID_HOME` with the value `C:\Android\SDK`[cite: 1].
   * Edit your system `Path` variable and add these two entries:
     * `%ANDROID_HOME%\cmdline-tools\latest\bin`[cite: 1]
     * `%ANDROID_HOME%\platform-tools`[cite: 1]
4. **Licenses & Packages:** Open a fresh command prompt/PowerShell window and run:
   ```cmd
   sdkmanager --licenses
   # Type 'y' to accept all agreements
   
   sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
   ```[cite: 1]

### Step C: Trigger Build Command
Once the configuration above is active, build and execute your release package on your device:

```bash
npx expo run:android --variant release
```[cite: 1]

---

## 4. Maintenance

```bash
# Check code style and common project errors
npx expo lint

# Run project unit tests
npm test
```[cite: 1]