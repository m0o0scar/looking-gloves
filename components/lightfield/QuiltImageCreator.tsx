import { FC, useEffect } from 'react';

import { useCurrentStep } from '@components/hooks/useCurrentStep';
import { useProgress } from '@components/hooks/useProgress';
import { useSequence } from '@components/hooks/useSequence';

import { ProgressBar } from '../common/ProgressBar';
import { QuiltImageCreatorSteps } from './QuiltImageCreatorSteps';
import { QuiltImagePreview } from './QuiltImagePreview';
import { SequenceProcessorInfo } from './types';

export interface QuiltImageCreatorProps {
  processors?: SequenceProcessorInfo[];
  progressBarWidth?: number;
}

export const QuiltImageCreator: FC<QuiltImageCreatorProps> = ({ processors, progressBarWidth }) => {
  const { currentStep, nextStep, hasReachedEnd, backToBeginning } = useCurrentStep(
    processors?.length || 0
  );
  const { progress, progressMessage } = useProgress();
  const { reset } = useSequence();

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  useEffect(() => {
    if (currentStep === 0) {
      reset();
    }
  }, [currentStep, reset]);

  return (
    <>
      {/* steps */}
      <QuiltImageCreatorSteps processors={processors} />
      <div className="divider my-0"></div>

      {/* sequence processor of the current step */}
      {processors?.map((processor, index) => (
        <div key={index} className="contents">
          {processor({
            activated: index === currentStep,
            onDone: nextStep,
          })}
        </div>
      ))}

      {/* progress bar */}
      <ProgressBar progress={progress} message={progressMessage} width={progressBarWidth} />

      {/* quilt image preview */}
      {hasReachedEnd && <QuiltImagePreview onRestart={backToBeginning} />}
    </>
  );
};
