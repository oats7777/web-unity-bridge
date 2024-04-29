import {
  LOAD_STATUS,
  type UnityLoaderStatus,
} from "../config/unity-loader-status";
import { isBrowserEnvironment } from "../utils/browser";
import EventMethod from "./event";
import { ScriptLoaderMethod } from "./scriptLoader";
import { CanvasMethod } from "./canvas";
import type { UnityInstance } from "../declarations/unity-instance";
import type { UnityConfig } from "../types/unity-config";

class UnityMethod {
  private scriptLoader: ScriptLoaderMethod;
  private config: UnityConfig;
  private canvasMethod: CanvasMethod;
  private event: EventMethod;

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
    this.scriptLoader.subscribe(this); // Add 'this' as an argument
    this.scriptLoader.load();
    this.canvasMethod = new CanvasMethod(root);
    this.loadUnity = this.loadUnity.bind(this);
    this.onProgress = this.onProgress.bind(this);

    this.removeEventListener = this.event.removeEventListener;
    this.addEventListener = this.event.addEventListener;
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
  }
}

export { UnityMethod };
