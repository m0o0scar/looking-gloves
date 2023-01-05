import { drawBlobToCanvas } from '@utils/canvas';
import { fetchWithProgress } from '@utils/fetch';
import { FC, useState } from 'react';
import { unzip } from 'unzipit';

import { useProgress } from '@components/hooks/useProgress';
import { useSequence } from '@components/hooks/useSequence';
import { useSource } from '@components/hooks/useSource';
import { SequenceProcessorInfo } from '@components/lightfield/types';

export const LumaLightfieldDownloader: SequenceProcessorInfo = ({ activated, onDone }) => {
  const { updateProgress } = useProgress();
  const { setSourceInfo } = useSource();
  const { setAllFrames } = useSequence();

  const [url, setUrl] = useState('');
  const [fetching, setFetching] = useState(false);

  const getUrlFromClipboard = async () => {
    const text = await navigator.clipboard?.readText();
    if (text.startsWith('https://captures.lumalabs.ai/')) {
      setUrl(text);
    }
  };

  const startFetchingOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      downloadAndUnzipLightFieldFromLuma();
    }
  };

  const downloadAndUnzipLightFieldFromLuma = async () => {
    if (!url || fetching) return;

    setFetching(true);

    try {
      // fetch luma page
      updateProgress(-1, 'Fetching info ...');
      const resp = await fetch(`/api/luma/getInfo?url=${encodeURIComponent(url)}`);
      const json = await resp.json();

      console.log('Luma NeRF info', json);
      const {
        pageProps: {
          props: {
            pageProps: {
              artifacts: { light_field: lightFieldZipUrl },
              captureMeta: { captureName, username },
            },
          },
        },
      } = json;

      setSourceInfo({ title: captureName, author: username, url, sourceType: 'Luma' });

      // download light field photos zip
      const zipFileName = lightFieldZipUrl.split('/').pop()!;
      const zipDownloadUrl = `/external/luma/lightfield/${zipFileName}`;

      // download and unzip the light field photos
      updateProgress(-1, 'Downloading light field photos ...');
      const zipFile = await fetchWithProgress(zipDownloadUrl, undefined, (received, total) => {
        const progress = received / total;
        const receivedInMB = (received / 1024 / 1024).toFixed(2);
        const totalInMB = (total / 1024 / 1024).toFixed(2);
        updateProgress(
          progress * 0.9,
          `Downloading light field photos ${receivedInMB}MB / ${totalInMB}MB ...`
        );
      });

      // draw all the frames into canvas
      const frames: HTMLCanvasElement[] = [];
      const { entries } = await unzip(zipFile);
      const names = Object.keys(entries).sort().reverse();
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const blob = await entries[name].blob('image/jpg');
        const frame = await drawBlobToCanvas(blob);
        frames.push(frame);
        updateProgress(0.9 + ((i + 1) / names.length) * 0.1, 'Processing ...');
      }

      updateProgress(1, `Downloaded. There are ${names.length} frames in total.`);

      setAllFrames(frames, true);
      onDone();
    } catch (e) {
      // TODO show toast
      updateProgress(0, 'Failed to fetch from Luma.');
      console.error(e);
      onDone();
    } finally {
      setFetching(false);
    }
  };

  if (!activated) return null;

  return (
    <>
      <h2>Please provide Luma NeRF URL</h2>

      <div className="flex gap-2 w-full sm:w-96">
        <div className="form-control grow">
          <input
            type="url"
            disabled={fetching}
            placeholder="Luma NeRF URL"
            className="input w-full"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={startFetchingOnEnter}
            onClick={getUrlFromClipboard}
          />
        </div>
        <button
          className="btn"
          disabled={!url || fetching}
          onClick={downloadAndUnzipLightFieldFromLuma}
        >
          Fetch
        </button>
      </div>
    </>
  );
};

LumaLightfieldDownloader.title = 'Download light field from Luma';
