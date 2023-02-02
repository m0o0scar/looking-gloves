import { Crop } from 'react-image-crop';

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
  cropRegion: Crop,
  options?: DrawSourceOntoDestOptions
) => {
  const { dx = 0, dy = 0, dw = 0, dh = 0, sourceOffsetX = 0, fillEdge = false } = options || {};

  const destWidth = dw || dest.width;
  const destHeight = dh || dest.height;
  const sourceX = (cropRegion.x / 100) * source.width;
  const sourceY = (cropRegion.y / 100) * source.height;
  const sourceWidth = (cropRegion.width / 100) * source.width;
  const sourceHeight = (cropRegion.height / 100) * source.height;

  const ctx = dest.getContext('2d')!;

  if (fillEdge) {
    let edgeX = sourceOffsetX <= 0 ? 0 : source.width - 1;
    ctx.drawImage(source, edgeX, sourceY, 1, sourceHeight, dx, dy, destWidth, destHeight);
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

export const drawSourceToCanvas = (source: CanvasImageSource, width: number, height: number) => {
  const frame = document.createElement('canvas');
  frame.width = width;
  frame.height = height;

  let sw = 0,
    sh = 0;
  if (source instanceof HTMLVideoElement) {
    sw = source.videoWidth;
    sh = source.videoHeight;
  } else if (source instanceof HTMLImageElement) {
    sw = source.naturalWidth;
    sh = source.naturalHeight;
  }

  const ctx = frame.getContext('2d')!;
  ctx.drawImage(source, 0, 0, sw, sh, 0, 0, width, height);

  return frame;
};

export const drawBlobToCanvas = (blob: Blob) => {
  return new Promise<HTMLCanvasElement>((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();

    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
      URL.revokeObjectURL(url);
    };

    img.src = url;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      cleanup();
      resolve(canvas);
    };

    img.onerror = (error) => {
      cleanup();
      reject(error);
    };
  });
};

export const canvasToJpeg = (canvas: HTMLCanvasElement, quality = 0.9) => {
  return canvas.toDataURL('image/jpeg', quality);
};

export const canvasToBlob = (canvas: HTMLCanvasElement, quality = 0.9) => {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject();
      },
      'image/jpeg',
      quality
    );
  });
};
