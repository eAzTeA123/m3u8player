// Vercel Serverless Function in Next.js (TypeScript)
import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = req.query.url as string

  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Origin': 'https://caq21harderv991gpluralplay.xyz',
        'Referer': 'https://caq21harderv991gpluralplay.xyz/',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
      },
    })

    // Weiterleiten mit passenden Content-Type
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/vnd.apple.mpegurl')
    res.status(response.status)
    response.body?.pipe(res)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Stream proxy failed' })
  }
}
