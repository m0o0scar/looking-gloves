/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { unzip } from 'unzipit';
import cls from 'classnames';
import Head from 'next/head';
import { QuiltPreview } from '@components/QuiltPreview';
import Slider from '@mui/material/Slider';
import { toast } from 'react-toastify';
interface Frame {
  img: HTMLImageElement;
  url?: string;
}

const defaultFrameRange = [0, 0];
const defaultFrameCount = 96;

const Home: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // quilt image options
  const [cols, setCols] = useState(8);
  const [rows, setRows] = useState(defaultFrameCount / 8);
  const [ratio, setRatio] = useState(0);
  const [frameRange, setFrameRange] = useState(defaultFrameRange);
  const [frameCount, setFrameCount] = useState(defaultFrameCount);

  // light field photos related
  const [url, setUrl] = useState('');
  // const [url, setUrl] = useState('https://captures.lumalabs.ai/unreal-overtake-o-32417');
  const [frames, setFrames] = useState<Frame[] | undefined>(undefined);
  const [totalNumberOfFrames, setTotalNumberOfFrames] = useState(0);
  const [title, setTitle] = useState('');

  // other UI states
  const [trigger, setTrigger] = useState(0);
  const [message, setMessage] = useState('');
  const [processVideoMessage, setProcessVideoMessage] = useState('');
  const [processVideoProgress, setProcessVideoProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'fetchingPage' | 'fetchingFrames' | 'done'>('idle');

  const triggerDownload = () => setTrigger((value) => value + 1);

  function reset() {
    if (frames) {
      for (const frame of frames) {
        frame.url && URL.revokeObjectURL(frame.url);
      }
    }

    setRatio(0);
    setFrames(undefined);
    setTotalNumberOfFrames(0);
    setTitle('');
    setFrameRange(defaultFrameRange);
    setFrameCount(defaultFrameCount);
  }

  async function downloadAndUnzipLightFieldFromLuma(lumaPageUrl: string) {
    reset();

    // fetch luma page
    setStatus('fetchingPage');
    setMessage('Fetching info ...');
    const resp = await fetch(`/api/luma/getInfo?url=${encodeURIComponent(lumaPageUrl)}`);
    const json = await resp.json();

    // get luma page title
    setTitle(json.title);

    // download light field photos zip
    const lightFieldZipUrl = json.pageProps.props.pageProps.artifacts.light_field;
    const zipFileName = lightFieldZipUrl.split('/').pop()!;
    const zipDownloadUrl = `/luma/lightfield/${zipFileName}`;
    console.log(zipDownloadUrl);
    // const zipDownloadUrl = '/test/cdcd228cc8dd02c536d5d0e191b521d4f5f74d7a21a45259d83d1ab4cddc2c99.zip';

    // download and unzip the light field photos
    setStatus('fetchingFrames');
    setMessage('Downloading light field photos, this may take a while ...');
    const zipResp = await fetch(zipDownloadUrl);
    const zipFileSize = parseInt(zipResp.headers.get('Content-Length') || '0') / 1024 / 1024;
    const zipFileSizeInMB = zipFileSize ? `${zipFileSize.toFixed(2)} MB` : 'unknown size';
    setMessage(`Downloading light field photos (${zipFileSizeInMB}), this may take a while ...`);
    const zipFile = await zipResp.arrayBuffer();
    const { entries } = await unzip(zipFile);

    const names = Object.keys(entries).sort().reverse();
    const frames: Frame[] = [];
    for (const name of names) {
      const blob = await entries[name].blob('image/jpg');
      const frame = await loadImageFromBlob(blob);
      frames.push(frame);
    }
    setFrames(frames);

    setTotalNumberOfFrames(names.length);

    setMessage(`Downloaded. There are ${names.length} frames in total.`);
    setStatus('done');
  }

  function extractFramesFromVideo(file?: File) {
    if (!file) return;

    setStatus('fetchingFrames');
    setProcessVideoMessage('Extracting frames from video ...');
    setProcessVideoProgress(0);

    // load the video file into a video element
    const src = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.loop = false;
    video.src = src;

    // extract frames from the video
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const frames: Frame[] = [];
    let duration = 0;
    const step = 1 / 30;

    const drawFrame = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL('image/jpg');
      const img = new Image();
      img.src = url;
      frames.push({ img });
    };

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      duration = video.duration;
      video.currentTime = 0;
    };

    video.onseeked = () => {
      drawFrame();
      if (video.currentTime < duration) {
        video.currentTime += step;

        const progress = Math.round((video.currentTime / duration) * 100);
        setProcessVideoProgress(progress);
      } else {
        setProcessVideoMessage('All frames extracted.');
        setProcessVideoProgress(100);
        setFrames(frames);
        setTotalNumberOfFrames(frames.length);
        setStatus('done');
      }
    };
  }

  function loadImageFromBlob(blob: Blob): Promise<Frame> {
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

  async function drawQuiltImage(showFrameIndex: boolean = false) {
    if (!frames || !frames.length) return;

    // get image size
    const { naturalWidth: imageWidth, naturalHeight: imageHeight } = frames[0].img;
    const newRatio = imageWidth / imageHeight;
    frames[0].url && URL.revokeObjectURL(frames[0].url);

    const canvasWidth = 4000;
    const frameWidth = canvasWidth / cols;
    const frameHeight = frameWidth / newRatio;
    const canvasHeight = frameHeight * rows;

    canvasRef.current!.width = canvasWidth;
    canvasRef.current!.height = canvasHeight;
    const ctx = canvasRef.current!.getContext('2d')!;

    ctx.font = '80px Arial';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 10;

    // draw all the frames onto a canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let i = frameRange[0]; i < frameRange[1]; i += 1) {
      if (!frames[i]) continue;

      const { img, url } = frames[i];
      const col = (i - frameRange[0]) % cols;
      const row = rows - 1 - Math.floor((i - frameRange[0]) / cols);
      const x = col * frameWidth;
      const y = row * frameHeight;
      ctx.drawImage(img, 0, 0, imageWidth, imageHeight, x, y, frameWidth, frameHeight);
      if (showFrameIndex) {
        const text = i.toString();
        const tx = x + 20;
        const ty = y + 100;
        ctx.strokeText(text, tx, ty);
        ctx.fillText(text, tx, ty);
      }
      url && URL.revokeObjectURL(url);
    }

    setRatio(newRatio);
  }

  // save result to local file system
  function saveQuiltImage() {
    // hide frame indexes before saving
    drawQuiltImage(false);

    const a = document.createElement('a');
    a.download = `${Date.now()}-qs${cols}x${rows}a${ratio.toFixed(2)}.jpg`;
    a.href = canvasRef.current!.toDataURL('image/jpeg', 0.95);
    a.click();

    drawQuiltImage(true);
  }

  async function copyTitle() {
    await navigator.clipboard.writeText(title);
    toast.success(`"${title}" copied to clipboard`);
  }

  function onFrameRangeChange(e: Event, newValue: number | number[]) {
    if (newValue instanceof Array) {
      let [newStart, newEnd] = newValue;

      if (newStart !== frameRange[0]) {
        newEnd = newStart + frameCount;
      } else {
        newStart = newEnd - frameCount;
      }

      if (newStart < 0) {
        newEnd += -newStart;
        newStart = 0;
      }
      if (newEnd > totalNumberOfFrames - 1) {
        newStart -= newEnd - (totalNumberOfFrames - 1);
        newEnd = totalNumberOfFrames - 1;
      }

      setFrameRange([newStart, newEnd]);
    }
  }

  // download light field photos when user provided url and click start button
  useEffect(() => {
    if (!url) return;
    downloadAndUnzipLightFieldFromLuma(url);
  }, [trigger]);

  // calculate index of first frame
  useEffect(() => {
    const index = Math.floor((totalNumberOfFrames - frameCount) / 2);
    setFrameRange([index, index + frameCount]);
  }, [totalNumberOfFrames, frameCount]);

  // update quilt image when frames are downloaded or options are changed
  useEffect(() => {
    drawQuiltImage(true);
  }, [frames, frameRange]);

  return (
    <>
      <Head>
        <title>Luma 2 Quilt</title>
      </Head>
      <article className="prose max-w-full overflow-x-hidden">
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') triggerDownload();
              }}
            />
            <button
              className="btn btn-info"
              disabled={!url || (status !== 'idle' && status !== 'done')}
              onClick={triggerDownload}
            >
              Start
            </button>
          </div>

          {status !== 'idle' && url && (
            <label className="label">
              <span className="label-text-alt">{message}</span>
              {status !== 'done' && (
                <span className="label-text-alt">
                  <progress className="progress" style={{ width: 76 }}></progress>
                </span>
              )}
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Or select a video file</span>
          </label>
          <input
            type="file"
            accept="video/*"
            className="file-input grow"
            disabled={status !== 'idle' && status !== 'done'}
            onChange={(e) => extractFramesFromVideo(e.target.files![0])}
          />
          {status !== 'idle' && !url && (
            <label className="label">
              <span className="label-text-alt">{processVideoMessage}</span>
              {status !== 'done' && (
                <span className="label-text-alt">
                  <progress
                    className="progress"
                    value={processVideoProgress}
                    max={100}
                    style={{ width: 76 }}
                  ></progress>
                </span>
              )}
            </label>
          )}
        </div>

        {/* options */}
        {status === 'done' && (
          <>
            <h2>Frame Range</h2>
            <div>
              <Slider
                min={0}
                max={totalNumberOfFrames}
                value={frameRange}
                onChange={onFrameRangeChange}
                valueLabelDisplay="auto"
              />
            </div>

            {/* canvas for drawing the quilt image */}
            <h2>Preview</h2>
            <div className={cls('flex flex-row items-start gap-4 my-4', status === 'done' ? 'visible' : 'hidden')}>
              <canvas ref={canvasRef} className="rounded-lg drop-shadow-lg grow min-w-0" />
              {canvasRef.current && rows && (
                <QuiltPreview
                  quiltCanvas={canvasRef.current}
                  canvasWidth={300}
                  cols={cols}
                  rows={rows}
                  ratio={ratio}
                  animationTrigger={frameRange}
                />
              )}
            </div>

            {/* download button */}
            <div className="flex gap-2">
              <button className="btn" onClick={copyTitle}>
                Copy Title
              </button>
              <button className="btn btn-success" onClick={saveQuiltImage}>
                Download
              </button>
              <a className="btn btn-accent" href="https://blocks.glass/manage" target="_blank" rel="noreferrer">
                Goto LG Blocks
              </a>
            </div>
          </>
        )}
      </article>
    </>
  );
};

export default Home;
