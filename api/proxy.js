import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url, ref } = req.query;

  if (!url || !ref) {
    return res.status(400).send('Fehlender Parameter: "url" und/oder "ref".');
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    const decodedRef = decodeURIComponent(ref);

    const response = await fetch(decodedUrl, {
      headers: {
        'Referer': decodedRef,
        'User-Agent': req.headers['user-agent'] || ''
      }
    });

    if (!response.ok) {
      return res.status(response.status).send('Stream konnte nicht geladen werden.');
    }

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send('Fehler beim Abrufen des Streams.');
  }
}
