import cls from 'classnames';
import { FC, useState, useMemo, useEffect } from 'react';

import { ProgressBar } from '../common/ProgressBar';
import { QuiltImageCreatorSteps } from './QuiltImageCreatorSteps';
import { QuiltImagePreview } from './QuiltImagePreview';
import { SequenceProcessorInfo } from './types';

export interface QuiltImageCreatorProps {
  processors?: SequenceProcessorInfo[];
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

  const reset = () => {
    setProgressMessage(undefined);
    setProgress(0);
    setRawSequence(undefined);
    setSequence(undefined);
    setEnforceOrder(false);
    setFocus(0);
  };

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

  // reset the state when we're back to the first step
  useEffect(() => {
    if (step === 0) reset();
  }, [step]);

  return (
    <>
      {/* steps */}
      <div className="divider my-0"></div>
      <QuiltImageCreatorSteps processors={processors} currentStep={step} onStepClick={setStep} />
      <div className="divider my-0"></div>

      {/* sequence processor of the current step */}
      {processors?.map((processor, index) => (
        <div key={index} className={cls('contents', { hidden: index !== step })}>
          {processor(processorParams)}
        </div>
      ))}

      {/* progress bar */}
      <ProgressBar progress={progress} message={progressMessage} width={progressBarWidth} />

      {/* quilt image preview */}
      {reachedTheEnd && (
        <QuiltImagePreview sequence={sequence} focus={focus} onRestart={() => setStep(0)} />
      )}
    </>
  );
};
