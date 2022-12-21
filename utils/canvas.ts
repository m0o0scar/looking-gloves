export interface DrawSourceOntoDestOptions {
  dx?: number;
  dy?: number;
  dw?: number;
  dh?: number;
  sourceOffsetX?: number;
  fillEdge?: boolean;
}

export const drawSourceOntoDest = (
  source: HTMLCanvasElement,
  dest: HTMLCanvasElement,
  options?: DrawSourceOntoDestOptions
) => {
  const { dx = 0, dy = 0, dw = 0, dh = 0, sourceOffsetX = 0, fillEdge = false } = options || {};

  const destWidth = dw || dest.width;
  const destHeight = dh || dest.height;
  const destRatio = destWidth / destHeight;
  const sourceRatio = source.width / source.height;

  // calculate which part from the source to draw onto dest
  let sourceX, sourceY, sourceWidth, sourceHeight;
  if (sourceRatio > destRatio) {
    sourceHeight = source.height;
    sourceWidth = sourceHeight * destRatio;
    sourceX = (source.width - sourceWidth) / 2;
    sourceY = 0;
  } else {
    sourceWidth = source.width;
    sourceHeight = sourceWidth / destRatio;
    sourceX = 0;
    sourceY = (source.height - sourceHeight) / 2;
  }

  const ctx = dest.getContext('2d')!;

  if (fillEdge) {
    ctx.drawImage(
      source,
      sourceOffsetX <= 0 ? 0 : source.width - 1,
      0,
      1,
      source.height,
      dx,
      dy,
      destWidth,
      destHeight
    );
  }

  ctx.drawImage(
    source,
    sourceX + sourceOffsetX,
    sourceY,
    sourceWidth,
    sourceHeight,
    dx,
    dy,
    destWidth,
    destHeight
  );
};
