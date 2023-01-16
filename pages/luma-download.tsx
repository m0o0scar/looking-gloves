import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useState } from 'react';

const LumaDownloadPage: NextPage = () => {
  const [fetching, setFetching] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const [zipUrl, setZipUrl] = useState('');

  useEffect(() => {
    (async () => {
      if (pageUrl) {
        setFetching(true);
        setZipUrl('');

        const resp = await fetch(`/api/luma/getInfo?url=${encodeURIComponent(pageUrl)}`);
        const json = await resp.json();
        const {
          pageProps: {
            props: {
              pageProps: {
                artifacts: { light_field: lightFieldZipUrl },
              },
            },
          },
        } = json;

        setZipUrl(lightFieldZipUrl);
        setFetching(false);
      }
    })();
  }, [pageUrl]);

  return (
    <div className="p-4 flex flex-col gap-2">
      <input
        type="url"
        placeholder="Paste luma page url here"
        className="input w-full"
        onChange={(e) => setPageUrl(e.target.value)}
      />
      {fetching && <progress className="progress w-full"></progress>}
      {!fetching && zipUrl && (
        <a className="link" href={zipUrl} target="_blank" rel="noreferrer">
          Download lightfield zip file
        </a>
      )}
    </div>
  );
};

export default LumaDownloadPage;
