import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trackId = searchParams.get('trackId');

  if (!trackId) {
    return NextResponse.json({ error: 'trackId is required' }, { status: 400 });
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
      return NextResponse.json({ error: 'Failed to fetch embed' }, { status: 500 });
    }

    const html = await response.text();
    
    // Buscar preview URL en el HTML
    const previewRegex = /"audioPreview":\{"url":"([^"]+)"/;
    const match = html.match(previewRegex);
    
    if (match && match[1]) {
      // La URL viene escapada, la desescapamos
      const previewUrl = match[1].replace(/\\u0026/g, '&').replace(/\\/g, '');
      return NextResponse.json({ preview_url: previewUrl });
    } else {
      return NextResponse.json({ preview_url: null });
    }
  } catch (error) {
    console.error('Error fetching preview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
