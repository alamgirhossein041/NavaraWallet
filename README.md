


![logo](https://user-images.githubusercontent.com/81867914/203579974-7da9fc22-677b-41b9-957a-dc05db79cb23.svg)
# Navara Wallet
 ### Prerequisites

- [Node.js > 12](https://nodejs.org) and yarn (Recommended: Use yarn `npm install --global yarn`)
- [Watchman](https://facebook.github.io/watchman)
- [Xcode > 12](https://developer.apple.com/xcode)z
- [Cocoapods 1.10.1](https://cocoapods.org)
- [JDK > 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [Android Studio and Android SDK](https://developer.android.com/studio)

### Building Locally
####  Clone this repo:
 ```
    git clone https://github.com/NavaraWallet/Navara-Wallet.git
    cd Navara-Wallet
  ```
####  Install dependencies:

```
yarn install
cd ios && pod install && cd .. # install pods for iOS
```
##### Recommended
You should use [Android Studio](https://developer.android.com/studio) or [Xcode](https://developer.apple.com/xcode) to run the app.
- Start metro server 
```bash

yarn start

```
- Android

Open `android` folder with `Android Studio` and run.

- Ios

Open `ios` folder with `Xcode` and run.


##### Android
```bash

yarn android

```

##### iOS
```bash

yarn ios

```
