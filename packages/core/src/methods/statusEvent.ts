type StatusEventMap = {
  progress: number;
  loaded: void;
};

type StatusEventCallback<T = any> = (arg: T) => void;

interface StatusEventListener<T = any> {
  eventName: keyof StatusEventMap;
  callback: StatusEventCallback<T>;
}

class StatusEvent {
  private eventListeners: Array<StatusEventListener<any>> = [];

  addEventListener = <T extends keyof StatusEventMap>(
    eventName: T,
    callback: StatusEventCallback<StatusEventMap[T]>
  ) => {
    this.eventListeners.push({
      eventName,
      callback,
    });
  };

  removeEventListener = <T extends keyof StatusEventMap>(
    eventName: T,
    callback: StatusEventCallback<StatusEventMap[T]>
  ) => {
    this.eventListeners = this.eventListeners.filter(eventListener => {
      return eventListener.eventName !== eventName || eventListener.callback !== callback;
    });
  };

  emit = <T extends keyof StatusEventMap>(eventName: T, arg: StatusEventMap[T]) => {
    this.eventListeners.forEach(eventListener => {
      if (eventListener.eventName === eventName) {
        eventListener.callback(arg);
      }
    });
  };

  destroyEventListener = () => {
    this.eventListeners = [];
  };
}

export { StatusEvent, type StatusEventMap };
