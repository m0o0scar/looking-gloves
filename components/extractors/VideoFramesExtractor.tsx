import { COLS, ROWS } from '@utils/constant';
import React, { FC, useState, useEffect, useRef } from 'react';

import { SequenceExtractorProps } from './types';

const NoFrames: HTMLCanvasElement[] = [];

const numberOfFrames = COLS * ROWS;

export const VideoFramesExtractor: FC<SequenceExtractorProps> = ({
  onSourceProvided,
  onProgress,
  onFramesExtracted,
}) => {
  // input element to select video file
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);

  // video element for extracting video frames
  const videoRef = useRef<HTMLVideoElement>(null);
  const [frames, setFrames] = useState<HTMLCanvasElement[]>(NoFrames);

  const frameIndexRef = useRef(0);

  // start seeking frames when video loaded
  const onVideoMetadataLoaded = () => {
    // start extracting frames from the beginning
    frameIndexRef.current = 0;
    videoRef.current!.currentTime = 0;
  };

  // draw video frame to canvas and seek for the next frame
  const onVideoSeeked = () => {
    const { videoWidth, videoHeight } = videoRef.current!;

    // draw current frame of the video to the canvas
    const frame = document.createElement('canvas');
    frame.width = videoWidth;
    frame.height = videoHeight;
    const ctx = frame.getContext('2d')!;

    ctx.drawImage(videoRef.current!, 0, 0, videoWidth, videoHeight, 0, 0, videoWidth, videoHeight);
    setFrames((frames) => [...frames, frame]);

    // continue to seek for next frame, or callback when collected enough frames
    if (frameIndexRef.current < numberOfFrames - 1) {
      frameIndexRef.current += 1;
      onProgress?.(frameIndexRef.current / numberOfFrames);
      videoRef.current!.currentTime += videoRef.current!.duration / numberOfFrames;
    } else {
      onProgress?.(1);
    }
  };

  // when video file is selected, start extracting frames from it
  useEffect(() => {
    // clean up first
    if (videoRef.current!.src) {
      URL.revokeObjectURL(videoRef.current!.src);
      videoRef.current!.src = '';
    }

    if (files?.[0]) {
      onSourceProvided?.();
      onProgress?.(0);
      setFrames(NoFrames);

      const file = files[0];
      const url = URL.createObjectURL(file);
      videoRef.current!.src = url;
    }
  }, [files]);

  // invoke callback when frames are extracted
  useEffect(() => {
    if (!frames.length || frames.length >= numberOfFrames) {
      onFramesExtracted?.(frames);
    }
  }, [frames]);

  return (
    <>
      <h2>Please select a video file</h2>

      {/* file input for selecting video file */}
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="file-input h-auto"
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
