import { drawSourceToCanvas } from '@utils/canvas';
import { loadImage } from '@utils/image';
import { getQuiltColsRows, isPyScriptReady } from '@utils/pyscript';
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
      updateProgress(-1, `Please wait while PyScript is loading ...`);
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

        const { cols, rows } = await getQuiltColsRows(files[0]);
        console.log(`There are ${cols} columns and ${rows} rows in the quilt image`);

        // TODO determine how many columns and rows are there in the image
        // TODO draw each frame from the quilt image onto a canvas

        setProcessing(false);
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
