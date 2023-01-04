import { drawSourceToCanvas } from '@utils/canvas';
import { COLS } from '@utils/constant';
import { loadImage } from '@utils/image';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { useProgress } from '@components/hooks/useProgress';
import { useSequence } from '@components/hooks/useSequence';
import { SequenceProcessorInfo } from '@components/lightfield/types';

const NoFrames: HTMLCanvasElement[] = [];

const maxFrameWidth = 1000;

export const ImageSequenceExtractor: SequenceProcessorInfo = ({ activated, onDone }) => {
  const { updateProgress } = useProgress();
  const { setAllFrames } = useSequence();

  // input element to select video file
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);

  // video element for extracting video frames
  const videoRef = useRef<HTMLVideoElement>(null);
  const [frames, setFrames] = useState<HTMLCanvasElement[]>(NoFrames);

  const expectedNumberOfFrames = useRef(0);
  const frameIndexRef = useRef(0);
  const frameWidth = useRef(0);
  const frameHeight = useRef(0);

  const createFrame = (source: CanvasImageSource) => {
    return drawSourceToCanvas(source, frameWidth.current, frameHeight.current);
  };

  // start seeking frames when video loaded
  const onVideoMetadataLoaded = () => {
    // assume 30 fps, calculate the total number of frames available
    const totalFrames = Math.floor(videoRef.current!.duration * 30);
    const numberOfFramesToExtract = Math.ceil(totalFrames / COLS) * COLS;
    expectedNumberOfFrames.current = Math.min(numberOfFramesToExtract, 48);
    console.log('[Video] expected number of frames', expectedNumberOfFrames.current);

    // start extracting frames from the beginning
    frameIndexRef.current = 0;
    videoRef.current!.currentTime = 0;

    const { videoWidth, videoHeight } = videoRef.current!;
    frameWidth.current = Math.floor(Math.min(videoWidth, maxFrameWidth));
    frameHeight.current = Math.floor((frameWidth.current / videoWidth) * videoHeight);

    console.log(
      'video loaded',
      `duration = ${videoRef.current!.duration}s`,
      `video size = ${videoRef.current!.videoWidth}px x ${videoRef.current!.videoHeight}px`,
      `frame size = ${frameWidth.current}px x ${frameHeight.current}px`
    );
  };

  // draw video frame to canvas and seek for the next frame
  const onVideoSeeked = () => {
    // draw current frame of the video to the canvas
    const frame = createFrame(videoRef.current!);
    setFrames((frames) => [...frames, frame]);

    // continue to seek for next frame, or callback when collected enough frames
    if (frameIndexRef.current < expectedNumberOfFrames.current - 1) {
      frameIndexRef.current += 1;
      updateProgress(
        frameIndexRef.current / expectedNumberOfFrames.current,
        'Extracting video frames ...'
      );
      videoRef.current!.currentTime += videoRef.current!.duration / expectedNumberOfFrames.current;
    } else {
      updateProgress(1);
    }
  };

  const onImageFilesSelected = async (images: File[]) => {
    if (images.length <= 1) {
      toast.error("I can't work with just 1 image 😢");
      return;
    }

    expectedNumberOfFrames.current = images.length;
    console.log('[Image] expected number of frames', images.length);

    const firstImage = await loadImage(images[0]);
    frameWidth.current = Math.floor(Math.min(firstImage.naturalWidth, maxFrameWidth));
    frameHeight.current = Math.floor(
      (frameWidth.current / firstImage.naturalWidth) * firstImage.naturalHeight
    );

    const frames: HTMLCanvasElement[] = [];
    for (let i = 0; i < images.length; i += 1) {
      const img = await loadImage(images[i]);
      const frame = createFrame(img);
      frames.push(frame);
      updateProgress(i / images.length, 'Processing images ...');
    }

    setFrames(frames);
  };

  // when video file is selected, start extracting frames from it
  useEffect(() => {
    // clean up first
    if (videoRef.current?.src) {
      URL.revokeObjectURL(videoRef.current.src);
      videoRef.current.src = '';
    }

    if (files?.[0]) {
      updateProgress(0, 'Extracting video frames ...');
      setFrames(NoFrames);

      if (files[0].type.startsWith('video/')) {
        const file = files[0];
        const url = URL.createObjectURL(file);
        videoRef.current && (videoRef.current.src = url);
      } else {
        const images = Array.from(files).filter((file) => file.type.startsWith('image/'));
        images.sort((a, b) => a.name.localeCompare(b.name));
        onImageFilesSelected(images);
      }
    }
  }, [files]);

  // invoke callback when all frames are extracted
  useEffect(() => {
    if (frames.length > 0 && frames.length >= expectedNumberOfFrames.current) {
      setAllFrames(frames);
      onDone();
    }
  }, [frames]);

  if (!activated) return null;

  return (
    <>
      <h2>Please select video or light field photoset</h2>

      <div className="alert alert-info shadow-lg max-w-xl">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current flex-shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>
            For Light Field photoset, please select{' '}
            <mark>
              <b>ALL</b>
            </mark>{' '}
            the image files.
          </span>
        </div>
      </div>

      {/* file input for selecting video file */}
      <input
        ref={inputRef}
        type="file"
        accept="video/*, image/*"
        multiple
        className="file-input h-auto w-[36rem] max-w-full mt-2"
        onChange={(e) => setFiles(e.target.files)}
      />

      {/* video element for extracting frames */}
      <video
        ref={videoRef}
        className="hidden"
        onLoadedMetadata={onVideoMetadataLoaded}
        onSeeked={onVideoSeeked}
      />
    </>
  );
};

ImageSequenceExtractor.title = 'Extract image sequence';
