import { drawSourceToCanvas } from '@utils/canvas';
import { loadImage } from '@utils/image';
import { getQuiltColsRows, isPyScriptReady } from '@utils/pyscript';
import { wait } from '@utils/time';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { useProgress } from '@components/hooks/useProgress';
import { useSequence } from '@components/hooks/useSequence';
import { SequenceProcessorInfo } from '@components/lightfield/types';

const maxFrameWidth = 1000;

export const QuiltFramesExtractor: SequenceProcessorInfo = ({ activated, onDone }) => {
  const { updateProgress } = useProgress();
  const { setAllFrames } = useSequence();

  // input element to select quilt image file
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [processing, setProcessing] = useState(false);

  const [pyReady, setPyReady] = useState(false);

  useEffect(() => {
    const ready = isPyScriptReady();

    const onPyReady = () => {
      updateProgress(0);
      setPyReady(true);
    };

    if (ready) {
      setPyReady(true);
    } else {
      updateProgress(-1, `Please wait while loading dependencies ...`);
      document.addEventListener('pyscriptready', onPyReady);
    }

    return () => {
      document.removeEventListener('pyscriptready', onPyReady);
    };
  }, []);

  // when video file is selected, start extracting frames from it
  useEffect(() => {
    (async () => {
      if (files?.[0]) {
        setProcessing(true);
        updateProgress(0, 'Extracting frames ...');

        // convert file into image element
        const img = await loadImage(files[0]);

        // determine how many columns and rows are there in the image
        const { cols, rows } = await getQuiltColsRows(img);
        const totalFrames = cols * rows;
        console.log(`There are ${cols} columns and ${rows} rows in the quilt image`);

        // draw each frame from the quilt image onto a canvas
        const frameWidth = Math.floor(img.naturalWidth / cols);
        const frameHeight = Math.floor(img.naturalHeight / rows);
        const frames: HTMLCanvasElement[] = [];
        for (let i = 0; i < totalFrames; i += 1) {
          const x = (i % cols) * frameWidth;
          const y = (rows - 1 - Math.floor(i / cols)) * frameHeight;
          const frame = document.createElement('canvas');
          frame.width = frameWidth;
          frame.height = frameHeight;
          const ctx = frame.getContext('2d')!;
          ctx.drawImage(img, x, y, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
          frames.push(frame);
          updateProgress(i / totalFrames, 'Extracting frames ...');
          await wait(10); // give some time for the UI to update
        }

        setProcessing(false);
        updateProgress(1);
        setAllFrames(frames);
        onDone();
      }
    })();
  }, [files]);

  if (!activated) return null;

  return (
    <>
      <h2>Please select a quilt image</h2>

      {/* file input for selecting video file */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={processing || !pyReady}
        className="file-input h-auto w-full sm:w-96 mt-2"
        onChange={(e) => setFiles(e.target.files)}
      />
    </>
  );
};

QuiltFramesExtractor.title = 'Extract frames from quilt';
