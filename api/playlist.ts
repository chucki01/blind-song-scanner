import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { playlistId, accessToken } = req.query;

  console.log('Playlist API called:', { playlistId, tokenLength: accessToken?.toString().length });

  if (!playlistId || typeof playlistId !== 'string') {
    console.log('❌ Missing playlistId');
    return res.status(400).json({ error: 'playlistId is required' });
  }

  if (!accessToken || typeof accessToken !== 'string') {
    console.log('❌ Missing accessToken');
    return res.status(400).json({ error: 'accessToken is required' });
  }

  try {
    console.log('🔄 Fetching playlist from Spotify API...');
    
    // Obtener información de la playlist
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log('📡 Spotify API response:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Spotify API error body:', errorText);
      
      return res.status(response.status).json({ 
        error: 'Failed to fetch playlist',
        status: response.status,
        details: errorText 
      });
    }

    const data = await response.json();
    console.log('✅ Playlist data received, items:', data.items?.length);

    // Filtrar solo tracks válidos (no episodios de podcast)
    const tracks = data.items
      .filter((item: any) => item.track && item.track.type === 'track')
      .map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists,
        duration_ms: item.track.duration_ms,
      }));

    console.log('✅ Filtered tracks:', tracks.length);

    return res.status(200).json({ 
      tracks,
      total: tracks.length,
      success: true
    });
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
