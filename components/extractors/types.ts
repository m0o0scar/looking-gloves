export interface SequenceExtractorProps {
  onSourceProvided?: () => void;
  onProgress?: (progress: number) => void;
  onFramesExtracted?: (frames?: HTMLCanvasElement[]) => void;
}
