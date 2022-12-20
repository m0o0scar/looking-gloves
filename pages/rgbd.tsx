/* eslint-disable @next/next/no-img-element */
import { PRODUCT_NAME } from '@utils/constant';
import { convertPhotoToRGBD } from '@utils/rgbd';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import { PageContainer } from '@components/common/PageContainer';

const RGBDPhotoPage: NextPage = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [rgbdPhoto, setRGBDPhoto] = useState<string | null>(null);

  const [pending, setPending] = useState(false);

  useEffect(() => {
    (async () => {
      if (files?.length) {
        setRGBDPhoto(null);
        setPending(true);

        try {
          const result = await convertPhotoToRGBD(files[0]);
          setRGBDPhoto(result);
        } catch (e) {
          console.error(e);
        } finally {
          setPending(false);
        }
      }
    })();
  }, [files]);

  return (
    <PageContainer title="RGBD Photo" subtitle="RGBD Photo">
      <h2>Please select an image file</h2>

      <div className="form-control w-full max-w-xs">
        <input
          type="file"
          disabled={pending}
          accept="image/png, image/jpg, image/jpeg"
          className="file-input h-auto"
          onChange={(e) => setFiles(e.target.files)}
        />
        <label className="label">
          {pending && (
            <span className="label-text-alt">
              Converting into RGBD photo ...
            </span>
          )}
        </label>
      </div>

      {pending && <progress className="progress max-w-xs"></progress>}

      {rgbdPhoto && (
        <img
          src={rgbdPhoto}
          alt="RGBD Photo"
          className="max-w-full rounded-lg"
        />
      )}
    </PageContainer>
  );
};

export default RGBDPhotoPage;
