/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { unzip } from 'unzipit';
import cls from 'classnames';
import Head from 'next/head';
import { QuiltPreview } from '@components/QuiltPreview';
import Slider from '@mui/material/Slider';

interface Frame {
  img: HTMLImageElement;
  url: string;
}

const Home: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cols, setCols] = useState(8);
  const [rows, setRows] = useState(0);
  const [ratio, setRatio] = useState(0);

  // light field photos related
  const [url, setUrl] = useState('');
  // const [url, setUrl] = useState('https://captures.lumalabs.ai/unreal-overtake-o-32417');
  const [frames, setFrames] = useState<Frame[] | undefined>(undefined);
  const [totalNumberOfFrames, setTotalNumberOfFrames] = useState(0);

  // quilt image options
  const [frameRange, setFrameRange] = useState([0, 0]);
  const [frameCount, setFrameCount] = useState(48);
  const [skipFrames, setSkipFrames] = useState(0);
  const totalRequiredFrames = frameCount + skipFrames * (frameCount - 1);

  // other UI states
  const [trigger, setTrigger] = useState(0);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'fetchingPage' | 'fetchingZip' | 'done'>('idle');

  const triggerDownload = () => setTrigger((value) => value + 1);

  function reset() {
    if (frames) {
      for (const frame of frames) {
        URL.revokeObjectURL(frame.url);
      }
    }

    setRows(0);
    setRatio(0);
    setFrames(undefined);
    setTotalNumberOfFrames(0);
  }

  async function downloadAndUnzipLightFieldFromLuma(lumaPageUrl: string) {
    reset();

    // fetch luma page
    setStatus('fetchingPage');
    setMessage('Fetching info ...');
    const resp = await fetch(`/api/luma/getInfo?url=${encodeURIComponent(lumaPageUrl)}`);
    const json = await resp.json();
    const lightFieldZipUrl = json.props.pageProps.artifacts.light_field;
    const zipFileName = lightFieldZipUrl.split('/').pop()!;
    const zipDownloadUrl = `/luma/lightfield/${zipFileName}`;
    console.log(zipDownloadUrl);
    // const zipDownloadUrl = '/test/cdcd228cc8dd02c536d5d0e191b521d4f5f74d7a21a45259d83d1ab4cddc2c99.zip';

    // download and unzip the light field photos
    setStatus('fetchingZip');
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
    URL.revokeObjectURL(frames[0].url);

    const newRows = frameCount / cols;
    const canvasWidth = 4000;
    const frameWidth = canvasWidth / cols;
    const frameHeight = frameWidth / newRatio;
    const canvasHeight = frameHeight * newRows;

    canvasRef.current!.width = canvasWidth;
    canvasRef.current!.height = canvasHeight;
    const ctx = canvasRef.current!.getContext('2d')!;

    ctx.font = '80px Arial';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 10;

    // draw all the frames onto a canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const step = skipFrames + 1;
    for (let i = frameRange[0]; i < frameRange[1]; i += step) {
      if (!frames[i]) continue;
      const col = ((i - frameRange[0]) / step) % cols;
      const row = newRows - 1 - Math.floor((i - frameRange[0]) / step / cols);
      const x = col * frameWidth;
      const y = row * frameHeight;
      ctx.drawImage(frames[i].img, 0, 0, imageWidth, imageHeight, x, y, frameWidth, frameHeight);
      if (showFrameIndex) {
        const text = i.toString();
        const tx = x + 20;
        const ty = y + 100;
        ctx.strokeText(text, tx, ty);
        ctx.fillText(text, tx, ty);
      }
      URL.revokeObjectURL(frames[i].url);
    }

    setRows(newRows);
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

  function onFrameRangeChange(e: Event, newValue: number | number[]) {
    if (newValue instanceof Array) {
      let [newStart, newEnd] = newValue;

      if (newStart !== frameRange[0]) {
        newEnd = newStart + totalRequiredFrames;
      } else {
        newStart = newEnd - totalRequiredFrames;
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
    const index = Math.floor((totalNumberOfFrames - totalRequiredFrames) / 2);
    setFrameRange([index, index + totalRequiredFrames]);
  }, [totalNumberOfFrames, frameCount, skipFrames]);

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

          {status !== 'idle' && (
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

        {/* options */}
        {status === 'done' && (
          <>
            <h2>Options</h2>
            <div>
              <div className="flex gap-4 mb-4">
                {/* number of frames */}
                <div className="form-control w-32">
                  <label className="label">
                    <span className="label-text">No. of frames</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={frameCount}
                    onChange={(e) => setFrameCount(parseInt(e.target.value))}
                  >
                    <option value={48}>48</option>
                    <option value={96}>96</option>
                  </select>
                </div>

                {/* skip frames */}
                <div className="form-control w-32">
                  <label className="label">
                    <span className="label-text">Skip</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={skipFrames}
                    onChange={(e) => setSkipFrames(parseInt(e.target.value))}
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </div>
              </div>

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
                <QuiltPreview quiltCanvas={canvasRef.current} canvasWidth={300} cols={cols} rows={rows} ratio={ratio} />
              )}
            </div>

            {/* download button */}
            <div className="flex gap-2">
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
