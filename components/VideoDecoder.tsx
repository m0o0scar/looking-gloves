import React, { FC, useState, useEffect, useRef } from 'react';
import { QuiltCanvas } from './QuiltCanvas';

export interface VideoDecoderProps {
  numberOfCols?: number;
  numberOfRows?: number;
  onFileSelected?: (file: File) => void;
  onProgress?: (progress: number) => void;
  onFramesExtracted?: (quiltCanvas?: QuiltCanvas) => void;
}

export const VideoDecoder: FC<VideoDecoderProps> = ({
  numberOfCols = 8,
  numberOfRows = 12,
  onFileSelected,
  onProgress,
  onFramesExtracted,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [files, setFiles] = useState<FileList | null>(null);
  const [reverse, setReverse] = useState(false);

  const quiltCanvasRef = useRef<QuiltCanvas | null>(null);
  const frameIndexRef = useRef(0);

  const numberOfFrames = numberOfCols * numberOfRows;

  const onVideoMetadataLoaded = () => {
    // create quilt canvas
    quiltCanvasRef.current = new QuiltCanvas(
      numberOfCols,
      numberOfRows,
      videoRef.current!.videoWidth,
      videoRef.current!.videoHeight,
      300,
      400
    );

    // start extracting frames from the beginning
    frameIndexRef.current = 0;
    videoRef.current!.currentTime = reverse ? videoRef.current!.duration : 0;
  };

  const onVideoSeeked = () => {
    // draw current frame of the video to the canvas
    quiltCanvasRef.current?.drawFrameAt(frameIndexRef.current, videoRef.current!);

    // continue to seek for next frame, or callback when collected enough frames
    if (frameIndexRef.current < numberOfFrames - 1) {
      frameIndexRef.current += 1;
      onProgress?.(frameIndexRef.current / numberOfFrames);
      videoRef.current!.currentTime += (videoRef.current!.duration / numberOfFrames) * (reverse ? -1 : 1);
    } else {
      onProgress?.(1);
      onFramesExtracted?.(quiltCanvasRef.current!);
    }
  };

  // when video file is selected, start extracting frames from it
  useEffect(() => {
    // clean up first
    if (videoRef.current!.src) {
      URL.revokeObjectURL(videoRef.current!.src);
      videoRef.current!.src = '';
    }

    onProgress?.(0);
    onFramesExtracted?.(undefined);

    if (files?.[0]) {
      const file = files[0];
      onFileSelected?.(file);

      const url = URL.createObjectURL(file);
      videoRef.current!.src = url;
    }
  }, [files, reverse]);

  return (
    <>
      <div className="flex gap-2">
        {/* button for triggering file picker */}
        <button className="btn" onClick={() => inputRef.current?.click()}>
          Select Video File
        </button>

        <div className="form-control">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="checkbox bg-gray-300"
              checked={reverse}
              onChange={(e) => setReverse(e.target.checked)}
            />
            <span className="label-text">Reverse</span>
          </label>
        </div>
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
      <video ref={videoRef} className="hidden" onLoadedMetadata={onVideoMetadataLoaded} onSeeked={onVideoSeeked} />
    </>
  );
};
