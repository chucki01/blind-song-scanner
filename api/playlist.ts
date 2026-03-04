import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { playlistId, accessToken } = req.query;

  if (!playlistId || typeof playlistId !== 'string')
    return res.status(400).json({ error: 'playlistId is required' });
  if (!accessToken || typeof accessToken !== 'string')
    return res.status(400).json({ error: 'accessToken is required' });

  try {
    console.log('🎵 Cargando playlist:', playlistId);

    // Spotify API usa "track" no "item" en el campo fields
    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/items?fields=items(track(id,name,artists(name),duration_ms,is_local))&limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('📡 Spotify response:', tracksResponse.status);

    if (!tracksResponse.ok) {
      const errorText = await tracksResponse.text();
      console.log('❌ Error details:', errorText);
      return res.status(tracksResponse.status).json({
        error: 'No se pudo cargar la playlist.',
        details: errorText,
      });
    }

    const tracksData = await tracksResponse.json();
    console.log('✅ Items recibidos:', tracksData.items?.length);

    // Campo correcto: item.track (no item.item)
    const tracks = (tracksData.items || [])
      .filter((item: any) => item.track && item.track.id && !item.track.is_local)
      .map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists || [{ name: 'Artista Desconocido' }],
        duration_ms: item.track.duration_ms || 180000,
      }));

    console.log('✅ Tracks procesados:', tracks.length);

    if (tracks.length === 0) {
      return res.status(400).json({
        error: 'La playlist está vacía o no tiene canciones válidas.',
        total: 0,
      });
    }

    return res.status(200).json({
      tracks,
      total: tracks.length,
      success: true,
    });

  } catch (error) {
    console.error('💥 Error inesperado:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
