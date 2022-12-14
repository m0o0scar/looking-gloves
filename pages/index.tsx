/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { PageContainer } from '@components/common/PageContainer';

const HomePage: NextPage = () => {
  return (
    <PageContainer className="justify-center">
      <Head>
        <title>Lamu</title>
      </Head>

      <h1>
        <mark>Lamu</mark> - NeRF ➡️ Looking Glass
      </h1>
      <p className="max-w-3xl">
        Hi there! Welcome to Lamu, a webapp for converting NeRF (Neural Radiance
        Fields) into Looking Glass hologram. I&lsquo;m glad you&lsquo;re here
        and hope you enjoy using this tool. Let me know if you have any
        questions or feedback{' '}
        <a
          className="no-underline"
          href="mailto:moscartong@gmail.com?subject=Lamu Feedback"
        >
          💬
        </a>
        . Happy converting 😀!
      </p>

      <div className="flex flex-col sm:flex-row gap-5 max-w-full">
        <div className="card w-96 max-w-full bg-base-100 shadow-xl overflow-hidden">
          <video
            src="/assets/cover-lightfield.mov"
            poster="/assets/cover-video.png"
            muted
            loop
            autoPlay
            className="m-0 max-w-full"
          />
          <div className="card-body flex flex-col">
            <h2 className="card-title m-0">🔫 NeRF</h2>
            <div>
              Download light field from{' '}
              <a
                href="https://captures.lumalabs.ai/me"
                target="_blank"
                rel="noreferrer"
              >
                Luma AI
              </a>{' '}
              directly and convert to quilt image.
            </div>
            <div className="alert alert-warning text-xs">
              Some of the lightfield output from Luma AI have curved camera
              path, which may lead to a toe-in/curve effect on the Looking
              Glass.
            </div>
            <div className="grow" />
            <div className="card-actions justify-end">
              <Link href="/luma">
                <button className="btn btn-primary">Go</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="card w-96 max-w-full bg-base-100 shadow-xl overflow-hidden">
          <div className="relative flex">
            <img
              src="/assets/cover-video.png"
              alt="cover"
              className="m-0 max-w-full"
            />
            <img
              src="/assets/icons8-circled-play-100.png"
              alt="video icon"
              className="w-20 m-0 absolute right-4 bottom-6 invert drop-shadow-lg"
            />
          </div>
          <div className="card-body flex flex-col">
            <h2 className="card-title m-0">🎥 Video</h2>
            <div>
              Render video output manually, then convert the video output to
              quilt image.
            </div>
            <div className="alert text-xs">Tutorial coming soon 🚧.</div>
            <div className="grow" />
            <div className="card-actions justify-end">
              <Link href="/video">
                <button className="btn btn-primary">Go</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
