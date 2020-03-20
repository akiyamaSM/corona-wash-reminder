### once: 

> keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysi ze 2048 -validity 10000

### make app support android 5 and above instead of kitkat (google play requirement)

> ionic cordova platform remove android

> ionic cordova platform add android@8.0.0

# At every prod build: 
> ionic cordova build --release android

> cp ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk android-release-unsigned.apk

> jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-release-unsigned.apk alias_name m²²l²²

> ~/AppData/Local/Android/Sdk/build-tools/29.0.3/zipalign.exe -v 4 android-release-unsigned.apk handwashreminder.apk

> rm android-release-unsigned.apk

> mkdir ./_releases/1.0.x

> mv handwashreminder.apk ./_releases/1.0.x/handwashreminder.apk
