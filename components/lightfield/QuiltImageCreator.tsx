import cls from 'classnames';
import { FC, useState, ReactNode, useMemo } from 'react';

import { ProgressBar } from '../common/ProgressBar';
import { QuiltImagePreview } from './QuiltImagePreview';

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

type SequenceProcessor = (params: SequenceProcessorProps) => ReactNode;

export interface QuiltImageCreatorProps {
  processors?: SequenceProcessor[];
  progressBarWidth?: number;
}

export const QuiltImageCreator: FC<QuiltImageCreatorProps> = ({ processors, progressBarWidth }) => {
  const [step, setStep] = useState(0);
  const [progressMessage, setProgressMessage] = useState<string | undefined>();
  const [progress, setProgress] = useState(0);
  const [rawSequence, setRawSequence] = useState<HTMLCanvasElement[] | undefined>();
  const [sequence, setSequence] = useState<HTMLCanvasElement[] | undefined>();
  const [enforceOrder, setEnforceOrder] = useState(false);
  const [focus, setFocus] = useState(0);

  // move to the next step
  const nextStep = () => {
    setStep((step) => step + 1);
  };

  // check if the last step has been reached, if yes then we can show quilt image here
  const reachedTheEnd = step === (processors?.length || 0);

  // params passed to the current step
  const processorParams = useMemo(
    () => ({
      rawSequence,
      setRawSequence: (sequence?: HTMLCanvasElement[]) => {
        setRawSequence(sequence);
        setSequence(sequence);
      },
      sequence,
      setSequence: (sequence?: HTMLCanvasElement[], enforceOrder?: boolean) => {
        setSequence(sequence);
        setEnforceOrder(enforceOrder || false);
      },
      focus,
      setFocus: (value: number) => {
        if (!enforceOrder) {
          setFocus(Math.abs(value));
          if (value < 0 && sequence?.length) setSequence([...sequence].reverse());
        } else {
          setFocus(value);
        }
      },
      progressMessage,
      setProgressMessage,
      setProgress,
      onDone: nextStep,
    }),
    [rawSequence, sequence, focus, enforceOrder, progressMessage]
  );

  return (
    <>
      {/* sequence processor of the current step */}
      {processors?.map((processor, index) => (
        <div key={index} className={cls('contents', { hidden: index !== step })}>
          {processor(processorParams)}
        </div>
      ))}

      <ProgressBar progress={progress} message={progressMessage} width={progressBarWidth} />

      {/* quilt image preview */}
      {reachedTheEnd && <QuiltImagePreview sequence={sequence} focus={focus} />}
    </>
  );
};
