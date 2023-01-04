export const loadImage = (source: string | File) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const isFile = source instanceof File;
    const url = isFile ? URL.createObjectURL(source) : source;

    const cleanup = () => {
      if (isFile) URL.revokeObjectURL(url);
      image.onload = null;
      image.onerror = null;
    };

    const image = new Image();
    image.onload = () => {
      cleanup();
      resolve(image);
    };
    image.onerror = (error) => {
      cleanup();
      reject(error);
    };
    image.src = url;
  });
};
