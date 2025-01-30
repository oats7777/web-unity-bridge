import { createCanvas, resizeCanvas } from '@/utils/canvas';

const unityCanvasIdPrefix = 'unity-webgl-canvas';

class CanvasMethod {
  private resizeObserver;
  private root: HTMLElement;

  public canvas;

  constructor(root: HTMLElement) {
    const { canvas } = createCanvas();
    this.root = root;
    this.canvas = canvas;
    this.resizeObserver = new ResizeObserver(this.resizeCanvas);
    this.canvas.id = unityCanvasIdPrefix;
    this.resizeObserver.observe(this.root);
    this.root.appendChild(this.canvas);
  }

  public draw = () => {
    window.requestAnimationFrame(this.draw);
  };

  private resizeCanvas = (entries: Array<ResizeObserverEntry>) => {
    const { canvas } = this;
    for (const entry of entries) {
      resizeCanvas({ entry, canvas });
    }
    window.requestAnimationFrame(this.draw);
  };

  public unmount = () => {
    this.resizeObserver.unobserve(this.root);
    this.root.removeChild(this.canvas);
  };
}

export { CanvasMethod };
