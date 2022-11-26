/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { unzip, ZipEntry } from 'unzipit';
import cls from 'classnames';
import Head from 'next/head';

const Home: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cols = useRef(0);
  const rows = useRef(0);
  const ratio = useRef(0);

  // light field photos related
  const [url, setUrl] = useState('https://captures.lumalabs.ai/unreal-overtake-o-32417');
  const [frames, setFrames] = useState<{ [key: string]: ZipEntry } | undefined>(undefined);
  const [totalNumberOfFrames, setTotalNumberOfFrames] = useState(0);

  // quilt image options
  const [frameCount, setFrameCount] = useState(48);
  const [indexOfFirstFrame, setIndexOfFirstFrame] = useState(0);
  const [skipFrames, setSkipFrames] = useState(0);

  // other UI states
  const [trigger, setTrigger] = useState(0);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'fetchingPage' | 'fetchingZip' | 'done'>('idle');

  async function downloadAndUnzipLightFieldFromLuma(lumaPageUrl: string) {
    setFrames(undefined);
    setTotalNumberOfFrames(0);

    // fetch luma page
    // setStatus('fetchingPage');
    // setMessage('Fetching info ...');
    // const resp = await fetch(`/api/luma/getInfo?url=${encodeURIComponent(lumaPageUrl)}`);
    // const json = await resp.json();
    // const lightFieldZipUrl = json.props.pageProps.artifacts.light_field;
    // const zipFileName = lightFieldZipUrl.split('/').pop()!;
    // const zipDownloadUrl = `/luma/lightfield/${zipFileName}`;
    // console.log(zipDownloadUrl);
    const zipDownloadUrl = '/test/cdcd228cc8dd02c536d5d0e191b521d4f5f74d7a21a45259d83d1ab4cddc2c99.zip';

    // download and unzip the light field photos
    setStatus('fetchingZip');
    setMessage('Downloading light field photos, this may take a while ...');
    const zipResp = await fetch(zipDownloadUrl);
    const zipFileSize = parseInt(zipResp.headers.get('Content-Length') || '0') / 1024 / 1024;
    const zipFileSizeInMB = zipFileSize ? `${zipFileSize.toFixed(2)} MB` : 'unknown size';
    setMessage(`Downloading light field photos (${zipFileSizeInMB}), this may take a while ...`);
    const zipFile = await zipResp.arrayBuffer();
    const { entries } = await unzip(zipFile);
    setFrames(entries);
    setTotalNumberOfFrames(Object.keys(entries).length);

    setMessage('Downloaded');
    setStatus('done');
  }

  function loadImageFromBlob(blob: Blob) {
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

  async function drawQuiltImage() {
    if (!frames) return;

    // get image size
    const firstFrame = await loadImageFromBlob(await frames['000000.jpg'].blob('image/jpg'));
    const { naturalWidth: imageWidth, naturalHeight: imageHeight } = firstFrame.img;
    ratio.current = imageWidth / imageHeight;
    URL.revokeObjectURL(firstFrame.url);

    // calculate the frame range to generate the quilt image
    const frameNames = Object.keys(frames).sort().reverse();
    const totalFrames = frameNames.length;
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

    ctx.font = '100px Arial';
    ctx.fillStyle = 'black';

    // draw all the frames onto a canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let i = frameStart; i < frameStart + frameCount * frameStep; i += frameStep) {
      const frameName = frameNames[i];
      console.log('drawing frame', i, frameName);
      const frame = await loadImageFromBlob(await frames[frameName].blob('image/jpg'));
      const col = ((i - frameStart) / frameStep) % cols.current;
      const row = rows.current - 1 - Math.floor((i - frameStart) / frameStep / cols.current);
      const x = col * frameWidth;
      const y = row * frameHeight;
      ctx.drawImage(frame.img, 0, 0, imageWidth, imageHeight, x, y, frameWidth, frameHeight);
      ctx.fillText(i.toString(), x + 20, y + 100);
      URL.revokeObjectURL(frame.url);
    }
  }

  // save result to local file system
  function saveQuiltImage() {
    const a = document.createElement('a');
    a.download = `${Date.now()}-qs${cols.current}x${rows.current}a${ratio.current.toFixed(2)}.jpg`;
    a.href = canvasRef.current!.toDataURL('image/jpeg', 1);
    a.click();
  }

  // download light field photos when user provided url and click start button
  useEffect(() => {
    if (!url) return;
    downloadAndUnzipLightFieldFromLuma(url);
  }, [trigger]);

  // update quilt image when frames are downloaded or options are changed
  useEffect(() => {
    drawQuiltImage();
  }, [frames]);

  return (
    <>
      <Head>
        <title>Luma 2 Quilt</title>
      </Head>
      <article className="prose">
        <h1>Luma2Quilt</h1>
        <p>I can convert LumaAI NeRF into Quilt image, which you can use on a Looking Glass or Blocks Hologram.</p>

        {/* luma page url input */}
        <h2>Download Light Field from Luma</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Please paste URL to the LumaAI NeRF here:</span>
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

        {/* options */}
        <h2>Quilt Image Options</h2>
        <div className="flex gap-4">
          {/* total number of frames */}
          <div className="form-control w-32">
            <label className="label">
              <span className="label-text">Number of frames</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={frameCount}
              onChange={(e) => setFrameCount(parseInt(e.target.value))}
            >
              <option value="48">48</option>
              <option value="96">96</option>
            </select>
          </div>

          {/* index of 1st frame */}
          <div className="form-control w-32">
            <label className="label">
              <span className="label-text">1st frame index</span>
            </label>
            <select className="select select-bordered w-full">
              <option value="0">0</option>
            </select>
          </div>

          {/* skip how many frames per step */}
          <div className="form-control w-32">
            <label className="label">
              <span className="label-text">Skip</span>
            </label>
            <select className="select select-bordered w-full">
              <option value="0">0</option>
            </select>
          </div>
        </div>

        {/* canvas for drawing the quilt image */}
        <div className={cls('mt-4', status === 'done' ? 'visible' : 'hidden')}>
          <canvas ref={canvasRef} className="max-w-full rounded-lg shadow" />
        </div>

        {/* download button */}
        {status === 'done' && (
          <div className="flex gap-2">
            <button className="btn btn-success" onClick={saveQuiltImage}>
              Download
            </button>
            <a className="btn btn-accent" href="https://blocks.glass/manage" target="_blank" rel="noreferrer">
              Goto LG Blocks
            </a>
          </div>
        )}
      </article>
    </>
  );
};

export default Home;

// @zip.js/zip.js
