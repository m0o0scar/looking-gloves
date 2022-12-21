import * as HoloPlayCore from 'holoplay-core';
import { toast } from 'react-toastify';
import { COLS, ROWS } from './constant';

const TAG = '[HoloPlay]';

const connect = async (options) => {
  return new Promise((resolve, reject) => {
    // https://docs.lookingglassfactory.com/core/corejs/api/client
    const client = new HoloPlayCore.Client(
      // init callback
      (msg) => {
        console.log(TAG, 'Init callback', msg);
        if (msg.devices.length > 0) {
          resolve(client);
        }
        else {
          !options?.silent && toast.error('No Looking Glass device found');
          reject(new Error('No device found'));
        }
      },
      // error callback
      (error) => {
        !options?.silent && toast.error('Unable to show hologram on Looking Glass');
        console.error(TAG, 'Error callback', error);
        reject(error);
      },
      // close callback
      () => console.log(TAG, 'HoloPlay client closed'),
      false, // debug
      'com.spoon.lookingglassutils', // app id
    );
  });
}

export const showQuiltImage = async (quiltInCanvas, options) => {
  try {
    const client = await connect(options);

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
    await client.sendMessage(showCmd);

    client.disconnect();
  } catch (error) {
    console.error(TAG, 'error', error);
  }
}