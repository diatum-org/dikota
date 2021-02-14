set -e

if [ "$1" == "" ]; then
  echo "usage: ipa <environment>";
  exit 1;
fi

echo "ENVIRONMENT:    ---> $1 <---"
cp src/app/environment.$1 src/app/environment.ts

cp BitmapFactory.ios.js ./node_modules/nativescript-bitmap-factory/ || {
  echo "installing dependencies"
  tns build ios > /dev/null 2> /dev/null || true
  cp BitmapFactory.ios.js ./node_modules/nativescript-bitmap-factory/ 
}

# delete 2nd line from node_modules/@nativescript/core/module.d.ts
sed -i.bak '/declare var global/d' 'node_modules/@nativescript/core/module.d.ts'

#tns run --release ios || true 
tns run ios || true 

