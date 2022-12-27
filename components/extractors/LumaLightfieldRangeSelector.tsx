import { Slider } from '@mui/material';
import { FC, useState, useEffect } from 'react';

import { ImageSequenceAnimation } from '@components/common/ImageSequenceAnimation';
import { SequenceProcessorProps } from '@components/lightfield/QuiltImageCreator';

const initialNumberOfFrames = 48;
const maxNumberOfFrames = 96;

export const LumaLightfieldRangeSelector: FC<SequenceProcessorProps> = ({
  rawSequence,
  setSequence,
  onDone,
}) => {
  const [framesRange, setFramesRange] = useState([0, 0]);

  const onRangeChange = (newRange: number[]) => {
    // make sure the range is not too large
    let [start, end] = newRange;
    if (end - start > maxNumberOfFrames) {
      if (start === framesRange[0]) {
        start = end - maxNumberOfFrames;
      } else if (end === framesRange[1]) {
        end = start + maxNumberOfFrames;
      }
    }
    setFramesRange([start, end]);
  };

  const onConfirmFrames = () => {
    if (rawSequence?.length) {
      setSequence([...rawSequence]?.slice(framesRange[0], framesRange[1]), true);
      onDone();
    }
  };

  useEffect(() => {
    if (rawSequence?.length) {
      const rangeStart = Math.floor((rawSequence.length - initialNumberOfFrames) / 2);
      const rangeEnd = rangeStart + initialNumberOfFrames;
      setFramesRange([rangeStart, rangeEnd]);
    }
  }, [rawSequence]);

  return (
    <>
      <Slider
        value={framesRange}
        onChange={(e, newValue) => onRangeChange(newValue as number[])}
        step={8}
        min={0}
        max={rawSequence?.length || 0}
        valueLabelDisplay="auto"
      />

      <ImageSequenceAnimation
        frames={rawSequence}
        start={framesRange[0]}
        end={framesRange[1]}
        width={300}
        height={400}
      />

      <button className="btn" onClick={onConfirmFrames}>
        Confirm
      </button>
    </>
  );
};
