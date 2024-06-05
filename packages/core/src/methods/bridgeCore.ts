import {
  LOAD_STATUS,
  type UnityLoaderStatus,
} from "../config/unity-loader-status";
import { isBrowserEnvironment } from "../utils/browser";
import EventMethod from "./event";
import { ScriptLoaderMethod } from "./scriptLoader";
import { CanvasMethod } from "./canvas";
import { StatusEvent, type StatusEventMap } from "./statusEvent";
import type { UnityInstance } from "../declarations/unity-instance";
import type { UnityConfig } from "../types/unity-config";

class BridgeCore {
  private scriptLoader: ScriptLoaderMethod;
  private config: UnityConfig;
  private canvasMethod: CanvasMethod;
  private event: EventMethod;
  private statusEvent: StatusEvent; // Use StatusEvent

  public status: UnityLoaderStatus = LOAD_STATUS.Loading;
  public progression = 0;
  public unityInstance: UnityInstance | null = null;
  public removeEventListener: EventMethod["removeEventListener"];
  public addEventListener: EventMethod["addEventListener"];

  constructor(root: HTMLElement, config: UnityConfig) {
    if (isBrowserEnvironment !== true) {
      throw new Error(
        "This method can only be used in the browser environment",
      );
    }
    this.config = config;
    this.event = new EventMethod();
    this.scriptLoader = new ScriptLoaderMethod(config);
    this.statusEvent = new StatusEvent(); // Initialize StatusEvent
    this.scriptLoader.subscribe(this); // Add 'this' as an argument
    this.scriptLoader.load();
    this.canvasMethod = new CanvasMethod(root);
    this.loadUnity = this.loadUnity.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.removeEventListener = this.event.removeEventListener;
    this.addEventListener = this.event.addEventListener;
    this.statusAddEventListener = this.statusAddEventListener.bind(this);
    this.statusAddEventListener = this.statusRemoveEventListener.bind(this);
  }

  update(status: UnityLoaderStatus) {
    if (status === "Loaded") this.loadUnity();
  }

  private async loadUnity() {
    this.unityInstance = await window.createUnityInstance(
      this.canvasMethod.canvas,
      this.config,
      this.onProgress,
    );
  }

  private onProgress(progression: number) {
    this.progression = progression;
    this.statusEvent.emit("progress", progression);
    if (progression === 1) {
      this.statusEvent.emit("loaded", undefined);
    }
  }

  public statusAddEventListener<T extends keyof StatusEventMap>(
    eventName: T,
    callback: (arg: StatusEventMap[T]) => void,
  ) {
    this.statusEvent.addEventListener(eventName, callback);
  }

  public statusRemoveEventListener<T extends keyof StatusEventMap>(
    eventName: T,
    callback: (arg: StatusEventMap[T]) => void,
  ) {
    this.statusEvent.removeEventListener(eventName, callback);
  }

  public unmount() {
    this.canvasMethod.unmount();
    this.scriptLoader.remove();
    this.event.destroyEventListener();
    this.statusEvent.destroyEventListener();
    this.unityInstance?.Quit();
  }
}

export { BridgeCore };
