import { ReactNode, FC } from 'react';

export interface SourceInfo {
  title?: string;
  author?: string;
  url?: string;
  sourceType?: string;
}

export interface SequenceProcessorProps {
  source?: SourceInfo;
  setSource: (source?: SourceInfo) => void;

  rawSequence?: HTMLCanvasElement[];
  setRawSequence: (sequence?: HTMLCanvasElement[]) => void;

  sequence?: HTMLCanvasElement[];
  setSequence: (sequence?: HTMLCanvasElement[], enforceOrder?: boolean) => void;

  focus?: number;
  setFocus: (focus: number) => void;

  activated?: boolean;
  onDone: () => void;
}

export interface SequenceProcessorInfo extends FC<SequenceProcessorProps> {
  title: string;
}
