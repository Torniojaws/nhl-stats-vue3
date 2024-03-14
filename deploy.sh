#!/usr/bin/env bash
npm run build
cd dist/
cp -r * ../../Torniojaws.github.io/
cd ../../Torniojaws.github.io/
git add .
git commit -m "Latest"
git push
cd ..
cd nhl-stats-vue3/
