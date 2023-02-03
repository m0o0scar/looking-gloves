import type { NextPage } from 'next';
import { useRef, useState } from 'react';

const TestPage: NextPage = () => {
  const [videoFileURL, setVideoFileURL] = useState('');
  const [beginning, setBeginning] = useState(-1);
  const [ending, setEnding] = useState(-1);

  const videoRef = useRef<HTMLVideoElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoFileURL) {
      URL.revokeObjectURL(videoFileURL);
    }

    const file = e.target.files?.[0];
    if (file) setVideoFileURL(URL.createObjectURL(file));
  };

  const onBeginningBtnClick = () => {
    setBeginning(videoRef.current?.currentTime || -1);
  };

  const onEndingBtnClick = () => {
    setEnding(videoRef.current?.currentTime || -1);
  };

  const onResetBtnClick = () => {
    setBeginning(-1);
    setEnding(-1);
  };

  const onTimeUpdate = () => {
    if (ending >= 0 && videoRef.current!.currentTime >= ending) {
      const time = beginning >= 0 ? beginning : 0;
      videoRef.current!.currentTime = time;
    }
  };

  return (
    <div className="p-5 flex flex-col gap-4">
      <input type="file" className="file-input file-input-bordered w-full" onChange={onChange} />
      {videoFileURL && (
        <>
          <video
            ref={videoRef}
            className="w-full rounded-lg"
            controls
            muted
            autoPlay
            src={videoFileURL}
            onTimeUpdate={onTimeUpdate}
          />
          <div className="flex gap-2">
            <button className="btn" onClick={onBeginningBtnClick}>
              Begining
            </button>
            <input
              type="text"
              placeholder="Beginning"
              value={beginning <= 0 ? '' : beginning}
              className="input input-bordered w-full max-w-xs"
            />
            <input
              type="text"
              placeholder="Ending"
              value={ending <= 0 ? '' : ending}
              className="input input-bordered w-full max-w-xs"
            />
            <button className="btn" onClick={onEndingBtnClick}>
              Ending
            </button>
            <button className="btn btn-warning" onClick={onResetBtnClick}>
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TestPage;
