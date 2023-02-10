import cls from 'classnames';
import { useState, useEffect } from 'react';

import { IconButton } from '@/components/common/IconButton';
import { LightFieldFocusViewer } from '@/components/common/LightFieldFocusViewer';
import { focusScale, useSequence } from '@/components/editor/useSequence';
import { scrollToBottom } from '@/utils/dom';

import { SequenceProcessorInfo } from './types';

export const LightFieldFocusEditor: SequenceProcessorInfo = ({ activated, onDone }) => {
  const { focus, setFocus, frames } = useSequence();

  // for holding the adjusted focus value from the slider
  const [adjustedFocus, setAdjustedFocus] = useState(0);

  const [fullscreen, setFullscreen] = useState(false);
  const toggleFullscreen = () => setFullscreen((value) => !value);

  // when confirm, save the focus value and exit the editor
  const onConfirm = () => {
    setFocus(adjustedFocus * focusScale);
    onDone();
  };

  // when the slider value changes, update the focus state and the texture
  const onFocusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAdjustedFocus(value);
  };

  // sync focus from props to state
  useEffect(() => {
    const value = focus / focusScale;
    setAdjustedFocus(value);
  }, [focus]);

  useEffect(() => {
    if (frames?.length && activated) {
      setFullscreen(false);
      scrollToBottom();
    }
  }, [frames, activated]);

  if (!activated || !frames?.length) return null;

  return (
    <div className="flex flex-col items-center md:items-start gap-2 max-w-full">
      <h2>Adjust light field focus</h2>
      <p>Drag the slider below to focus on your target</p>

      <div
        className={cls(
          'contents',
          fullscreen
            ? 'bg-white fixed left-0 right-0 top-0 bottom-0 p-2 !flex flex-col items-center gap-2'
            : ''
        )}
      >
        <div className={cls('relative max-w-full')}>
          <LightFieldFocusViewer focus={adjustedFocus} frames={frames} />
        </div>

        <div className="w-full flex items-center gap-4">
          <input
            type="range"
            className="range"
            min="-0.025"
            max="0.025"
            step="0.0001"
            value={adjustedFocus}
            onChange={onFocusChange}
          />
          <IconButton
            tooltip="Fullscreen"
            iconType={fullscreen ? 'contract' : 'expand'}
            buttonClassName="btn-accent"
            onClick={toggleFullscreen}
          />
          <IconButton
            tooltip="Confirm"
            iconType="tick"
            buttonClassName="btn-success"
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
};

LightFieldFocusEditor.title = 'Edit focus';
