/* eslint-disable react/no-unescaped-entities */
import { drawSourceToCanvas } from '@utils/canvas';
import { loadImage } from '@utils/image';
import { wait } from '@utils/time';
import React, { useState, useEffect, useRef } from 'react';

import { useSequence } from '@components/hooks/useSequence';
import { SequenceProcessorInfo } from '@components/lightfield/types';

const Authorization = `Token ${process.env.NEXT_PUBLIC_REPLICATE_AUTH_TOKEN}`;

export const FrameInterpolationService: SequenceProcessorInfo = ({ activated, onDone }) => {
  const { frames, setFrames } = useSequence();

  const createPrediction = async (frame1: HTMLCanvasElement, frame2: HTMLCanvasElement) => {
    const request = new Request('/external/replicate/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization,
      },
      body: JSON.stringify({
        version: '4f88a16a13673a8b589c18866e540556170a5bcb2ccdc12de556e800e9456d3d',
        input: {
          frame1: frame1.toDataURL('image/jpeg', 0.9),
          frame2: frame2.toDataURL('image/jpeg', 0.9),
          times_to_interpolate: 1,
        },
      }),
    });

    const response = await fetch(request);
    const { id } = await response.json();
    return id as string;
  };

  const checkPredictionResult = async (id: string) => {
    const request = new Request(`/external/replicate/v1/predictions/${id}`, {
      method: 'GET',
      headers: {
        Authorization,
      },
    });

    const response = await fetch(request);
    const { output } = await response.json();
    if (output) return output as string;
    return null;
  };

  const createPredictionsAndWaitForCompletion = async () => {
    if (frames?.length) {
      const interval = 15000;

      console.log('creating predictions ...');
      const predictions: Promise<string>[] = [];
      for (let i = 0; i < frames.length - 1; i++) {
        console.log(`frame ${i} ~ ${i + 1} ...`);
        predictions.push(createPrediction(frames[i], frames[i + 1]));
        await wait(100);
      }

      const ids = await Promise.all(predictions);
      await wait(interval);

      const results: { id: string; i: number; url: string | null }[] = ids.map((id, i) => ({
        id,
        i,
        url: null,
      }));

      const checkResults = async () => {
        console.log('checking results ...');
        const urls = await Promise.all(
          results.map(({ id, url }) => (url ? url : checkPredictionResult(id)))
        );

        let hasUnfinished = false;
        for (let i = 0; i < urls.length; i++) {
          if (urls[i]) results[i].url = urls[i];
          else hasUnfinished = true;
        }

        console.log('results', urls, results);

        if (hasUnfinished) {
          await wait(interval);
          await checkResults();
        }
      };

      await checkResults();
      console.log('predictions all done');

      console.log('loading images ...');
      const images = await Promise.all(
        results.map(({ url }) =>
          loadImage(url!.replace('https://replicate.delivery/', '/external/replicate.delivery/'))
        )
      );

      console.log('drawing interpolate frames ...');
      const interpolateFrames = images.map((image) =>
        drawSourceToCanvas(image, image.naturalWidth, image.naturalHeight)
      );

      const newFrames: HTMLCanvasElement[] = [];
      for (let i = 0; i < interpolateFrames.length; i++) {
        newFrames.push(frames[i]);
        newFrames.push(interpolateFrames[i]);
      }
      newFrames.push(frames[frames.length - 1]);
      console.log('total number of frames', newFrames.length);
      setFrames(newFrames);
      onDone();
    }
  };

  const onStart = () => {
    createPredictionsAndWaitForCompletion();
  };

  if (!activated) return null;

  return (
    <>
      <h2>Increase frame rate by interpolating frames</h2>

      <div className="flex flex-col gap-2 max-w-full">
        <button className="btn" onClick={onStart}>
          Let's do this!
        </button>
        <button className="btn btn-warning" onClick={onDone}>
          No thank you
        </button>
      </div>
    </>
  );
};

FrameInterpolationService.title = 'Frame interpolation';
