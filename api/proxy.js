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
        'Origin': decodedRef, // Origin gleich Referer setzen
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send('Stream konnte nicht geladen werden.');
    }

    // Content-Type korrekt setzen für M3U8 oder TS-Dateien
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');

    // Stream direkt weiterleiten
    response.body.pipe(res);
  } catch (err) {
    console.error('Fehler:', err);
    res.status(500).send('Fehler beim Abrufen des Streams.');
  }
}
