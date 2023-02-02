import { useEffect } from 'react';
import { Crop } from 'react-image-crop';
import { atom, useRecoilState } from 'recoil';

const sourceFramesAtom = atom<HTMLCanvasElement[] | undefined>({
  key: 'processors.sourceFrames',
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

const cropRegionAtom = atom<Crop | undefined>({
  key: 'processors.cropRegion',
  default: undefined,
});

export const focusScale = 10;

export const useSequence = () => {
  const [sourceFrames, setSourceFrames] = useRecoilState(sourceFramesAtom);
  const [frames, setFrames] = useRecoilState(framesAtom);
  const [focus, setFocus] = useRecoilState(focusAtom);
  const [enforceOrder, setEnforceOrder] = useRecoilState(enforceOrderAtom);
  const [range, setRange] = useRecoilState(rangeAtom);
  const [cropRegion, setCropRegion] = useRecoilState(cropRegionAtom);

  const reset = () => {
    setSourceFrames(undefined);
    setFrames(undefined);
    setFocus(0);
    setEnforceOrder(false);
    setRange(undefined);
    setCropRegion(undefined);
  };

  const setFocusValue = (value: number) => {
    if (!enforceOrder) {
      setFocus(Math.abs(value));
      if (value < 0 && frames?.length) {
        setFrames([...frames].reverse());
      }
    } else {
      setFocus(value);
    }
  };

  // reset when allFrames changes
  useEffect(() => {
    if (sourceFrames && !range) {
      // select the middle 48 frames
      const middle = Math.floor(sourceFrames.length / 2 / 8) * 8;
      setRange([middle - 24, middle + 24]);
    }
  }, [sourceFrames, range, setRange]);

  return {
    sourceFrames,
    setSourceFrames,

    frames,
    setFrames,

    focus,
    setFocus: setFocusValue,

    range,
    setRange,

    cropRegion,
    setCropRegion,

    setEnforceOrder,
    reset,
  };
};
