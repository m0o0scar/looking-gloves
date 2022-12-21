/* eslint-disable @next/next/no-img-element */
import { PRODUCT_DESC_SHORT, PRODUCT_NAME } from '@utils/constant';
import type { NextPage } from 'next';
import Head from 'next/head';

import { PageCard } from '@components/common/PageCard';
import { PageContainer } from '@components/common/PageContainer';

const HomePage: NextPage = () => {
  return (
    <PageContainer className="justify-center" hideHomeBtn>
      <Head>
        <title>{PRODUCT_NAME}</title>
      </Head>

      <h1>
        <mark>{PRODUCT_NAME}</mark>
      </h1>
      <h2 className="mt-0">{PRODUCT_DESC_SHORT}</h2>

      <p className="max-w-3xl">
        Hi there! Welcome to {PRODUCT_NAME}, a webapp for you the creator to easily create and
        display holograms on your Looking Glass device. With me, you can upload your linear light
        field videos (works for NeRF video output too 😎) and any photos and transform them into 3D
        holograms. <br />
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
          title="🎥 Video"
          content={
            <>
              Render or capture video following this{' '}
              <a
                href="https://docs.lookingglassfactory.com/keyconcepts/capturing-a-lightfield/linear-light-field-capture"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Linear Light Field Capture
              </a>{' '}
              method, then convert the video output to light field.
            </>
          }
          link="/video"
          thumbnail={
            <img
              src="/assets/cover-video.png"
              alt="cover"
              className="m-0 max-w-full aspect-[3/2]"
            />
          }
          alert="Tutorial coming soon 🚧."
          alertClassName=""
        />

        {/* <PageCard
          title="RGBD"
          content="Convert any picture into RGBD photo"
          link="/rgbd"
        /> */}
      </div>
    </PageContainer>
  );
};

export default HomePage;
