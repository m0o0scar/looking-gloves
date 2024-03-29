import { useState, useEffect } from 'react';
import { Crop } from 'react-image-crop';

import { Cropper } from '@/components/common/Cropper';
import { IconButton } from '@/components/common/IconButton';
import { LightFieldFocusViewer } from '@/components/common/LightFieldFocusViewer';
import { focusScale, useSequence } from '@/components/editor/useSequence';
import { ASPECT_RATIO } from '@/utils/constant';
import { scrollToBottom } from '@/utils/dom';

import { SequenceProcessorInfo } from './types';

export const LightFieldCropEditor: SequenceProcessorInfo = ({ activated, onDone }) => {
  const { focus, frames, cropRegion, setCropRegion } = useSequence();

  const onConfirm = () => {
    onDone();
  };

  useEffect(() => {
    if (frames?.length && activated) {
      scrollToBottom();
    }
  }, [frames, activated]);

  if (!activated) return null;

  return (
    <div className="flex flex-col items-center md:items-start gap-2 max-w-full">
      <h2>Crop</h2>
      <p>Drag the handles below to crop</p>

      <div className="relative max-w-full">
        <Cropper
          source={frames?.[0]}
          targetRatio={ASPECT_RATIO}
          crop={cropRegion}
          onChange={setCropRegion}
        >
          <LightFieldFocusViewer focus={focus / focusScale} frames={frames} />
        </Cropper>
      </div>

      <div className="w-full flex justify-end gap-4">
        <IconButton
          tooltip="Confirm"
          iconType="tick"
          buttonClassName="btn-success"
          onClick={onConfirm}
        />
      </div>
    </div>
  );
};

LightFieldCropEditor.title = 'Crop';
