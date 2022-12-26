import Slider from '@mui/material/Slider';
import { fetchWithProgress } from '@utils/fetch';
import { FC, useEffect, useState } from 'react';
import { unzip } from 'unzipit';

import { ImageSequenceAnimation } from '@components/common/ImageSequenceAnimation';

import { SequenceExtractorProps } from './types';

const initialNumberOfFrames = 48;
const maxNumberOfFrames = 96;

export const LumaLightfieldExtractor: FC<SequenceExtractorProps> = ({
  onSourceProvided,
  onProgress,
  onFramesExtracted,
}) => {
  const [url, setUrl] = useState('');
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState('');

  const [frames, setFrames] = useState<HTMLCanvasElement[] | undefined>();
  const [framesRange, setFramesRange] = useState([0, 0]);

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

  const drawBlobToCanvas = (blob: Blob) => {
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
  };

  const downloadAndUnzipLightFieldFromLuma = async () => {
    if (!url || fetching) return;

    setFetching(true);
    onProgress?.(-1);
    onFramesExtracted?.();

    try {
      // fetch luma page
      setMessage('Fetching info ...');
      const resp = await fetch(`/api/luma/getInfo?url=${encodeURIComponent(url)}`);
      const json = await resp.json();

      // download light field photos zip
      const lightFieldZipUrl = json.pageProps.props.pageProps.artifacts.light_field;
      const zipFileName = lightFieldZipUrl.split('/').pop()!;
      const zipDownloadUrl = `/luma/lightfield/${zipFileName}`;

      // download and unzip the light field photos
      setMessage('Downloading light field photos ...');
      const zipFile = await fetchWithProgress(zipDownloadUrl, undefined, (received, total) => {
        const progress = received / total;
        const receivedInMB = (received / 1024 / 1024).toFixed(2);
        const totalInMB = (total / 1024 / 1024).toFixed(2);
        setMessage(`Downloading light field photos ${receivedInMB}MB / ${totalInMB}MB ...`);
        onProgress?.(progress * 0.9);
      });
      const { entries } = await unzip(zipFile);

      // draw all the frames into canvas
      const frames: HTMLCanvasElement[] = [];
      const names = Object.keys(entries).sort().reverse();
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const blob = await entries[name].blob('image/jpg');
        const frame = await drawBlobToCanvas(blob);
        frames.push(frame);
        onProgress?.(0.9 + ((i + 1) / names.length) * 0.1);
      }

      setMessage(`Downloaded. There are ${names.length} frames in total.`);
      onProgress?.(1);

      // onFramesExtracted?.(frames, true);
      setFrames(frames);

      const rangeStart = Math.floor((frames.length - initialNumberOfFrames) / 2);
      const rangeEnd = rangeStart + initialNumberOfFrames;
      setFramesRange([rangeStart, rangeEnd]);
    } catch (e) {
      setMessage('Failed to fetch.');
      console.error(e);
      onProgress?.(0);
      onFramesExtracted?.();
    } finally {
      setFetching(false);
    }
  };

  const onRangeChange = (newRange: number[]) => {
    // make sure the range is not too large
    let [start, end] = newRange;
    if (end - start > maxNumberOfFrames) {
      if (start === framesRange[0]) {
        start = end - maxNumberOfFrames;
      } else if (end === framesRange[1]) {
        end = start + maxNumberOfFrames;
      }
    }
    setFramesRange([start, end]);
  };

  const onConfirmFrames = () => {
    onFramesExtracted?.(frames?.slice(framesRange[0], framesRange[1]), true);
  };

  useEffect(() => {
    if (url) {
      onSourceProvided?.();
      setMessage('');
    }
  }, [url]);

  return (
    <>
      <h2>Please provide Luma NeRF URL</h2>

      <div className="flex gap-2 w-full sm:w-auto">
        <div className="form-control grow w-auto sm:w-96">
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
          disabled={!url || fetching}
          onClick={downloadAndUnzipLightFieldFromLuma}
        >
          Fetch
        </button>
      </div>

      <Slider
        value={framesRange}
        onChange={(e, newValue) => onRangeChange(newValue as number[])}
        step={8}
        min={0}
        max={frames?.length || 0}
        valueLabelDisplay="auto"
      />

      <ImageSequenceAnimation
        frames={frames}
        start={framesRange[0]}
        end={framesRange[1]}
        width={300}
        height={400}
      />

      <button className="btn" onClick={onConfirmFrames}>
        Confirm
      </button>
    </>
  );
};
