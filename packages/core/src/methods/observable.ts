interface Observer<T> {
  update: (data: T) => void;
}

class Observable<T> {
  private observers: Array<Observer<T>> = [];

  public subscribe(observer: Observer<T>): void {
    this.observers.push(observer);
  }

  public unsubscribe(observer: Observer<T>): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  protected notifyObservers(data: T): void {
    this.observers.forEach((observer) => observer.update(data));
  }
}

export { Observable };
