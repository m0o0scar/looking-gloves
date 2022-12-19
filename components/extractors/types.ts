export interface SequenceExtractorProps {
  numberOfFrames: number;
  onSourceProvided?: () => void;
  onProgress?: (progress: number) => void;
  onFramesExtracted?: (frames?: HTMLCanvasElement[]) => void;
}
