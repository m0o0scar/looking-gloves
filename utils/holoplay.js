import * as HoloPlayCore from 'holoplay-core';
import { COLS, ROWS } from './constant';

const TAG = '[HoloPlay]';

// https://docs.lookingglassfactory.com/core/corejs/api/client
const client = new HoloPlayCore.Client(
  // init callback
  (msg) => {
    console.log(TAG, 'Init callback, calibration values:', msg);
  },
  // error callback
  (err) => {
    console.error(TAG, 'Error creating HoloPlay client:', err);
  },
  // close callback
  () => {
    console.log(TAG, 'HoloPlay client closed');
  },
  false, // debug
  'com.spoon.lookingglassutils', // app id
);

export const showQuiltImage = async (quiltInCanvas) => {
  const frameWidth = quiltInCanvas.width / COLS;
  const frameHeight = quiltInCanvas.height / ROWS;
  const aspect = frameWidth / frameHeight;

  const imageData = quiltInCanvas.toDataURL('image/jpeg', 0.9).replace(/^data:image\/jpeg;base64,/, '')
  const binaryData = new Uint8Array(atob(imageData).split('').map(c => c.charCodeAt(0)));

  const showCmd = new HoloPlayCore.ShowMessage(
    { vx: COLS, vy: ROWS, vtotal: COLS * ROWS, aspect },
    binaryData,
    0
  );
  console.log(TAG, 'ShowMessage', showCmd);
  return client.sendMessage(showCmd);
}