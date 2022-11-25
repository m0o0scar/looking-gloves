import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = req.query.url as string;
  if (!url) res.status(400).json({ error: 'Missing URL' });

  // fetch html page from luma
  try {
    const pageResp = await fetch(decodeURIComponent(url));
    const pageText = await pageResp.text();

    // extract page props from html
    const pageProps = (pageText.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s) || [])[1];
    const json = JSON.parse(pageProps);

    res.status(200).json(json);
  } catch (error) {
    res.status(500).end({ error: (error as Error).message });
  }
}
