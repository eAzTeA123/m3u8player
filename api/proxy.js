const fetch = require('node-fetch');

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
        'Origin': decodedRef,   // Dieser Header könnte wichtig sein, um CORS-Probleme zu verhindern
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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
