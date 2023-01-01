import cls from 'classnames';
import { FC, useState, useMemo, useEffect, useCallback } from 'react';

import { useCurrentStep } from '@components/hooks/useCurrentStep';
import { useProgress } from '@components/hooks/useProgress';

import { ProgressBar } from '../common/ProgressBar';
import { QuiltImageCreatorSteps } from './QuiltImageCreatorSteps';
import { QuiltImagePreview } from './QuiltImagePreview';
import { SequenceProcessorInfo, SourceInfo } from './types';

export interface QuiltImageCreatorProps {
  processors?: SequenceProcessorInfo[];
  progressBarWidth?: number;
}

export const QuiltImageCreator: FC<QuiltImageCreatorProps> = ({ processors, progressBarWidth }) => {
  const { currentStep, nextStep, hasReachedEnd, backToBeginning } = useCurrentStep(
    processors?.length || 0
  );
  const { progress, progressMessage, reset: resetProgress } = useProgress();
  const [source, setSource] = useState<SourceInfo | undefined>();
  const [rawSequence, setRawSequence] = useState<HTMLCanvasElement[] | undefined>();
  const [sequence, setSequence] = useState<HTMLCanvasElement[] | undefined>();
  const [enforceOrder, setEnforceOrder] = useState(false);
  const [focus, setFocus] = useState(0);

  const reset = () => {
    resetProgress();
    setRawSequence(undefined);
    setSequence(undefined);
    setEnforceOrder(false);
    setFocus(0);
  };

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
    if (currentStep === 0) reset();
  }, [currentStep]);

  return (
    <>
      {/* steps */}
      <QuiltImageCreatorSteps processors={processors} />
      <div className="divider my-0"></div>

      {/* sequence processor of the current step */}
      {processors?.map((processor, index) => (
        <div key={index} className="contents">
          {processor({
            source,
            setSource,
            rawSequence,
            setRawSequence: setRawSequenceCallback,
            sequence,
            setSequence: setSequenceCallback,
            focus,
            setFocus: setFocusCallback,
            activated: index === currentStep,
            onDone: nextStep,
          })}
        </div>
      ))}

      {/* progress bar */}
      <ProgressBar progress={progress} message={progressMessage} width={progressBarWidth} />

      {/* quilt image preview */}
      {hasReachedEnd && (
        <QuiltImagePreview
          sequence={sequence}
          focus={focus}
          sourceInfo={source}
          onRestart={backToBeginning}
        />
      )}
    </>
  );
};
