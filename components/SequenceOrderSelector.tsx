import styled from '@emotion/styled';
import { FC, useState, useEffect, useRef } from 'react';

const StyledFramesContainer = styled.div`
  > canvas {
    max-width: 200px;
    border-radius: 8px;
    cursor: pointer;
  }
`;

export interface SequenceOrderSelectorProps {
  firstFrame?: HTMLCanvasElement;
  lastFrame?: HTMLCanvasElement;
  onOrderSelected?: (shouldReverse: boolean) => void;
}

export const SequenceOrderSelector: FC<SequenceOrderSelectorProps> = ({
  firstFrame,
  lastFrame,
  onOrderSelected,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const onClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const attr = (e.target as HTMLElement).getAttribute('data-frame-index');
    if (attr === 'first') onOrderSelected?.(false);
    if (attr === 'last') onOrderSelected?.(true);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    if (firstFrame && lastFrame) {
      firstFrame.setAttribute('data-frame-index', 'first');
      lastFrame.setAttribute('data-frame-index', 'last');
      containerRef.current.appendChild(firstFrame);
      containerRef.current.appendChild(lastFrame);
    }
  }, [firstFrame, lastFrame]);

  if (!firstFrame || !lastFrame) return null;

  return (
    <div className="flex flex-col items-center">
      <h1>Choose the beginning frame</h1>
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
