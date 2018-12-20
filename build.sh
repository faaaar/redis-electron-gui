#/bin/sh
rm -rf dist
cp -R app dist
cd web/
npm run build
cd ../
cp -R web/build/* dist/
rm -rf web/build
cd dist
NODE_ENV=production node_modules/.bin/electron-builder
