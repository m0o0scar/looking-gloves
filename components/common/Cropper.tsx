import styled from '@emotion/styled';
import cls from 'classnames';
import React, { FC, useState, ReactNode, useEffect } from 'react';
import ReactCrop, { Crop, PercentCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const StyledReactCrop = styled(ReactCrop)`
  .ReactCrop__crop-selection {
    border: 2px solid #fff;
  }

  .ReactCrop__drag-handle {
    &.ord-nw {
      margin-top: -10px;
      margin-left: -10px;
    }
    &.ord-ne {
      margin-top: -10px;
      margin-right: -10px;
    }
    &.ord-sw {
      margin-bottom: -10px;
      margin-left: -10px;
    }
    &.ord-se {
      margin-bottom: -10px;
      margin-right: -10px;
    }

    &::after {
      background-color: #fff;
      width: 20px;
      height: 20px;
      border-radius: 4px;
    }
  }
`;

export interface CropperProps {
  targetRatio: number;
  source?: HTMLCanvasElement;
  sourceRatio?: number;
  crop?: Crop;
  onChange?: (crop: Crop) => void;
  children?: ReactNode;
}

export const Cropper: FC<CropperProps> = ({
  targetRatio,
  source,
  sourceRatio: sourceRatioProp,
  crop,
  onChange: onChangeProp,
  children,
}: CropperProps) => {
  const [rectRatio, setRectRatio] = useState(1);

  const onChange = (_: PixelCrop, percentCrop: PercentCrop) => {
    onChangeProp?.(percentCrop);
  };

  useEffect(() => {
    const sourceRatio = source?.width! / source?.height! || sourceRatioProp;
    const rectRatio = targetRatio / sourceRatio! || 1;
    setRectRatio(rectRatio);

    if (crop) return;

    let rectWidth: number, rectHeight: number;
    if (rectRatio < 1) {
      rectWidth = rectRatio;
      rectHeight = 1;
    } else {
      rectWidth = 1;
      rectHeight = 1 / rectRatio;
    }

    const rectX = Math.round(((1 - rectWidth) / 2) * 100);
    const rectY = Math.round(((1 - rectHeight) / 2) * 100);

    const newCropRegion: Crop = {
      unit: '%',
      x: rectX,
      y: rectY,
      width: 100 - rectX * 2,
      height: 100 - rectY * 2,
    };

    onChangeProp?.(newCropRegion);
  }, [targetRatio, sourceRatioProp, source, crop, onChangeProp]);

  return (
    <StyledReactCrop
      className="rounded-lg"
      aspect={rectRatio}
      keepSelection
      crop={crop}
      onChange={onChange}
    >
      {children}
    </StyledReactCrop>
  );
};
