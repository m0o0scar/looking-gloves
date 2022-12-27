import { ReactNode, FC } from 'react';

export interface SequenceProcessorProps {
  rawSequence?: HTMLCanvasElement[];
  setRawSequence: (sequence?: HTMLCanvasElement[]) => void;

  sequence?: HTMLCanvasElement[];
  setSequence: (sequence?: HTMLCanvasElement[], enforceOrder?: boolean) => void;

  focus?: number;
  setFocus: (focus: number) => void;

  progressMessage?: string;
  setProgressMessage: (message: string) => void;
  setProgress: (progress: number) => void;

  onDone: () => void;
}

export type SequenceProcessor = (params: SequenceProcessorProps) => ReactNode;

export interface SequenceProcessorInfo extends FC<SequenceProcessorProps> {
  title: string;
}
