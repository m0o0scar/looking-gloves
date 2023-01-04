import { drawSourceToCanvas } from '@utils/canvas';
import { loadImage } from '@utils/image';
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

  // when video file is selected, start extracting frames from it
  useEffect(() => {
    if (files?.[0]) {
      setProcessing(true);
      updateProgress(0, 'Extracting frames ...');

      // TODO determine how many columns and rows are there in the image
      // TODO draw each frame from the quilt image onto a canvas

      setProcessing(false);
    }
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
        disabled={processing}
        className="file-input h-auto w-full sm:w-96 mt-2"
        onChange={(e) => setFiles(e.target.files)}
      />
    </>
  );
};

QuiltFramesExtractor.title = 'Extract frames from quilt';
