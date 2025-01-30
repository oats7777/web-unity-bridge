type StatusEventMap = {
  progress: number;
  loaded: void;
};

type EventCallback<T extends keyof StatusEventMap> = (args: StatusEventMap[T]) => void;

class StatusEventMethod {
  private events: {
    eventName: keyof StatusEventMap;
    callback: EventCallback<keyof StatusEventMap>;
  }[] = [];

  addEventListener = <T extends keyof StatusEventMap>(eventName: T, callback: EventCallback<T>) => {
    if (this.events.some(event => event.eventName === eventName && event.callback === callback)) {
      return;
    }

    this.events.push({
      eventName,
      callback: callback as EventCallback<keyof StatusEventMap>,
    });
  };

  removeEventListener = <T extends keyof StatusEventMap>(eventName: T, callback: EventCallback<T>) => {
    this.events = this.events.filter(event => event.eventName !== eventName || event.callback !== callback);
  };

  emit = <T extends keyof StatusEventMap>(eventName: T, arg: StatusEventMap[T]) => {
    this.events.forEach(event => {
      if (event.eventName === eventName) {
        event.callback(arg);
      }
    });
  };

  destroyEventListener = () => {
    this.events = [];
  };
}

export { StatusEventMethod };
export type { StatusEventMap, EventCallback };
