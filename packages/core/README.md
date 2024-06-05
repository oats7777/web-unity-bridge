# @web-unity-bridge/core

@web-unity-bridge/core is a JavaScript library designed to integrate Unity games and experiences seamlessly into web environments. This library provides a structured way to load and interact with Unity instances within a web page, handling script loading, canvas rendering, and event management.

This project was inspired by the [react-unity-webgl](https://github.com/jeffreylanters/react-unity-webgl)
 library, which facilitates the integration of Unity with React applications. We have adapted and extended its principles to create a more tailored solution for our specific use cases in web environments.

## Features

- Script Loading: Dynamically load and manage Unity scripts.
- Canvas Rendering: Automate the setup of a canvas for - Unity rendering.
- Event Management: Facilitate adding and removing event listeners.
- Progress Tracking: Monitor and report loading progression of the Unity instance.

## Install

```bash
npm install @web-unity-bridge/core
```

## Usage

To use @web-unity-bridge/core, follow these steps:

### 1. Set Up Configuration

Create a configuration object for your Unity instance specifying necessary parameters like the path to the Unity build.

```javascript
const unityConfig = {
  loaderUrl: "Build/unity.loader.js",
  dataUrl: "Build/unity.data",
  frameworkUrl: "Build/unity.framework.js",
  codeUrl: "Build/unity.wasm",
};
```

### 2. Initialize UnityMethod

Instantiate UnityMethod with a target HTML element and the Unity configuration.

```javascript
import BridgeCore from '@web-unity-bridge/core';

const unityContainer = document.getElementById("unity-div");
const bridgeCore = new BridgeCore(unityContainer, unityConfig);
```

### 3. Event Handling

Add event listeners to handle custom events or loading progress.

```javascript
bridgeCore.statusAddEventListener("loaded", () => {
  console.log("Unity loaded successfully!");
});

bridgeCore.statusAddEventListener("progress", (progress) => {
  console.log(`Loading progress: ${progress}%`);
});
```

### 4. Interacting with Unity

Use the provided methods to interact with the Unity instance as needed.

```javascript
// Example method to start a game
function startGame() {
  bridgeCore.unityInstance.SendMessage('GameManager', 'Start');
}
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on our GitHub repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
