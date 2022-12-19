/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { PageCard } from '@components/common/PageCard';
import { PageContainer } from '@components/common/PageContainer';

const HomePage: NextPage = () => {
  return (
    <PageContainer className="justify-center">
      <Head>
        <title>👓 Nerfglass</title>
      </Head>

      <h1 className="hidden md:block">
        <mark>👓 Nerfglass</mark> - NeRF ➡️ Looking Glass
      </h1>

      <div className="block md:hidden">
        <h1>
          <mark>👓 Nerfglass</mark>
        </h1>
        <h2 className="mt-0">NeRF ➡️ Looking Glass</h2>
      </div>

      <p className="max-w-3xl">
        Hi there! Welcome to Nerfglass, a webapp for converting NeRF (Neural
        Radiance Fields) into Looking Glass hologram. I&lsquo;m glad
        you&lsquo;re here and hope you enjoy using this tool. Let me know if you
        have any questions or feedback{' '}
        <a
          className="no-underline"
          href="mailto:moscartong@gmail.com?subject=Nerfglass Feedback"
        >
          💬
        </a>
        . Happy converting 😀!
      </p>

      <div className="flex flex-col sm:flex-row gap-5 max-w-full">
        <PageCard
          title="🎥 Video"
          content="Render video output manually, then convert the video output to light field."
          link="/video"
          thumbnail={
            <img
              src="/assets/cover-video.png"
              alt="cover"
              className="m-0 max-w-full"
            />
          }
          alert="Tutorial coming soon 🚧."
          alertClassName=""
        />

        <PageCard
          title="🔫 NeRF"
          content={
            <>
              Download light field from{' '}
              <a
                href="https://captures.lumalabs.ai/me"
                target="_blank"
                rel="noreferrer"
              >
                Luma AI
              </a>{' '}
              directly and convert to light field.
            </>
          }
          link="/luma"
          thumbnail={
            <video
              src="/assets/cover-lightfield.mp4"
              poster="/assets/cover-lightfield-poster.jpg"
              muted
              loop
              autoPlay
              playsInline
              className="m-0 max-w-full"
            />
          }
          alert="Some of the light field output from Luma AI have curved camera path, which may lead to a toe-in/curve effect on the Looking Glass."
          alertClassName="alert-warning"
        />
      </div>
    </PageContainer>
  );
};

export default HomePage;
