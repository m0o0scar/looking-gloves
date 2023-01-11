import React from 'react';

import { IconButton } from '@components/common/IconButton';
import { useSequence } from '@components/hooks/useSequence';

export interface QuiltImageFlipOrderButtonProps {}

export function QuiltImageFlipOrderButton(props: QuiltImageFlipOrderButtonProps) {
  const { setFrames } = useSequence();

  const flip = () => {
    setFrames((frames) => (frames ? [...frames].reverse() : frames));
  };

  return (
    <IconButton
      tooltip="Flip sequence order"
      buttonClassName="btn-warning"
      iconType="back"
      onClick={flip}
    />
  );
}
