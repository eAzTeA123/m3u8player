export default async function handler(req, res) {
  const { url, referer, origin } = req.query;
  if (!url) {
    res.status(400).send("Fehlende URL");
    return;
  }
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
    };
    if (referer) headers['Referer'] = referer;
    if (origin) headers['Origin'] = origin;

    const fetchRes = await fetch(url, { headers });
    const contentType = fetchRes.headers.get('content-type') || '';
    const baseUrl = new URL(url);

    if (contentType.includes('mpegurl') || url.endsWith('.m3u') || url.endsWith('.m3u8')) {
      const playlistText = await fetchRes.text();
      const lines = playlistText.split(/\r?\n/);
      const rewritten = lines.map(line => {
        if (line && !line.startsWith('#')) {
          try {
            const segmentUrl = new URL(line, baseUrl).toString();
            return `/api/proxy?url=${encodeURIComponent(segmentUrl)}`
              + (referer ? `&referer=${encodeURIComponent(referer)}` : '')
              + (origin ? `&origin=${encodeURIComponent(origin)}` : '');
          } catch {
            return line;
          }
        }
        return line;
      }).join('\n');
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).send(rewritten);
    } else {
      const arrayBuffer = await fetchRes.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(fetchRes.status).send(Buffer.from(arrayBuffer));
    }
  } catch (error) {
    res.status(500).send("Proxy-Fehler: " + error.message);
  }
}
