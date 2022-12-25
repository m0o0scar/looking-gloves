export interface SequenceExtractorProps {
  // when the source is provided,
  // a source could be a video file, image files, or a luma nerf url
  onSourceProvided?: () => void;

  // frames extraction progress callback
  onProgress?: (progress: number) => void;

  // when the frames are extracted
  // if enforceOrder is true, then light field creator should NOT reorder the frames
  onFramesExtracted?: (frames?: HTMLCanvasElement[], enforceOrder?: boolean) => void;
}
