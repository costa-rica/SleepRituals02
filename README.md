# TypeScript React Native 01 Classic

## Description

This is my classic TypeScript React Native Expo project created using best practicies but still maintaining the classic (navigation) structure of the project - I learned to build a mobile app using plain JavaScript.

### Main adjustments

- entry point of app managed by package.json main property
- modify app.json to use assets from src/assets/expo-assets

## Steps to create

1. `npx create-expo-app@latest`
2. delete all folder except `node_modules`
3. install navigation dependencies: `npm install @react-navigation/native @react-navigation/stack`
4. create `src` folder and start with app folder that will contain index.tsx and App.tsx files
5. modify package.json to have main property set to `src/app/index.tsx`

   - i.e. `"main": "src/app/index.tsx"`

6. create assets folder in the root of the project

   - place all the template assets in `src/assets/expo-assets`
   - modify app.json to use the assets from the new location

## Navigation

“screen props” approach
The typing is done using the screen props approach. See the /src/types/navigation.ts file for more details. No params are passed yet, but this is a good sandbox to test passing params.

## Run the application

package.json has been modified to check types on build: `npm run build`

Added to package.json scripts element:

```json
   "prestart": "tsc --noEmit",
   "typecheck": "tsc --noEmit",
   "typecheck:watch": "tsc --noEmit --watch"
```
