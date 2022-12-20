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

const calculateColorDifference = (
  frame1: HTMLCanvasElement,
  frame2: HTMLCanvasElement,
  offset: number
) => {
  const ctx1 = frame1.getContext('2d')!;
  const ctx2 = frame2.getContext('2d')!;
  const imageData1 = ctx1.getImageData(0, 0, frame1.width - offset, frame1.height);
  const imageData2 = ctx2.getImageData(offset, 0, frame2.width - offset, frame2.height);
  const data1 = imageData1.data;
  const data2 = imageData2.data;
  let difference = 0;
  for (let i = 0; i < data1.length; i += 4) {
    difference += Math.abs(data1[i] - data2[i]);
    difference += Math.abs(data1[i + 1] - data2[i + 1]);
    difference += Math.abs(data1[i + 2] - data2[i + 2]);
  }
  return difference;
};

export const framesAreLeftToRight = (frames: HTMLCanvasElement[]) => {
  // TODO maybe scale down the frames (to 100px x 100px?) to speed up the calculation?
  const diff0 = calculateColorDifference(frames[0], frames[1], 0);
  const diff1 = calculateColorDifference(frames[0], frames[1], 1);
  return diff0 < diff1;
};
