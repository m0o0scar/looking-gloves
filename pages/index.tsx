/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { unzip } from 'unzipit';
import cls from 'classnames';

const Home: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cols = useRef(0);
  const rows = useRef(0);
  const ratio = useRef(0);

  const [url, setUrl] = useState('');
  const [trigger, setTrigger] = useState(0);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'fetchingPage' | 'fetchingZip' | 'drawing' | 'done'>('idle');

  function loadImage(blob: Blob) {
    return new Promise<{ img: HTMLImageElement; url: string }>((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        resolve({ img, url });
      };
      img.onerror = reject;
    });
  }

  function downloadQuilt() {
    const a = document.createElement('a');
    a.download = `${Date.now()}-qs${cols.current}x${rows.current}a${ratio.current.toFixed(2)}.jpg`;
    a.href = canvasRef.current!.toDataURL('image/jpeg', 1);
    a.click();
  }

  useEffect(() => {
    if (!url) return;

    (async () => {
      // fetch luma page
      setStatus('fetchingPage');
      setMessage('Fetching info ...');
      const resp = await fetch(`/api/luma/getInfo?url=${encodeURIComponent(url)}`);
      const json = await resp.json();
      const lightFieldZipUrl = json.props.pageProps.artifacts.light_field;
      console.log(lightFieldZipUrl);

      // download and unzip the light field photos
      setStatus('fetchingZip');
      setMessage('Downloading light field photos, this may take a while ...');
      const zipResp = await fetch(lightFieldZipUrl);
      const zipFileSize = parseInt(zipResp.headers.get('Content-Length') || '0') / 1024 / 1024;
      const zipFileSizeInMB = zipFileSize ? `${zipFileSize.toFixed(2)} MB` : 'unknown size';
      setMessage(`Downloading light field photos (${zipFileSizeInMB}), this may take a while ...`);
      const zipFile = await zipResp.arrayBuffer();
      const { entries } = await unzip(zipFile);

      setStatus('drawing');
      setMessage('Generating quilt ...');

      // get image size
      const firstFrame = await loadImage(await entries['000000.jpg'].blob('image/jpg'));
      const { naturalWidth: imageWidth, naturalHeight: imageHeight } = firstFrame.img;
      ratio.current = imageWidth / imageHeight;
      URL.revokeObjectURL(firstFrame.url);

      // calculate the frame range to generate the quilt image
      const frameNames = Object.keys(entries).sort().reverse();
      const totalFrames = frameNames.length;
      const frameCount = 48;
      const frameStep = Math.floor(totalFrames / frameCount);
      const frameStart = Math.max(0, Math.floor((totalFrames - frameCount * frameStep) / 2));
      console.log('total frames:', totalFrames);
      console.log('frame count:', frameCount);
      console.log('frame step:', frameStep);
      console.log('frame start:', frameStart);

      cols.current = 8;
      rows.current = frameCount / cols.current;
      const canvasWidth = 4000;
      const frameWidth = canvasWidth / cols.current;
      const frameHeight = frameWidth / ratio.current;
      const canvasHeight = frameHeight * rows.current;

      canvasRef.current!.width = canvasWidth;
      canvasRef.current!.height = canvasHeight;
      const ctx = canvasRef.current!.getContext('2d')!;

      // draw all the frames onto a canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      for (let i = frameStart; i < frameStart + frameCount * frameStep; i += frameStep) {
        const frameName = frameNames[i];
        console.log('drawing frame', i, frameName);
        const frame = await loadImage(await entries[frameName].blob('image/jpg'));
        const col = ((i - frameStart) / frameStep) % cols.current;
        const row = rows.current - 1 - Math.floor((i - frameStart) / frameStep / cols.current);
        const x = col * frameWidth;
        const y = row * frameHeight;
        ctx.drawImage(frame.img, 0, 0, imageWidth, imageHeight, x, y, frameWidth, frameHeight);
        URL.revokeObjectURL(frame.url);
      }

      setStatus('done');
      setMessage('Done!');
    })();
  }, [trigger]);

  return (
    <article className="prose">
      <h1>Luma2Quilt</h1>
      <p>I can convert LumaAI NeRF into Quilt image, which you can use on a Looking Glass or Blocks Hologram.</p>

      {/* luma page url input */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Paste URL to the LumaAI NeRF here:</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            disabled={status !== 'idle' && status !== 'done'}
            placeholder="LumaAI NeRF URL"
            className="input input-bordered grow"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            className="btn btn-info"
            disabled={!url || (status !== 'idle' && status !== 'done')}
            onClick={() => setTrigger((value) => value + 1)}
          >
            Start
          </button>
        </div>

        {status !== 'idle' && (
          <label className="label">
            <span className="label-text-alt">{message}</span>
            {status !== 'done' && (
              <span className="label-text-alt">
                <progress className="progress w-24"></progress>
              </span>
            )}
          </label>
        )}
      </div>

      <div className={cls(status === 'done' ? 'visible' : 'hidden')}>
        <canvas ref={canvasRef} className="max-w-full rounded-lg shadow" />
      </div>

      {status === 'done' && (
        <div className="flex gap-2">
          <button className="btn btn-success" onClick={downloadQuilt}>
            Download
          </button>
          <a className="btn btn-accent" href="https://blocks.glass/manage" target="_blank" rel="noreferrer">
            Goto LG Blocks
          </a>
        </div>
      )}
    </article>
  );
};

export default Home;

// @zip.js/zip.js
