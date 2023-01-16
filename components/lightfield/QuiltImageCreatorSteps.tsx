import cls from 'classnames';
import { FC, useState } from 'react';

import { useCurrentStep } from '@components/processors/useCurrentStep';

import { SequenceProcessorInfo } from './types';

export interface QuiltImageCreatorStepsProps {
  processors?: SequenceProcessorInfo[];
}

export const QuiltImageCreatorSteps: FC<QuiltImageCreatorStepsProps> = ({ processors }) => {
  const { currentStep, gotoStep, backToBeginning } = useCurrentStep(processors?.length || 0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  if (!processors?.length) return null;

  const onClick = (step: number) => {
    if (step > 0) gotoStep(step);
    else setConfirmDialogOpen(true);
  };

  const cancelBackToBeginning = () => {
    setConfirmDialogOpen(false);
  };

  const confirmBackToBeginning = () => {
    setConfirmDialogOpen(false);
    backToBeginning();
  };

  return (
    <>
      <div className="w-screen flex justify-center">
        <ul className="steps">
          {processors.map((processor, i) => {
            const active = currentStep >= i;
            return (
              <li
                key={i}
                className={cls('step', { 'step-primary': active, 'cursor-pointer': active })}
                onClick={active ? () => onClick(i) : undefined}
              >
                {processor.title}
              </li>
            );
          })}
          <li className={cls('step', { 'step-primary': currentStep >= processors.length })}>
            Done
          </li>
        </ul>
      </div>

      <div className={cls('modal not-prose', { 'modal-open': confirmDialogOpen })}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Start over?</h3>
          <p className="py-4">
            Going back to the beginning will reset all your progress. Are you sure?
          </p>
          <div className="modal-action">
            <button className="btn btn-ghost btn-error" onClick={cancelBackToBeginning}>
              Stay here
            </button>
            <button className="btn btn-error" onClick={confirmBackToBeginning}>
              Yes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
