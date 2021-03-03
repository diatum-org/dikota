set -e

if [ "$1" == "" ]; then
  echo "usage: apk <environment>";
  exit 1;
fi

echo "building:    ---> $1 <---"
cp src/app/environment.$1 src/app/environment.ts

echo '<resources><string name="app_name">Dikota</string><string name="title_activity_kimera">Dikota</string></resources>' > platforms/android/app/src/main/res/values/strings.xml || {
  tns build android --release --key-store-path dikota.jks --key-store-password mirage --key-store-alias Dikota --key-store-alias-password mirage
  echo '<resources><string name="app_name">Dikota</string><string name="title_activity_kimera">Dikota</string></resources>' > platforms/android/app/src/main/res/values/strings.xml 
}
tns build android --release --key-store-path dikota.jks --key-store-password mirage --key-store-alias Dikota --key-store-alias-password mirage
mv ./platforms/android/app/build/outputs/apk/release/app-release.apk ~/dikota.apk

