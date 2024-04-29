interface ResizeCanvasParameters {
  entry: ResizeObserverEntry;
  canvas: HTMLCanvasElement;
}

export const createCanvas = () => {
  const canvas = document.createElement("canvas");
  return { canvas };
};

/**
 * Resize canvas
 * @param entry ResizeObserverEntry
 * @param canvas HTMLCanvasElement
 * @returns CanvasRenderingContext2D
 * @example
 * const { canvas } = createCanvas();
 * const resizeObserver = new ResizeObserver((entries) => {
 *  entries.forEach((entry) => {
 *   resizeCanvas({ entry, canvas });
 * });
 *
 * resizeObserver.observe(document.body);
 */
export const resizeCanvas = ({ entry, canvas }: ResizeCanvasParameters) => {
  const { width, height } = entry.contentRect;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  const ratio = window.devicePixelRatio > 1 ? 2 : 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
};
