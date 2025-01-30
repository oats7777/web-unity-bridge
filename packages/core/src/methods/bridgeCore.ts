import { LOAD_STATUS, type UnityLoaderStatus } from '@/config/unity-loader-status';
import { CanvasMethod } from '@/methods/canvas';
import EventMethod from '@/methods/event';
import { ScriptLoaderMethod } from '@/methods/scriptLoader';
import { EventCallback, StatusEventMap, StatusEventMethod } from '@/methods/statusEvent';
import type { UnityConfig } from '@/types/unity-config';
import type { UnityInstance } from '@/types/unity-instance';
import { isBrowserEnvironment } from '@/utils/browser';

class BridgeCore {
  private scriptLoader: ScriptLoaderMethod;
  private config: UnityConfig;
  private canvasMethod: CanvasMethod | null = null;
  private event: EventMethod;
  private statusEvent: StatusEventMethod;
  private root: HTMLElement | HTMLCanvasElement | OffscreenCanvas;

  public status: UnityLoaderStatus = LOAD_STATUS.Loading;
  public progression = 0;
  public unityInstance: UnityInstance | null = null;
  public removeEventListener: EventMethod['removeEventListener'];
  public addEventListener: EventMethod['addEventListener'];

  constructor(root: HTMLElement | HTMLCanvasElement | OffscreenCanvas, config: UnityConfig) {
    if (isBrowserEnvironment !== true) {
      throw new Error('This method can only be used in the browser environment');
    }
    this.root = root;
    this.config = config;
    this.event = new EventMethod();
    this.scriptLoader = new ScriptLoaderMethod(config);
    this.statusEvent = new StatusEventMethod();
    this.scriptLoader.subscribe(this); // Add 'this' as an argument
    this.scriptLoader.load();
    if (this.root instanceof HTMLElement) {
      this.canvasMethod = new CanvasMethod(this.root);
    }

    this.removeEventListener = this.event.removeEventListener;
    this.addEventListener = this.event.addEventListener;
  }

  update = (status: UnityLoaderStatus) => {
    if (status === 'Loaded') this.loadUnity();
  };

  private loadUnity = async () => {
    this.unityInstance = await window.createUnityInstance(
      this.canvasMethod?.canvas ?? (this.root as HTMLCanvasElement),
      this.config,
      this.onProgress
    );
  };

  private onProgress = (progression: number) => {
    this.progression = progression;
    this.statusEvent.emit('progress', progression);

    if (progression === 1) {
      this.statusEvent.emit('loaded', undefined);
    }
  };

  public statusAddEventListener = <T extends keyof StatusEventMap>(eventName: T, callback: EventCallback<T>) => {
    this.statusEvent.addEventListener(eventName, callback);
  };

  public statusRemoveEventListener = <T extends keyof StatusEventMap>(
    eventName: T,
    callback: (arg: StatusEventMap[T]) => void
  ) => {
    this.statusEvent.removeEventListener(eventName, callback);
  };

  public unmount = () => {
    this.canvasMethod?.unmount();
    this.scriptLoader.remove();
    this.event.destroyEventListener();
    this.statusEvent.destroyEventListener();
    this.unityInstance?.Quit();
  };
}

export { BridgeCore };
