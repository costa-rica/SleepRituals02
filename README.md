# TypeScript React Native 01 Classic

## Description

This is my classic TypeScript React Native Expo project created using best practicies but still maintaining the classic structure of the project - I learned to build a mobile app using plain JavaScript.

### Main adjustments

- entry point of app managed by package.json main property

## Steps to create

1. `npx create-expo-app@latest`
2. delete all folder except `node_modules`
3. create `src` folder and start with app folder that will contain index.tsx and App.tsx files
4. modify package.json to have main property set to `src/app/index.tsx`

   - i.e. `"main": "src/app/index.tsx"`

5. create assets folder in the root of the project

- place all the template assets in `src/assets/expo-assets`
- modify app.json to use the assets from the new location
