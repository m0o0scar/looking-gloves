import styled from '@emotion/styled';
import { Slider } from '@mui/material';
import { scrollToBottom } from '@utils/dom';
import { FC, useState, useEffect } from 'react';

import { IconButton } from '@components/common/IconButton';
import { ImageSequenceAnimation } from '@components/common/ImageSequenceAnimation';
import { SequenceProcessorInfo } from '@components/lightfield/types';

const initialNumberOfFrames = 48;
const maxNumberOfFrames = 96;

const StyledSlider = styled(Slider)`
  .MuiSlider-rail {
    height: 0.5rem;
    background-color: rgb(31, 41, 55);
    opacity: 0.2;
  }

  .MuiSlider-track {
    height: 1.5rem;
    border-radius: 0;
    border: none;
    background-color: rgb(31, 41, 55);
  }

  .MuiSlider-thumb {
    width: 24px;
    height: 24px;
    border: 3px solid rgb(31, 41, 55);
    background-color: #fff;

    &:hover {
      box-shadow: none;
    }
  }
`;

export const LumaLightfieldRangeSelector: SequenceProcessorInfo = ({
  rawSequence,
  sequence,
  setSequence,
  activated,
  onDone,
}) => {
  const [framesRange, setFramesRange] = useState([-1, -1, -1]);
  const [canCancel, setCanCancel] = useState(false);

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

  const onCancel = () => {
    onDone();
  };

  // init range when sequence is loaded
  useEffect(() => {
    if (activated && rawSequence?.length) {
      let rangeStart, rangeEnd;
      if (rawSequence.length !== sequence?.length) {
        rangeStart = rawSequence.indexOf(sequence?.[0]!);
        rangeEnd = rawSequence.indexOf(sequence?.[sequence.length - 1]!);
        setCanCancel(true);
      } else {
        rangeStart = Math.floor((rawSequence.length - initialNumberOfFrames) / 2);
        rangeEnd = rangeStart + initialNumberOfFrames;
        setCanCancel(false);
      }
      const middle = Math.round((rangeStart + rangeEnd) / 2);
      setFramesRange([rangeStart, middle, rangeEnd]);

      scrollToBottom();
    }
  }, [rawSequence, sequence, activated]);

  return (
    <div className="flex flex-col items-center gap-2 max-w-full">
      <h2>Select frames</h2>
      <p>Drag the sliders below to select up to 96 frames</p>

      <div className="w-full flex items-center gap-4">
        <StyledSlider
          value={framesRange}
          onChange={(e, newValue) => onRangeChange(newValue as number[])}
          step={8}
          min={0}
          max={rawSequence?.length || 0}
          valueLabelDisplay="auto"
        />
        <IconButton
          iconType="cross"
          buttonClassName="btn-error"
          disabled={!canCancel}
          onClick={onCancel}
        />
        <IconButton iconType="tick" buttonClassName="btn-success" onClick={onConfirmFrames} />
      </div>

      {activated && (
        <ImageSequenceAnimation
          frames={rawSequence}
          start={framesRange[0]}
          end={framesRange[2]}
          style={{ width: 600 }}
        />
      )}
    </div>
  );
};

LumaLightfieldRangeSelector.title = 'Select range';
