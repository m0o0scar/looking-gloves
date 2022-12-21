export const getImageFromClipboard = async () => {
  // find the first image form clipboard
  const items = await navigator.clipboard.read();
  for (const item of items) {
    for (const type of item.types) {
      if (type.startsWith('image/')) {
        return item.getType(type);
      }
    }
  }
  return null;
};
