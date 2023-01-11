import { drawSourceToCanvas } from '@utils/canvas';
import { loadImage } from '@utils/image';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { useProgress } from '@components/hooks/useProgress';
import { useSequence } from '@components/hooks/useSequence';
import { SequenceProcessorInfo } from '@components/lightfield/types';

const maxFrameWidth = 1000;

export const ImageSequenceProcessor: SequenceProcessorInfo = ({ activated, onDone }) => {
  const { updateProgress } = useProgress();
  const { setSourceFrames, setFrames } = useSequence();

  // input element to select video file
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [processing, setProcessing] = useState(false);

  const onImageFilesSelected = async (images: File[]) => {
    if (images.length <= 1) {
      toast.error("I can't work with just 1 image 😢");
      return;
    }

    // calculate frame size from the first file
    const firstImage = await loadImage(images[0]);
    const frameWidth = Math.floor(Math.min(firstImage.naturalWidth, maxFrameWidth));
    const frameHeight = Math.floor(
      (frameWidth / firstImage.naturalWidth) * firstImage.naturalHeight
    );

    const frames: HTMLCanvasElement[] = [];
    for (let i = 0; i < images.length; i += 1) {
      const img = await loadImage(images[i]);
      const frame = drawSourceToCanvas(img, frameWidth, frameHeight);
      frames.push(frame);
      updateProgress(i / images.length, 'Parsing image sequence ...');
    }

    setSourceFrames(frames);
    setFrames(frames);
    updateProgress(1);
    setProcessing(false);
    onDone();
  };

  useEffect(() => {
    if (files?.length) {
      setProcessing(true);
      updateProgress(0, 'Parsing image sequence ...');
      const images = Array.from(files).filter((file) => file.type.startsWith('image/'));
      images.sort((a, b) => a.name.localeCompare(b.name));
      onImageFilesSelected(images);
    }
  }, [files]);

  if (!activated) return null;

  return (
    <>
      <h2>
        Please select{' '}
        <mark>
          <b>all</b>
        </mark>{' '}
        the files of the image sequence
      </h2>

      {/* file input for selecting video file */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={processing}
        multiple
        className="file-input h-auto w-full sm:w-96 mt-2"
        onChange={(e) => setFiles(e.target.files)}
      />
    </>
  );
};

ImageSequenceProcessor.title = 'Parse image sequence';
