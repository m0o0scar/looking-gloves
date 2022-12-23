import * as HoloPlayCore from 'holoplay-core';
import { toast } from 'react-toastify';
import { COLS } from './constant';

const TAG = '[HoloPlay Service]';

/**
 * @typedef {object} HoloPlayClientOptions
 * @property {boolean} [silent] - if true, no toast will be shown in case of error
 */

class HoloPlayClient {
  #client = null;

  /**
   * connect to Looking Glass Bridge service
   * @param {HoloPlayClientOptions} [options]
   */
  #connect = async (options) => {
    if (this.#client) return this.#client;

    return new Promise((resolve, reject) => {
      // https://docs.lookingglassfactory.com/core/corejs/api/client
      this.#client = new HoloPlayCore.Client(
        // init callback
        (msg) => {
          console.log(TAG, 'Init callback', msg);
          resolve(this.#client);
        },
        // error callback
        (error) => {
          !options?.silent && toast.error('Unable to connect to Looking Glass Bridge');
          console.error(TAG, 'Error callback', error);
          reject(error);
        },
        // close callback
        () => {
          this.#client = null;
          console.log(TAG, 'HoloPlay client closed');
        },
        false, // debug
        'com.spoon.lookinggloves', // app id
      );
    });
  }

  /**
   * show quilt image on Looking Glass
   * @param {HTMLCanvasElement} quiltInCanvas 
   * @param {number} numberOfFrames 
   * @param {HoloPlayClientOptions} [options] 
   */
  showQuiltImage = async (quiltInCanvas, numberOfFrames, options) => {
    try {
      const client = await this.#connect(options);

      const rows = Math.ceil(numberOfFrames / COLS);
      const frameWidth = quiltInCanvas.width / COLS;
      const frameHeight = quiltInCanvas.height / rows;
      const aspect = frameWidth / frameHeight;

      const imageData = quiltInCanvas.toDataURL('image/jpeg', 0.9).replace(/^data:image\/jpeg;base64,/, '')
      const binaryData = new Uint8Array(atob(imageData).split('').map(c => c.charCodeAt(0)));

      const showCmd = new HoloPlayCore.ShowMessage(
        { vx: COLS, vy: rows, vtotal: numberOfFrames, aspect },
        binaryData,
        0
      );
      // console.log(TAG, 'ShowMessage', showCmd);
      await client.sendMessage(showCmd);
    } catch (error) {
      console.error(TAG, 'error', error);
    }
  }
}

export const holoplayClient = new HoloPlayClient();
