export const imagesToVideo = (images: HTMLCanvasElement[]) => {
  return new Promise<Blob>((resolve) => {
    // canvas for drawing each frame
    const canvas = document.createElement('canvas');
    canvas.width = images[0].width;
    canvas.height = images[0].height;
    const ctx = canvas.getContext('2d')!;

    // media recorder for recording each frame into a video
    const chunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(canvas.captureStream());

    // schedule drawing each frame
    let i = 0;
    const drawFrame = () => {
      ctx.drawImage(images[i], 0, 0);
      if (i === images.length - 1) {
        mediaRecorder.stop();
      } else {
        i++;
        requestAnimationFrame(drawFrame);
      }
    };

    // when the video is ready, resolve the promise
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      resolve(blob);
    };

    // collect each frame into chunks
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    // start recording
    mediaRecorder.start();
    drawFrame();
  });
};
