import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import { URL } from 'url';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/api/proxy', async (req, res) => {
  const { url, ref } = req.query;
  if (!url || !ref) return res.status(400).send('Missing parameters');

  try {
    const decodedUrl = decodeURIComponent(url);
    const decodedRef = decodeURIComponent(ref);
    const targetUrl = new URL(decodedUrl);

    const response = await fetch(decodedUrl, {
      headers: {
        'Referer': decodedRef,
        'Origin': decodedRef,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
      }
    });

    if (!response.ok) return res.status(response.status).send('Failed to load');

    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Type', contentType);

    if (contentType.includes('application/vnd.apple.mpegurl')) {
      const playlist = await response.text();
      const base = targetUrl.origin + targetUrl.pathname.substring(0, targetUrl.pathname.lastIndexOf('/') + 1);
      const rewritten = playlist.replace(/^(?!#)(.*\.ts)/gm, segment =>
        `/api/proxy?url=${encodeURIComponent(base + segment)}&ref=${encodeURIComponent(decodedRef)}`
      );
      res.send(rewritten);
    } else {
      response.body.pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
