import fetch from 'node-fetch';

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url || !url.startsWith('https://windnew.newkso.ru/')) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  try {
    const upstream = await fetch(url, {
      headers: {
        'Referer': 'https://caq21harderv991gpluralplay.xyz/',
        'Origin':  'https://caq21harderv991gpluralplay.xyz',
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) ' +
          'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 ' +
          'Mobile/15E148 Safari/604.1'
      }
    });
    res.setHeader('Content-Type',
      upstream.headers.get('content-type') || 'application/octet-stream');
    upstream.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stream proxy failed' });
  }
}
