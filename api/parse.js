export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send("Nur POST erlaubt");
    return;
  }
  const { content } = req.body;
  if (!content) {
    res.status(400).send("Keine Playlist-Daten empfangen");
    return;
  }
  try {
    const lines = content.split(/\r?\n/);
    const channels = [];
    let current = null;
    for (let line of lines) {
      if (line.startsWith('#EXTINF')) {
        const nameMatch = line.match(/,(.*)$/);
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        current = {
          name: nameMatch ? nameMatch[1].trim() : "Unbekannt",
          url: null,
          logo: logoMatch ? logoMatch[1] : null
        };
      } else if (current && line.trim() && !line.startsWith('#')) {
        current.url = line.trim();
        channels.push(current);
        current = null;
      }
    }
    res.status(200).json(channels);
  } catch (err) {
    res.status(500).json({ error: "Parser-Fehler: " + err.message });
  }
}
