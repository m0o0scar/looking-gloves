import { PrivacyType } from '@lookingglass/blocks.js';
import cls from 'classnames';
import React, { FC, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { canvasToBlob } from '@/utils/canvas';
import { ASPECT_RATIO, COLS } from '@/utils/constant';
import { useOpen } from '@/utils/useOpen';

import { IconButton } from '../common/IconButton';
import { useSequence } from '../editor/useSequence';
import { useSource } from '../editor/useSource';
import useBlocksAPI from './useBlocksAPI';

export interface PublishToBlocksButtonProps {
  quiltImage?: HTMLCanvasElement;
}

const PublishSuccessToast: FC<{ url: string }> = ({ url }) => {
  return (
    <div>
      Your hologram is published!{' '}
      <a className="link" href={url} target="_blank" rel="noreferrer">
        Check it out.
      </a>
    </div>
  );
};

export const PublishToBlocksButton: FC<PublishToBlocksButtonProps> = ({
  quiltImage,
}: PublishToBlocksButtonProps) => {
  const { loggedIn, blocksClient } = useBlocksAPI();
  const { frames } = useSequence();
  const { sourceInfo } = useSource();

  // modal to fill in details and publish to blocks
  const modalState = useOpen();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState(PrivacyType.Unlisted);
  const [pending, setPending] = useState(false);

  const publishToBlocks = async () => {
    if (frames?.length && quiltImage) {
      setPending(true);

      // convert quilt image canvas to image file
      const blob = await canvasToBlob(quiltImage);
      const file = new File([blob], 'quilt.png', { type: 'image/jpeg' });

      const rows = Math.ceil(frames.length / COLS);

      // upload quilt image file to Blocks
      try {
        const hologram = await blocksClient?.uploadAndCreateHologram(file, {
          // blocks related options
          isPublished: true,
          privacy,
          title,
          description,

          // quilt related options
          aspectRatio: ASPECT_RATIO,
          quiltCols: COLS,
          quiltRows: rows,
          quiltTileCount: frames.length,
        });

        const url = hologram?.createQuiltHologram.permalink;
        if (!url) throw new Error('Publish failed');

        toast.success(<PublishSuccessToast url={url} />, {
          icon: '🥳',
          position: 'bottom-right',
          autoClose: false,
        });
        modalState.close();
      } catch (error) {
        console.error('Publish failed', error);
        toast.error(`Rats! Something went wrong. Please try again later.`, {
          icon: '😣',
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
      }
      setPending(false);
    }
  };

  const onClick = () => {
    if (loggedIn) {
      modalState.open();
    }
  };

  useEffect(() => {
    if (modalState.opened) {
      if (sourceInfo?.sourceType === 'Luma') {
        const title = `${sourceInfo?.title} - by @${sourceInfo?.author}`;
        const description = [
          title,
          sourceInfo.url,
          '',
          'Made into Looking Glass hologram with the Looking Gloves 🧤',
          'https://lkg.vercel.app',
        ].join('\n');
        setTitle(title);
        setDescription(description);
      } else {
        setTitle(sourceInfo?.title || '');
        setDescription(`Made with the Looking Gloves 🧤 https://lkg.vercel.app`);
      }
      setPrivacy(PrivacyType.Unlisted);
      setPending(false);

      toast.dismiss();
    }
  }, [modalState.opened, sourceInfo]);

  return (
    <>
      <IconButton
        tooltip="Publish to Looking Glass Blocks"
        buttonClassName="btn-success"
        iconType="block"
        disabled={!loggedIn || !quiltImage}
        onClick={onClick}
      />

      <div className={cls('modal not-prose', { 'modal-open': modalState.opened })}>
        <div className="modal-box bg-slate-100">
          <h3 className="font-bold text-lg">Publish to Blocks</h3>
          <div className="divider"></div>

          <div className="flex flex-col gap-2">
            {/* title */}
            <div className="form-control w-full">
              <label className="label font-bold">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                placeholder="Title"
                className="input w-full"
                autoFocus
                disabled={pending}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            {/* description */}
            <div className="form-control w-full">
              <label className="label font-bold">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea w-full"
                placeholder="Description"
                disabled={pending}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {/* privacy */}
            <div className="form-control w-full">
              <label className="label font-bold">
                <span className="label-text">Privacy</span>
              </label>
              <select
                className="select w-full"
                disabled={pending}
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value as PrivacyType)}
              >
                <option value={PrivacyType.Public}>Public</option>
                <option value={PrivacyType.Unlisted}>Unlisted</option>
                <option value={PrivacyType.OnlyMe}>OnlyMe</option>
              </select>
            </div>
          </div>

          <div className="modal-action">
            <button className="btn btn-ghost" disabled={pending} onClick={modalState.close}>
              Cancel
            </button>
            <button
              className={cls('btn', { loading: pending })}
              disabled={pending}
              onClick={publishToBlocks}
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
