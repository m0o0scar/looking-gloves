import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';

const currentStepAtom = atom({
  key: 'processors.currentStep',
  default: 0,
});

export const useCurrentStep = (totalNumberOfSteps: number) => {
  const [currentStep, setCurrentStep] = useRecoilState(currentStepAtom);

  const hasReachedEnd = totalNumberOfSteps > 0 && currentStep === totalNumberOfSteps;

  const nextStep = () => {
    if (!hasReachedEnd) setCurrentStep(currentStep + 1);
  };

  const gotoStep = (step: number) => {
    if (step >= 0 && step < totalNumberOfSteps) setCurrentStep(step);
  };

  const backToBeginning = () => {
    setCurrentStep(0);
  };

  useEffect(() => {
    setCurrentStep(0);
  }, [totalNumberOfSteps, setCurrentStep]);

  return {
    currentStep,
    hasReachedEnd,
    nextStep,
    gotoStep,
    backToBeginning,
  };
};
