import { FC } from 'react';

export interface SequenceProcessorProps {
  activated?: boolean;
  onDone: () => void;
}

export interface SequenceProcessorInfo extends FC<SequenceProcessorProps> {
  title: string;
}
