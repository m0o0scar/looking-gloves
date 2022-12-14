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
    <>
      <h2>Choose the beginning frame</h2>
      <p>
        Please click on the frame in which your camera is on the{' '}
        <mark className="p-1 rounded">left</mark>.
      </p>
      <StyledFramesContainer
        ref={containerRef}
        className="flex gap-4"
        onClick={onClick}
      ></StyledFramesContainer>
    </>
  );
};
