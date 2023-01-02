import { useLogStateChanges } from '@utils/react';
import { useEffect, useState } from 'react';
import { atom, useRecoilState } from 'recoil';

const allFramesAtom = atom<HTMLCanvasElement[] | undefined>({
  key: 'processors.allFrames',
  default: undefined,
});

const framesAtom = atom<HTMLCanvasElement[] | undefined>({
  key: 'processors.frames',
  default: undefined,
});

const focusAtom = atom({
  key: 'processors.focus',
  default: 0,
});

const enforceOrderAtom = atom({
  key: 'processors.enforceOrder',
  default: false,
});

const rangeAtom = atom<[number, number] | undefined>({
  key: 'processors.range',
  default: undefined,
});

export const useSequence = () => {
  const [allFrames, setAllFrames] = useRecoilState(allFramesAtom);
  const [frames, setFrames] = useRecoilState(framesAtom);
  const [focus, setFocus] = useRecoilState(focusAtom);
  const [enforceOrder, setEnforceOrder] = useRecoilState(enforceOrderAtom);
  const [range, setRange] = useRecoilState(rangeAtom);

  const reset = () => {
    setAllFrames(undefined);
    setFrames(undefined);
    setFocus(0);
    setEnforceOrder(false);
    setRange(undefined);
  };

  const setSequence = (sequence?: HTMLCanvasElement[], enforceOrder = false) => {
    setAllFrames(sequence);
    setEnforceOrder(enforceOrder);
  };

  const setFocusValue = (value: number) => {
    if (!enforceOrder) {
      setFocus(Math.abs(value));
      if (value < 0 && allFrames?.length) {
        setAllFrames([...allFrames].reverse());
      }
    } else {
      setFocus(value);
    }
  };

  // reset when allFrames changes
  useEffect(() => {
    if (allFrames && !range) {
      setRange([0, Math.min(allFrames.length, 96)]);
    }
  }, [allFrames, range, setRange]);

  // slice frames when allFrames & range change
  useEffect(() => {
    if (!allFrames) {
      setFrames(undefined);
    } else if (!range) {
      setFrames(allFrames);
    } else {
      let [start, end] = range;
      start = Math.max(0, start);
      end = Math.min(allFrames.length, end);
      setFrames(allFrames.slice(start, end));
    }
  }, [allFrames, range, setFrames]);

  return {
    allFrames,
    frames,
    focus,
    range,
    reset,
    setSequence,
    setFocus: setFocusValue,
    setRange,
  };
};
