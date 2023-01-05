/* eslint-disable @next/next/no-img-element */
import { PRODUCT_DESC_SHORT, PRODUCT_NAME, PRODUCT_NAME_SHORT } from '@utils/constant';
import type { NextPage } from 'next';
import Head from 'next/head';

import { ExternalLink } from '@components/common/ExternalLink';
import { PageCard } from '@components/common/PageCard';
import { PageContainer } from '@components/common/PageContainer';

const HomePage: NextPage = () => {
  return (
    <PageContainer className="justify-center" hideHomeBtn favicon="🖼️">
      <Head>
        <title>{PRODUCT_NAME_SHORT}</title>
      </Head>

      <div className="flex flex-col items-center gap-2 max-w-5xl">
        <h1 className="text-center">
          <mark>{PRODUCT_NAME}</mark>
        </h1>
        <h2 className="text-center mt-0">{PRODUCT_DESC_SHORT}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <PageCard
            title="🔫 Luma NeRF"
            content={
              <>
                Convert <ExternalLink href="https://captures.lumalabs.ai/me">Luma AI</ExternalLink>{' '}
                NeRF to hologram with just a URL.
              </>
            }
            link="/luma"
            thumbnail="/assets/cover-luma.jpg"
            alert="❗ Light field output from Luma have curved camera path, which may lead to a toe-in/curve effect on the Looking Glass."
          />

          <PageCard
            title="🎥 Video"
            content={
              <>
                Capture/render a video following the{' '}
                <ExternalLink href="https://docs.lookingglassfactory.com/keyconcepts/capturing-a-lightfield/linear-light-field-capture">
                  Linear Light Field Capture
                </ExternalLink>{' '}
                guide, then convert the video to hologram.
              </>
            }
            link="/video"
            thumbnail="/assets/cover-images.jpg"
          />

          <PageCard
            title="🎞️ Images"
            content="Create hologram from a light field photoset."
            link="/images"
            thumbnail="/assets/cover-lightfield.jpg"
          />

          <PageCard
            title="🕵️ Quilt"
            content="Re-focus a blurry quilt image."
            link="/quilt"
            thumbnail="/assets/cover-quilt.jpg"
            blurThumbnail
            alert="⚠️ Experimental"
          />

          <PageCard
            title="🏞️ RGBD"
            content={
              <>
                Convert any picture into RGBD image with MiDaS depth estimation on{' '}
                <ExternalLink href="https://huggingface.co/spaces/moscartong/LookingGlassRGBD">
                  🤗 Hugging Face
                </ExternalLink>
                .
              </>
            }
            link="/rgbd"
            thumbnail="/assets/cover-rgbd.png"
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
