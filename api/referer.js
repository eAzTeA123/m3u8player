export default async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "URL parameter is required" });
    }

    try {
        const response = await fetch(url, {
            headers: {
                "Referer": "https://caq21harderv991gpluralplay.xyz/", // Hier dein gewünschter Referer
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.text();
        res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
        res.send(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
