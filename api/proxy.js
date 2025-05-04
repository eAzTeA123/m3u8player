import express from 'express';
import { spawn } from 'child_process';

const app = express();

app.get('/stream', (req, res) => {
  const url = req.query.url;
  const ref = req.query.ref;

  if (!url || !ref) return res.status(400).send('Fehlende Parameter');

  const stream = spawn('streamlink', [
    `--http-header`, `Referer=${ref}`,
    `--http-header`, `Origin=${ref}`,
    `--http-header`, `User-Agent=Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1`,
    url, 'best', '-O'
  ]);

  res.setHeader('Content-Type', 'video/mp4');

  stream.stdout.pipe(res);
  stream.stderr.on('data', data => console.error(data.toString()));
  stream.on('close', code => console.log(`Streamlink beendet: ${code}`));
});

app.listen(3000, () => {
  console.log('Server auf Port 3000');
});
