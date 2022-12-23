export const loadImage = (source: string | File) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const isFile = source instanceof File;
    const url = isFile ? URL.createObjectURL(source) : source;

    const image = new Image();
    image.onload = () => {
      if (isFile) URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = reject;
    image.src = url;
  });
};
