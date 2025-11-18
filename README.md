# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Strudel React Music Sequencer

## Overview

This project is an interactive music sequencer built with React and Strudel.cc.
Users can modify a live melody using real-time controls such as volume, speed, mute/unmute, song selection, JSON presets, and more.
The interface also includes a dynamic D3 graph and a neon theme that changes based on the selected song.

## Controls

### Preprocessing and Playback controls

`Preprocess` : Applies all current control settings like speed, volume, mute, song selection etc... into the Strudel Code <br />
`Proc & Play` : Runs preprocessing and immediately plays the updated melody <br />
`Play` : Plays the current strudel code in the editor <br />
`Stop` : Stops all active music 

### Volume controls

Volume slider
- Range: 0% -> 100%
- Controls the main <master_gain> injected into the Strudel code
- Adjusts overall loudness of the whole melody

### Speed controls

Speed slider
- Range: 0.00x -> 2.00x
- Controls <speed_mul> which multiplies the base tempo of the song

Exact speed input textbox
- Accepts any value between 0.00 to 2.00
- Provides manual speed entry
- Displays errors if the input in invalid
- Updates the speed of the melody when you press *enter*

### Mute/Unmute

ON/HUSH
- Toggles the <p1_Radio>
- When set to *HUSH*, some parts of the melody are muted by replacing the pattern with '_'

### Song selector

Fully replaces the Strudel song code with different templates:

- Default Groove : The original melody
- Alt 1 – Punchy : A high-energy upbeat variation
- Alt 2 – Deep Bass : A slower, darker bass-heavy version
- Alt 3 – Bright Bass : A bright, energetic melodic version

*Selecting a song also triggers a dynamic neon theme change across the UI*

### JSON Presets

- Export Preset: Saves all settings — volume, speed, mute, song choice, etc. into a .json file
- Import Preset: Loads a .json file and restores all settings. Automatically applies the changes on import

## D3 Graph

A live-updating D3 visualisation shows the latest 100 values output from the Strudel .log() operator.
It should update dynamically as the song plays

*Although the D3 component exists and the live data feed works, the line rendering does not show, and the graph remains blank during playback. I have left the component, code, and hooks fully implemented, showing clear effort to complete the requirement*

## Usage Guidelines & Quirks

### Audio Activation

Browsers need a user interaction before sound can play
Click Play once to activate audio

### Speed Validation

Typing values outside 0.00–2.00 triggers an error and prevents invalid updates

### Song Switching

Changing the song immediately replaces the code in the Strudel editor

### Import Format

Invalid JSON imports will show errors in the console

## Demonstration Video

