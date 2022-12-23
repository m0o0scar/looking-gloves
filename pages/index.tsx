/* eslint-disable @next/next/no-img-element */
import { PRODUCT_DESC_SHORT, PRODUCT_NAME, PRODUCT_NAME_SHORT } from '@utils/constant';
import type { NextPage } from 'next';
import Head from 'next/head';

import { PageCard } from '@components/common/PageCard';
import { PageContainer } from '@components/common/PageContainer';

const HomePage: NextPage = () => {
  return (
    <PageContainer className="justify-center" hideHomeBtn favicon="🖼️">
      <Head>
        <title>{PRODUCT_NAME_SHORT}</title>
      </Head>

      <h1>
        <mark>{PRODUCT_NAME}</mark>
      </h1>
      <h2 className="mt-0">{PRODUCT_DESC_SHORT}</h2>

      <p className="max-w-3xl">
        Hi there! Welcome to <b>{PRODUCT_NAME}</b>, a webapp for you the creator to easily create
        and display holograms on your Looking Glass device. With me, you can convert your{' '}
        <u>video/images</u> (works for <b>NeRF</b> video output too 😎) and <u>any photos</u> and
        transform them into 3D holograms. <br />
        Let me know if you have any questions or feedback{' '}
        <a
          className="no-underline"
          href={`mailto:moscartong@gmail.com?subject=${PRODUCT_NAME} Feedback`}
        >
          💬
        </a>
      </p>

      <div className="flex flex-col sm:flex-row gap-5 max-w-full flex-wrap justify-center">
        <PageCard
          title="🎥 Video/Images"
          content={
            <>
              Capture/render a video or images following this{' '}
              <a
                href="https://docs.lookingglassfactory.com/keyconcepts/capturing-a-lightfield/linear-light-field-capture"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Linear Light Field Capture
              </a>{' '}
              method, then convert the video/images to light field.
            </>
          }
          link="/images"
          thumbnail="/assets/cover-images.jpg"
          alert="Tutorial coming soon 🚧."
          alertClassName=""
        />

        <PageCard
          title="🏞️ RGBD"
          content="Convert any picture into RGBD image"
          link="/rgbd"
          thumbnail="/assets/cover-rgbd.png"
        />
      </div>
    </PageContainer>
  );
};

export default HomePage;
