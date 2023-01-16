import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = req.query.url as string;
  if (!url) res.status(400).json({ error: 'Missing URL' });

  // fetch html page from luma
  try {
    const pageResp = await fetch(decodeURIComponent(url));
    const pageText = await pageResp.text();

    // extract page title
    const title = (pageText.match(/<title>(.*)<\/title>/) || [])[1] || '';

    // extract page props from html
    const pagePropsText = (pageText.match(
      /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s
    ) || [])[1];
    const pageProps = JSON.parse(pagePropsText);

    const json = { title, pageProps };
    res.status(200).json(json);
  } catch (error) {
    res.status(500).end({ error: (error as Error).message });
  }
}
