import { type UnityEventParameters } from "../types/unity-event-parameters";

interface EventListener {
  eventName: string;
  callback: (
    ...parameters: Array<UnityEventParameters>
  ) => UnityEventParameters;
}

class EventMethod {
  private eventListeners: Array<EventListener> = [];

  constructor() {
    this.addEventListener = this.addEventListener.bind(this);
    this.removeEventListener = this.removeEventListener.bind(this);
    this.dispatchUnityWebGLEvent = this.dispatchUnityWebGLEvent.bind(this);

    window.dispatchUnityWebGLEvent = this.dispatchUnityWebGLEvent;
  }

  private dispatchUnityWebGLEvent(
    eventName: string,
    ...parameters: Array<UnityEventParameters>
  ) {
    let returnValue: UnityEventParameters = undefined;
    this.eventListeners.forEach((eventListener) => {
      if (eventListener.eventName === eventName) {
        returnValue = eventListener.callback(...parameters);
      }
    });
    return returnValue;
  }

  addEventListener({ eventName, callback }: EventListener) {
    this.eventListeners = [
      ...this.eventListeners,
      {
        eventName,
        callback,
      },
    ];
  }

  removeEventListener({ eventName, callback }: EventListener) {
    this.eventListeners.filter((eventListener) => {
      return (
        eventListener.eventName !== eventName &&
        eventListener.callback !== callback
      );
    });
  }

  destroyEventListener() {
    this.eventListeners = [];
  }
}

export default EventMethod;
