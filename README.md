# Sleep Rituals02

## Description

We are building Sleep Rituals. This mobile device app is designed to prime users for sleep and the next day. There are three key components they will have a journal, breathing exercise, and a mantra meditation.

In the Good Times screen the user will respond to the question “What are some things that made you happy today?”. The user can enter as many things as they want but the must enter one before advancing to the next screen.

The journal will be in the app’s persistent memory. For the time being we will implement a journal store using the redux package. Again we want this to be persistent. In later version we may use a database.

In the breathing screen there will be a guided breathing exercise using subtle animations.

The mantra screen will play a mantra audio file while the user goes to sleep. This will consist of .mp4 files.

## ScreenFrame

This app will use a ScreenFrame component. This component will have a background design used by all screens. Then screens will be the children property. ScreenFrame will function as the name suggests – to frame the screen and provide a consistent theme and style.

This application will have a navigation style header that will display “Good Times”, “Breathing”, “ or “Mantra” depending on the screen the user is on. The user will get the sense of a wheel that scrolls from left to right, but the user cannot actually scroll the wheel. The wheel will scroll automatically as the user advances screens. The children component will handle the navigation. The ScreenFrame will handle the display of the wheel.

The screens that follow will be to the right and transparent. The current screen will be in the middle and opaque. See the docs/Figma/01GoodTimesEmpty.png for the example.

The ScreenFrame component will have a background color of #0F1015. The top of the screen will use the src/assets/images/screen-frame/IllustrationBackground.png image. The IllustrationBackground.png image will be placed once at the top of the screen. The bottom of the image will not cover the bottom of the screen. It is increasingly transparent as it goes down the screen.

## Reference Documents

### Figma Design

The docs/Figma/ has screenshots of the design for each screen.

- GoodTimes
- Breathing
- Mantra

The screens also have variations for some of the options or the way the user could make selections.

## Tech Stack

This is a TypeScript React Native Expo project created using best practicies but still maintaining the classic (navigation) structure.

### Main adjustments

- entry point of app managed by package.json main property
- modify app.json to use assets from src/assets/expo-assets

### Steps to create

1. `npx create-expo-app@latest`
2. delete all folder except `node_modules`
3. install navigation dependencies: `npm install @react-navigation/native @react-navigation/stack`
4. create `src` folder and start with app folder that will contain index.tsx and App.tsx files
5. modify package.json to have main property set to `src/app/index.tsx`

   - i.e. `"main": "src/app/index.tsx"`

6. create assets folder in the root of the project

   - place all the template assets in `src/assets/expo-assets`
   - modify app.json to use the assets from the new location

### Navigation

“screen props” approach
The typing is done using the screen props approach. See the /src/types/navigation.ts file for more details. No params are passed yet, but this is a good sandbox to test passing params.

### Run the application

#### `npm start`

#### `npm run build`

package.json has been modified to check types on build: `npm run build`

Added to package.json scripts element:

```json
   "prestart": "tsc --noEmit",
   "typecheck": "tsc --noEmit",
   "typecheck:watch": "tsc --noEmit --watch"
```
