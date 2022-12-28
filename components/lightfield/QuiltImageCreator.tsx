import cls from 'classnames';
import { FC, useState, useMemo, useEffect, useCallback } from 'react';

import { ProgressBar } from '../common/ProgressBar';
import { QuiltImageCreatorSteps } from './QuiltImageCreatorSteps';
import { QuiltImagePreview } from './QuiltImagePreview';
import { SequenceProcessorInfo, SourceInfo } from './types';

export interface QuiltImageCreatorProps {
  processors?: SequenceProcessorInfo[];
  progressBarWidth?: number;
}

export const QuiltImageCreator: FC<QuiltImageCreatorProps> = ({ processors, progressBarWidth }) => {
  const [step, setStep] = useState(0);
  const [progressMessage, setProgressMessage] = useState<string | undefined>();
  const [progress, setProgress] = useState(0);
  const [source, setSource] = useState<SourceInfo | undefined>();
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

  const setRawSequenceCallback = useCallback((sequence?: HTMLCanvasElement[]) => {
    setRawSequence(sequence);
    setSequence(sequence);
  }, []);

  const setSequenceCallback = useCallback(
    (sequence?: HTMLCanvasElement[], enforceOrder?: boolean) => {
      setSequence(sequence);
      setEnforceOrder(enforceOrder || false);
    },
    []
  );

  const setFocusCallback = useCallback(
    (value: number) => {
      if (!enforceOrder) {
        setFocus(Math.abs(value));
        if (value < 0 && sequence?.length) setSequence([...sequence].reverse());
      } else {
        setFocus(value);
      }
    },
    [enforceOrder, sequence]
  );

  // reset the state when we're back to the first step
  useEffect(() => {
    if (step === 0) reset();
  }, [step]);

  return (
    <>
      {/* steps */}
      <QuiltImageCreatorSteps processors={processors} currentStep={step} onStepClick={setStep} />
      <div className="divider my-0"></div>

      {/* sequence processor of the current step */}
      {processors?.map((processor, index) => (
        <div key={index} className={cls('contents', { hidden: index !== step })}>
          {processor({
            source,
            setSource,
            rawSequence,
            setRawSequence: setRawSequenceCallback,
            sequence,
            setSequence: setSequenceCallback,
            focus,
            setFocus: setFocusCallback,
            progressMessage,
            setProgressMessage,
            setProgress,
            activated: index === step,
            onDone: nextStep,
          })}
        </div>
      ))}

      {/* progress bar */}
      <ProgressBar progress={progress} message={progressMessage} width={progressBarWidth} />

      {/* quilt image preview */}
      {reachedTheEnd && (
        <QuiltImagePreview
          sequence={sequence}
          focus={focus}
          sourceInfo={source}
          onRestart={() => setStep(0)}
        />
      )}
    </>
  );
};
