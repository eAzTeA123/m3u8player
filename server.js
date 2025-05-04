const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

// Proxy-Endpunkt
app.get('/proxy', async (req, res) => {
  const { url, ref } = req.query;

  if (!url || !ref) {
    return res.status(400).send('Fehlender Parameter: "url" und/oder "ref".');
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    const decodedRef = decodeURIComponent(ref);

    // Abrufen der M3U8-Datei mit den erforderlichen Headern
    const response = await fetch(decodedUrl, {
      headers: {
        'Referer': decodedRef,
        'Origin': decodedRef,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
      }
    });

    // Überprüfen, ob die Antwort ok ist
    if (!response.ok) {
      return res.status(response.status).send('Stream konnte nicht geladen werden.');
    }

    // Content-Type für M3U8-Stream setzen
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    
    // Stream der Antwort zurück an den Client senden
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send('Fehler beim Abrufen des Streams.');
  }
});

// Server starten
app.listen(port, () => {
  console.log(`Proxy läuft auf Port ${port}`);
});
