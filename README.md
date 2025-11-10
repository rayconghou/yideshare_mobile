This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Prerequisites

1. **Backend Server**: The mobile app requires a backend server for CAS authentication. Make sure to start it before testing authentication features.

   ```sh
   # Install backend dependencies (first time only)
   cd backend
   npm install
   
   # Start the backend server
   npm start
   ```

   The backend will run on `http://localhost:3001`. Verify it's running by visiting `http://localhost:3001/health`.

2. **iOS Configuration**: For iOS development, ensure `Info.plist` has proper App Transport Security settings (already configured). See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for details.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## Common Issues

### Network Request Failed Error

If you encounter "Network request failed" errors when trying to authenticate:

1. **Ensure backend server is running**: `cd backend && npm start`
2. **Check iOS Info.plist configuration**: The `Info.plist` must have `NSExceptionDomains` for localhost to allow HTTP connections
3. **Verify backend URL**: Check `src/config/backend.ts` matches your setup

**iOS Info.plist Configuration Required:**
The `ios/YideShareMobile/Info.plist` file must include `NSExceptionDomains` for localhost:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
    <key>NSAllowsLocalNetworking</key>
    <true/>
    <key>NSExceptionDomains</key>
    <dict>
        <key>localhost</key>
        <dict>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <true/>
            <key>NSIncludesSubdomains</key>
            <true/>
        </dict>
        <key>127.0.0.1</key>
        <dict>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <true/>
        </dict>
    </dict>
</dict>
```

### MFA Provider Unavailable Error

If you see "MFA Provider Unavailable" when trying to authenticate with Yale CAS:

**Problem**: The Yale CAS test environment has MFA (Multi-Factor Authentication) enabled, but the MFA provider service is unavailable. This is a server-side issue with Yale's test CAS environment.

**Solutions**:

1. **Switch to Production CAS** (Recommended for local development):
   ```bash
   cd backend
   # Create .env file or set environment variable
   echo "YALE_CAS_BASE_URL=https://secure.its.yale.edu/cas" > .env
   npm start
   ```
   
   **Note**: Production CAS may also have restrictions on localhost service URLs. If you get a "Service not authorized" error, you may need to use a public URL (see option 3).

2. **Test CAS Connectivity**:
   ```bash
   curl http://localhost:3001/api/test-cas
   ```
   This will show if the CAS server is reachable and if there's an MFA error.

3. **Use a Public URL for Local Development**:
   - Use a tool like [ngrok](https://ngrok.com/) to create a public tunnel to your local backend
   - Update the backend to use the ngrok URL as the service URL
   - This allows CAS to redirect back to your local server

4. **Contact Yale IT**:
   - Request to register your localhost service URL with the test CAS environment
   - Or request MFA to be disabled for your test service URL

**For more details**, see `backend/README.md` section on "CAS Configuration" and "MFA Provider Unavailable Error".

### iOS Build Failed (Error Code 65)

If you encounter "Failed to build ios project. xcodebuild exited with error code '65'" or see errors about missing script files:

**Solution - Clean and Reinstall Pods:**

1. **Remove old Pods installation:**
   ```sh
   cd ios
   rm -rf Pods Podfile.lock
   ```

2. **Reinstall CocoaPods dependencies:**
   ```sh
   export LANG=en_US.UTF-8  # Fixes encoding issues
   bundle exec pod install
   ```

3. **Clean the Xcode build:**
   ```sh
   xcodebuild clean -workspace YideShareMobile.xcworkspace -scheme YideShareMobile
   ```

4. **Rebuild the app:**
   ```sh
   cd ..
   npm run ios
   ```

**Why this happens:**
CocoaPods generates build scripts that can become corrupted or point to incorrect paths. Removing and reinstalling Pods regenerates these scripts with the correct configuration.

**If the issue persists:**
- Check that `REACT_NATIVE_PATH` in Xcode build settings is set to `${SRCROOT}/../node_modules/react-native` (or `${PODS_ROOT}/../../node_modules/react-native`)
- Verify Node.js is accessible: `which node`
- Ensure you're using the correct React Native version
- Try cleaning Xcode DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData`

## Development Workflow

### Starting Everything

1. **Terminal 1 - Backend Server**:
   ```sh
   npm run backend
   # or for development with auto-reload:
   npm run backend:dev
   ```

2. **Terminal 2 - Metro Bundler**:
   ```sh
   npm start
   ```

3. **Terminal 3 - Run iOS App**:
   ```sh
   npm run ios
   ```

### Quick Commands

- `npm run backend` - Start backend server
- `npm run backend:dev` - Start backend with auto-reload
- `npm start` - Start Metro bundler
- `npm run ios` - Build and run iOS app
- `npm run android` - Build and run Android app

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
