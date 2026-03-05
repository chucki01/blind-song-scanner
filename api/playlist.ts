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
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(track(id,name,artists(name),duration_ms,preview_url))&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Failed to fetch playlist',
        status: response.status 
      });
    }

    const data = await response.json();

    const tracks = data.items
      .filter((item: any) => item.track && item.track.id)
      .map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists,
        duration_ms: item.track.duration_ms,
        preview_url: item.track.preview_url,
      }));

    return res.status(200).json({ 
      tracks,
      total: tracks.length,
      success: true
    });
    
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
