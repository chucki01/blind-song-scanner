import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { playlistId } = req.query;

  if (!playlistId || typeof playlistId !== 'string')
    return res.status(400).json({ error: 'playlistId is required' });

  try {
    // Scraping del embed — igual que preview.ts, sin accessToken
    const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;
    const response = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'No se pudo cargar la playlist' });
    }

    const html = await response.text();

    // Extraer __NEXT_DATA__ igual que hace preview.ts
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!nextDataMatch) {
      return res.status(400).json({ error: 'No se encontraron datos en el embed' });
    }

    const nextData = JSON.parse(nextDataMatch[1]);

    // Navegar por la estructura para encontrar las canciones
    const state = nextData?.props?.pageProps?.state;
    const entities = state?.data?.entity;

    // trackList está directamente en entity
    const trackList = entities?.trackList || [];

    if (trackList.length === 0) {
      // Intentar ruta alternativa
      const data = nextData?.props?.pageProps?.data;
      const items = data?.entity?.trackList || [];
      if (items.length === 0) {
        return res.status(400).json({ 
          error: 'Playlist vacía o no pública. Asegúrate de que la playlist sea pública.',
          total: 0 
        });
      }
    }

    const tracks = trackList
      .filter((t: any) => t && (t.id || t.uri))
      .map((t: any) => {
        // Extraer ID del URI si es necesario (spotify:track:ID)
        const id = t.id || t.uri?.split(':').pop();
        const artist = t.subtitle || t.artists?.[0]?.name || 'Artista desconocido';
        return {
          id,
          name: t.title || t.name,
          artists: [{ name: artist }],
          duration_ms: t.duration || 180000,
        };
      })
      .filter((t: any) => t.id && t.name);

    console.log(`✅ Playlist ${playlistId}: ${tracks.length} canciones`);

    return res.status(200).json({
      tracks,
      total: tracks.length,
      success: true,
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
