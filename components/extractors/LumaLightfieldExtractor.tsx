import { fetchWithProgress } from '@utils/fetch';
import { FC, useState, useEffect } from 'react';
import { unzip } from 'unzipit';

export interface LumaLightfieldExtractorProps {
  numberOfFrames: number;
  onProgress?: (progress: number) => void;
  onFramesExtracted?: (frames?: HTMLCanvasElement[]) => void;
}

export const LumaLightfieldExtractor: FC<LumaLightfieldExtractorProps> = ({
  numberOfFrames,
  onProgress,
  onFramesExtracted,
}) => {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

  const getUrlFromClipboard = async () => {
    const text = await navigator.clipboard.readText();
    if (text.startsWith('https://captures.lumalabs.ai/')) {
      setUrl(text);
    }
  };

  const startFetchingOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      downloadAndUnzipLightFieldFromLuma();
    }
  };

  function drawBlobToCanvas(blob: Blob) {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas);
      };
      img.onerror = reject;
    });
  }

  async function downloadAndUnzipLightFieldFromLuma() {
    if (!url) return;

    onProgress?.(-1);
    onFramesExtracted?.();

    // fetch luma page
    setMessage('Fetching info ...');
    const resp = await fetch(
      `/api/luma/getInfo?url=${encodeURIComponent(url)}`
    );
    const json = await resp.json();

    // download light field photos zip
    const lightFieldZipUrl =
      json.pageProps.props.pageProps.artifacts.light_field;
    const zipFileName = lightFieldZipUrl.split('/').pop()!;
    const zipDownloadUrl = `/luma/lightfield/${zipFileName}`;

    // download and unzip the light field photos
    setMessage('Downloading light field photos ...');
    const zipFile = await fetchWithProgress(
      zipDownloadUrl,
      undefined,
      (received, total) => {
        const progress = received / total;
        const receivedInMB = (received / 1024 / 1024).toFixed(2);
        const totalInMB = (total / 1024 / 1024).toFixed(2);
        setMessage(
          `Downloading light field photos ${receivedInMB}MB / ${totalInMB}MB ...`
        );
        onProgress?.(progress);
      }
    );
    const { entries } = await unzip(zipFile);

    const frames: HTMLCanvasElement[] = [];
    const names = Object.keys(entries).sort().reverse();
    const startIndex = Math.floor((names.length - numberOfFrames) / 2);
    for (let i = 0; i < numberOfFrames; i++) {
      const name = names[startIndex + i];
      const blob = await entries[name].blob('image/jpg');
      const frame = await drawBlobToCanvas(blob);
      frames.push(frame);
    }

    onFramesExtracted?.(frames);
    setMessage(`Downloaded. There are ${names.length} frames in total.`);
  }

  return (
    <>
      <h2>Please provide Luma NeRF URL</h2>

      <div className="flex gap-2">
        <div className="form-control w-96">
          <input
            type="url"
            placeholder="Luma NeRF URL"
            className="input w-full"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={startFetchingOnEnter}
            onClick={getUrlFromClipboard}
          />
          <label className="label">
            <span className="label-text-alt">{message}</span>
          </label>
        </div>
        <button
          className="btn"
          disabled={!url}
          onClick={downloadAndUnzipLightFieldFromLuma}
        >
          Fetch
        </button>
      </div>
    </>
  );
};
