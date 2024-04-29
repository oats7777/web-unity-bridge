import type { UnityEventParameters } from '../types/unity-event-parameters';
import type { UnityInstance } from './unity-instance';
import type { UnityArguments } from '../types/unity-arguments';

declare global {
  /**
   * Creates a new UnityInstance.
   * @param canvasHtmlElement The target html canvas element.
   * @param arguments The arguments needed to load Unity.
   * @param onProgress The on progress event listener.
   * @returns A promise resolving when instantiated successfully.
   */
  function createUnityInstance(
    canvasHtmlElement: HTMLCanvasElement,
    arguments: UnityArguments,
    onProgress?: (progression: number) => void
  ): Promise<UnityInstance>;

  function dispatchUnityWebGLEvent(
    eventName: string,
    ...parameters: Array<UnityEventParameters>
  );

  interface Window {
    createUnityInstance: typeof createUnityInstance;
    dispatchUnityWebGLEvent: typeof dispatchUnityWebGLEvent;
  }
}
