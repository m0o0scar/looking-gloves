import styled from '@emotion/styled';
import { Slider } from '@mui/material';
import { FC, useState, useEffect } from 'react';

import { IconButton } from '@/components/common/IconButton';
import { ImageSequenceAnimation } from '@/components/common/ImageSequenceAnimation';
import { useSequence } from '@/components/editor/useSequence';
import { SequenceProcessorInfo } from '@/components/processors/types';
import { scrollToBottom } from '@/utils/dom';

const initialNumberOfFrames = 48;
const maxNumberOfFrames = 96;

const roundTo8 = (n: number) => Math.round(n / 8) * 8;

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

  @media (prefers-color-scheme: dark) {
    .MuiSlider-rail {
      background-color: #2c3647;
      opacity: 1;
    }

    .MuiSlider-track {
      background-color: #a6adba;
    }

    .MuiSlider-thumb {
      border-color: #a6adba;
      background-color: #2a303c;
    }
  }
`;

export const LumaLightfieldRangeSelector: SequenceProcessorInfo = ({ activated, onDone }) => {
  const { sourceFrames, range, setRange, setFrames } = useSequence();

  const [framesRange, setFramesRange] = useState([-1, -1, -1]);

  // make sure the range is not too large
  const onRangeChange = (newRange: number[]) => {
    let [start, middle, end] = newRange;

    // if user drag the middle handle, then we need to adjust both the start and end
    if (middle !== framesRange[1]) {
      const offset = middle - framesRange[1];
      start = roundTo8(start + offset);
      end = roundTo8(end + offset);
    }
    // if user drag the start or end handle, limit the range and update middle handle
    else {
      start = roundTo8(start);
      end = roundTo8(end);
      if (end - start > maxNumberOfFrames) {
        if (start === framesRange[0]) {
          start = end - maxNumberOfFrames;
        } else if (end === framesRange[2]) {
          end = start + maxNumberOfFrames;
        }
      }
    }
    middle = (start + end) / 2;
    setFramesRange([start, middle, end]);
  };

  const onConfirmFrames = () => {
    setRange([framesRange[0], framesRange[2]]);
    setFrames(sourceFrames!.slice(framesRange[0], framesRange[2]));
    onDone();
  };

  useEffect(() => {
    if (activated && range && isFinite(range[1])) {
      const [start, end] = range;
      const middle = (start + end) / 2;
      setFramesRange([start, middle, end]);
      scrollToBottom();
    }
  }, [range, activated]);

  if (!activated) return null;

  return (
    <div className="flex flex-col items-center gap-2 max-w-full">
      <h2>Select frames</h2>
      <p>Drag the sliders below to select up to 96 frames</p>

      <div className="w-full flex items-center gap-4">
        <StyledSlider
          value={framesRange}
          onChange={(e, newValue) => onRangeChange(newValue as number[])}
          step={1}
          min={0}
          max={sourceFrames?.length || 0}
          valueLabelDisplay="auto"
        />
        <IconButton iconType="tick" buttonClassName="btn-success" onClick={onConfirmFrames} />
      </div>

      <ImageSequenceAnimation
        frames={sourceFrames}
        start={framesRange[0]}
        end={framesRange[2]}
        style={{ width: 600 }}
      />
    </div>
  );
};

LumaLightfieldRangeSelector.title = 'Select range';
