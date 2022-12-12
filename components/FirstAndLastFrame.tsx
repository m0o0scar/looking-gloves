import styled from '@emotion/styled';
import { FC, useState, useEffect, useRef } from 'react';

const StyledFramesContainer = styled.div`
  > canvas {
    max-width: 200px;
    border-radius: 8px;
    cursor: pointer;
  }
`;

export interface FirstAndLastFrameProps {
  frames?: HTMLCanvasElement[];
  onFirstFrameSelected?: (shouldReverse: boolean) => void;
}

export const FirstAndLastFrame: FC<FirstAndLastFrameProps> = ({
  frames,
  onFirstFrameSelected,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const onClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const attr = (e.target as HTMLElement).getAttribute('data-frame-index');
    if (attr === 'first') onFirstFrameSelected?.(false);
    if (attr === 'last') onFirstFrameSelected?.(true);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    if (frames && frames.length > 1) {
      const firstFrame = frames[0];
      const lastFrame = frames[frames.length - 1];

      firstFrame.setAttribute('data-frame-index', 'first');
      lastFrame.setAttribute('data-frame-index', 'last');

      containerRef.current.appendChild(firstFrame);
      containerRef.current.appendChild(lastFrame);
    }
  }, [frames]);

  if (!frames?.length) return null;

  return (
    <div>
      <h1>Choose the first frame</h1>
      <p>
        Please click on the frame in which your target appears on the right
        side.
      </p>
      <StyledFramesContainer
        ref={containerRef}
        className="flex gap-4"
        onClick={onClick}
      ></StyledFramesContainer>
    </div>
  );
};
