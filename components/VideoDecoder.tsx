import React, { FC, useState, useEffect, useRef } from 'react';

const NoFrames: HTMLCanvasElement[] = [];

export interface VideoDecoderProps {
  numberOfFrames: number;
  frameWidth: number;
  onFileSelected?: (file: File) => void;
  onMetadataLoaded?: (video: HTMLVideoElement) => void;
  onProgress?: (progress: number) => void;
  onFramesExtracted?: (frames?: HTMLCanvasElement[]) => void;
}

export const VideoDecoder: FC<VideoDecoderProps> = ({
  numberOfFrames,
  frameWidth,
  onFileSelected,
  onMetadataLoaded,
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
    onMetadataLoaded?.(videoRef.current!);

    // start extracting frames from the beginning
    frameIndexRef.current = 0;
    videoRef.current!.currentTime = 0;
  };

  // draw video frame to canvas and seek for the next frame
  const onVideoSeeked = () => {
    const { videoWidth, videoHeight } = videoRef.current!;
    const frameHeight = (frameWidth * videoHeight) / videoWidth;

    // draw current frame of the video to the canvas
    const frame = document.createElement('canvas');
    frame.width = frameWidth;
    frame.height = frameHeight;
    const ctx = frame.getContext('2d')!;

    ctx.drawImage(
      videoRef.current!,
      0,
      0,
      videoWidth,
      videoHeight,
      0,
      0,
      frameWidth,
      frameHeight
    );
    setFrames((frames) => [...frames, frame]);

    // continue to seek for next frame, or callback when collected enough frames
    if (frameIndexRef.current < numberOfFrames - 1) {
      frameIndexRef.current += 1;
      onProgress?.(frameIndexRef.current / numberOfFrames);
      videoRef.current!.currentTime +=
        videoRef.current!.duration / numberOfFrames;
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
      setFrames(NoFrames);
      onProgress?.(0);

      const file = files[0];
      onFileSelected?.(file);

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
    <div>
      <h1>Select a video file</h1>
      <div className="flex gap-2">
        {/* button for triggering file picker */}
        <button className="btn" onClick={() => inputRef.current?.click()}>
          Select Video File
        </button>
      </div>

      {/* file input for selecting video file */}
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="file-input hidden"
        onChange={(e) => setFiles(e.target.files)}
      />

      {/* video element for extracting frames */}
      <video
        ref={videoRef}
        className="hidden"
        onLoadedMetadata={onVideoMetadataLoaded}
        onSeeked={onVideoSeeked}
      />
    </div>
  );
};
