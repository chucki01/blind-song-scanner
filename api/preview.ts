import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { trackId } = req.query;

  if (!trackId || typeof trackId !== 'string') {
    return res.status(400).json({ error: 'trackId is required' });
  }

  try {
    // Hacer fetch al embed de Spotify
    const embedUrl = `https://open.spotify.com/embed/track/${trackId}`;
    const response = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch embed' });
    }

    const html = await response.text();
    
    // Buscar preview URL en el HTML con múltiples patrones
    const patterns = [
      /"audioPreview":\{"url":"([^"]+)"/,
      /"preview_url":"([^"]+)"/,
      /mp3-preview\/([^"]+\.mp3)/,
    ];
    
    let previewUrl = null;
    
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        previewUrl = match[1].replace(/\\u0026/g, '&').replace(/\\/g, '');
        if (previewUrl.includes('mp3-preview')) {
          break;
        }
      }
    }
    
    return res.status(200).json({ 
      preview_url: previewUrl,
      success: !!previewUrl 
    });
    
  } catch (error) {
    console.error('Error fetching preview:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
