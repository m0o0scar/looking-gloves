import { PrivacyType } from '@lookingglass/blocks.js';
import cls from 'classnames';
import React, { FC, useState, useEffect } from 'react';

import { canvasToBlob } from '@/utils/canvas';
import { ASPECT_RATIO, COLS } from '@/utils/constant';
import { useOpen } from '@/utils/useOpen';

import { IconButton } from '../common/IconButton';
import { useSequence } from '../editor/useSequence';
import { useSource } from '../editor/useSource';
import useBlocksAuth from './useBlocksAuth';

export interface PublishToBlocksButtonProps {
  quiltImage?: HTMLCanvasElement;
}

export const PublishToBlocksButton: FC<PublishToBlocksButtonProps> = ({
  quiltImage,
}: PublishToBlocksButtonProps) => {
  const { loggedIn, blocksClient } = useBlocksAuth();
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

      if (hologram?.createQuiltHologram.permalink) {
        console.log('Published', hologram.createQuiltHologram.permalink);
        modalState.close();
      } else {
        console.log('Publish failed', hologram);
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
      setTitle(sourceInfo?.title || '');
      // TODO add luma nerf title and author as description
      setDescription(`Created with Looking Gloves🧤 https://lkg.vercel.app`);
      setPrivacy(PrivacyType.Unlisted);
      setPending(false);
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

          <div className="flex flex-col gap-2">
            {/* title */}
            <div className="form-control w-full">
              <label className="label">
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
              <label className="label">
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
              <label className="label">
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
