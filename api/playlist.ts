export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { playlistId, accessToken } = req.query;

  if (!playlistId || typeof playlistId !== 'string') {
    return res.status(400).json({ error: 'playlistId is required' });
  }

  if (!accessToken || typeof accessToken !== 'string') {
    return res.status(400).json({ error: 'accessToken is required' });
  }

  try {
    console.log('🎵 Cargando playlist:', playlistId);

    // Obtener las canciones de la playlist REAL
    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/items?fields=items(item(id,name,artists(name),duration_ms))&limit=50`,
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
        error: 'No se pudo cargar tu playlist. Verifica que sea pública y que tengas permisos.',
        status: tracksResponse.status,
        details: 'Error de Spotify API'
      });
    }

    const tracksData = await tracksResponse.json();
    console.log('✅ Tracks recibidos:', tracksData.items?.length);

    // Procesar tracks REALES de tu playlist
    const tracks = tracksData.items
      .filter((item: any) => item.item && item.item.id)
      .map((item: any) => ({
        id: item.item.id,
        name: item.item.name,
        artists: item.item.artists || [{ name: 'Artista Desconocido' }],
        duration_ms: item.item.duration_ms || 180000,
      }));

    if (tracks.length === 0) {
      return res.status(400).json({ 
        error: 'Tu playlist no tiene canciones válidas o está vacía.',
        total: 0 
      });
    }

    console.log('✅ Playlist cargada correctamente:', tracks.map(t => t.name));

    return res.status(200).json({ 
      tracks,
      total: tracks.length,
      success: true,
      playlistId: playlistId,
      message: 'Playlist real cargada correctamente'
    });
    
  } catch (error) {
    console.error('💥 Error inesperado:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor al cargar tu playlist.',
      details: 'Inténtalo de nuevo en unos minutos.'
    });
  }
}
