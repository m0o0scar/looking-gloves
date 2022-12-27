import { Slider } from '@mui/material';
import { FC, useState, useEffect } from 'react';

import { ImageSequenceAnimation } from '@components/common/ImageSequenceAnimation';
import { SequenceProcessorInfo } from '@components/lightfield/types';

const initialNumberOfFrames = 48;
const maxNumberOfFrames = 96;

export const LumaLightfieldRangeSelector: SequenceProcessorInfo = ({
  rawSequence,
  setSequence,
  onDone,
}) => {
  const [framesRange, setFramesRange] = useState([-1, -1, -1]);

  // make sure the range is not too large
  const onRangeChange = (newRange: number[]) => {
    let [start, middle, end] = newRange;

    // if user drag the middle handle, then we need to adjust both the start and end
    if (middle !== framesRange[1]) {
      const offset = middle - framesRange[1];
      start = start + offset;
      end = end + offset;
    }
    // if user drag the start or end handle, limit the range and update middle handle
    else {
      if (end - start > maxNumberOfFrames) {
        if (start === framesRange[0]) {
          start = end - maxNumberOfFrames;
        } else if (end === framesRange[2]) {
          end = start + maxNumberOfFrames;
        }
      }
      middle = Math.round((start + end) / 2);
    }
    setFramesRange([start, middle, end]);
  };

  const onConfirmFrames = () => {
    if (rawSequence?.length) {
      setSequence([...rawSequence]?.slice(framesRange[0], framesRange[2]), true);
      onDone();
    }
  };

  // init range when sequence is loaded
  useEffect(() => {
    if (rawSequence?.length) {
      const rangeStart = Math.floor((rawSequence.length - initialNumberOfFrames) / 2);
      const rangeEnd = rangeStart + initialNumberOfFrames;
      const middle = Math.round((rangeStart + rangeEnd) / 2);
      setFramesRange([rangeStart, middle, rangeEnd]);
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
        end={framesRange[2]}
        width={300}
        height={400}
      />

      <button className="btn" onClick={onConfirmFrames}>
        Confirm
      </button>
    </>
  );
};

LumaLightfieldRangeSelector.title = 'Select range';
