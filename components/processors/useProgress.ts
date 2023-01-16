import { atom, useRecoilState } from 'recoil';

const progressAtom = atom({
  key: 'processors.progress',
  default: 0,
});

const progressMessageAtom = atom({
  key: 'processors.progress.message',
  default: '',
});

export const useProgress = () => {
  const [progress, setProgress] = useRecoilState(progressAtom);
  const [progressMessage, setProgressMessage] = useRecoilState(progressMessageAtom);

  const updateProgress = (progress: number, message = '') => {
    setProgress(progress);
    setProgressMessage(message);
  };

  const reset = () => {
    setProgress(0);
    setProgressMessage('');
  };

  return {
    progress,
    progressMessage,
    updateProgress,
    reset,
  };
};
