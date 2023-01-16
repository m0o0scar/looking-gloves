/* eslint-disable @next/next/no-img-element */
import dayjs from 'dayjs';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { IconButton } from '@/components/common/IconButton';
import { PageContainer } from '@/components/common/PageContainer';
import { canvasToJpeg } from '@/utils/canvas';
import { getImageFromClipboard } from '@/utils/clipboard';
import { triggerDownload } from '@/utils/download';
import { convertPhotoToRGBD } from '@/utils/rgbd';

const RGBDPhotoPage: NextPage = () => {
  const [file, setFile] = useState<File | Blob | null>(null);
  const [rgbdPhoto, setRGBDPhoto] = useState<string | null>(null);

  const [pending, setPending] = useState(false);

  const saveRGBDPhoto = () => {
    if (rgbdPhoto) {
      const name = dayjs().format('YYYY-MM-DD_HH-mm-ss');
      triggerDownload(rgbdPhoto, `${name}-rgbd.jpg`);
    }
  };

  const saveDepthMap = () => {
    if (rgbdPhoto) {
      // draw the right part (depth map) of the rgbd photo onto a canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      img.src = rgbdPhoto;
      img.onload = () => {
        const width = img.width / 2;
        const height = img.height;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, width, 0, width, height, 0, 0, width, height);

        const name = dayjs().format('YYYY-MM-DD_HH-mm-ss');
        triggerDownload(canvasToJpeg(canvas), `${name}-depth-map.jpg`);
      };
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile((e.target.files || [])[0] || null);
  };

  const onClipboardButtonClick = async () => {
    const img = await getImageFromClipboard();
    if (img) setFile(img);
    else toast.warn('No image found in clipboard');
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
          toast.error('Failed to convert image into RGBD photo');
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

      <div className="flex gap-4 max-w-full">
        <IconButton
          tooltip="Paste from clipboard"
          iconType="clipboard"
          disabled={pending}
          onClick={onClipboardButtonClick}
        />
        <div className="form-control min-w-0 grow">
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

      {pending && <progress className="progress max-w-[415px]"></progress>}

      {rgbdPhoto && (
        <div className="flex flex-col items-end max-w-3xl">
          <img src={rgbdPhoto} alt="RGBD Photo" className="w-full rounded-lg" />
          <div className="flex gap-2">
            {/* save RGBD photo */}
            <IconButton
              tooltip="Download RGBD photo"
              buttonClassName="btn-success"
              iconType="download"
              onClick={saveRGBDPhoto}
            />

            {/* save depth map only */}
            <IconButton tooltip="Download depth map" iconType="download" onClick={saveDepthMap} />
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default RGBDPhotoPage;
