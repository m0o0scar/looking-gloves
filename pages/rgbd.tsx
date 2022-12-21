/* eslint-disable @next/next/no-img-element */
import { getImageFromClipboard } from '@utils/clipboard';
import { triggerDownload } from '@utils/download';
import { convertPhotoToRGBD } from '@utils/rgbd';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import { PageContainer } from '@components/common/PageContainer';

const RGBDPhotoPage: NextPage = () => {
  const [file, setFile] = useState<File | Blob | null>(null);
  const [rgbdPhoto, setRGBDPhoto] = useState<string | null>(null);

  const [pending, setPending] = useState(false);

  const saveRGBDPhoto = () => {
    if (file && rgbdPhoto) {
      triggerDownload(rgbdPhoto, `${Date.now()}-rgbd.jpg`);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile((e.target.files || [])[0] || null);
  };

  const onClipboardButtonClick = async () => {
    const img = await getImageFromClipboard();
    if (img) setFile(img);
    else alert('No image found in clipboard');
  };

  useEffect(() => {
    (async () => {
      if (file) {
        setRGBDPhoto(null);
        setPending(true);

        try {
          const result = await convertPhotoToRGBD(file);
          setRGBDPhoto(result);
        } catch (e) {
          console.error(e);
        } finally {
          setPending(false);
        }
      }
    })();
  }, [file]);

  return (
    <PageContainer favicon="🏞️" title="RGBD Photo" subtitle="🏞️ RGBD Photo">
      <h2>Please select an image file</h2>

      <div className="flex gap-4">
        <div className="tooltip" data-tip="Paste from clipboard">
          <button className="btn btn-square" disabled={pending} onClick={onClipboardButtonClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
              />
            </svg>
          </button>
        </div>
        <div className="form-control w-full max-w-xs">
          <input
            type="file"
            disabled={pending}
            accept="image/png, image/jpg, image/jpeg"
            className="file-input h-auto"
            onChange={onFileInputChange}
          />
          <label className="label">
            {pending && <span className="label-text-alt">Converting into RGBD photo ...</span>}
          </label>
        </div>
      </div>

      {pending && <progress className="progress max-w-sm"></progress>}

      {rgbdPhoto && (
        <div className="flex flex-col items-end">
          <img src={rgbdPhoto} alt="RGBD Photo" className="max-w-3xl rounded-lg" />
          <button className="btn btn-square" onClick={saveRGBDPhoto}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </button>
        </div>
      )}
    </PageContainer>
  );
};

export default RGBDPhotoPage;
