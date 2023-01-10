import { drawSourceToCanvas } from '@utils/canvas';
import { COLS } from '@utils/constant';
import React, { useState, useEffect, useRef } from 'react';

import { useProgress } from '@components/hooks/useProgress';
import { useSequence } from '@components/hooks/useSequence';
import { SequenceProcessorInfo } from '@components/lightfield/types';

const NoFrames: HTMLCanvasElement[] = [];

const maxFrameWidth = 1000;

export const VideoFramesExtractor: SequenceProcessorInfo = ({ activated, onDone }) => {
  const { updateProgress } = useProgress();
  const { setAllFrames, setFrames } = useSequence();

  // input element to select video file
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);

  // video element for extracting video frames
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFrames, setVideoFrames] = useState<HTMLCanvasElement[]>(NoFrames);

  const [processing, setProcessing] = useState(false);
  const expectedNumberOfFrames = useRef(0);
  const frameIndexRef = useRef(0);
  const frameWidth = useRef(0);
  const frameHeight = useRef(0);

  const createFrame = () => {
    return drawSourceToCanvas(videoRef.current!, frameWidth.current, frameHeight.current);
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
    const frame = createFrame();
    setVideoFrames((frames) => [...frames, frame]);

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
      setProcessing(false);
    }
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
      setVideoFrames(NoFrames);
      setProcessing(true);

      const file = files[0];
      const url = URL.createObjectURL(file);
      videoRef.current && (videoRef.current.src = url);
    }
  }, [files]);

  // invoke callback when all frames are extracted
  useEffect(() => {
    if (videoFrames.length > 0 && videoFrames.length >= expectedNumberOfFrames.current) {
      setAllFrames(videoFrames);
      setFrames(videoFrames);
      onDone();
    }
  }, [videoFrames]);

  if (!activated) return null;

  return (
    <>
      <h2>Please select a video file</h2>

      {/* file input for selecting video file */}
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        disabled={processing}
        className="file-input h-auto w-full sm:w-96 mt-2"
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

VideoFramesExtractor.title = 'Extract video frames';
