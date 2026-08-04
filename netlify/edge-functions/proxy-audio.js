// Netlify Edge Function: true streaming reverse-proxy for audio files.
// Runs on Deno at the edge (no Lambda 6MB payload buffering limit), so it
// correctly supports byte-range requests, which the <audio> element needs
// for seeking/scrubbing through a track.

export default async (request, context) => {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Unsupported protocol');
    }
  } catch (e) {
    return new Response('Invalid url parameter', { status: 400 });
  }

  const upstreamHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/149.0.0.0 Safari/537.36',
  };
  const range = request.headers.get('range');
  if (range) upstreamHeaders['Range'] = range;

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: upstreamHeaders,
      redirect: 'follow',
    });

    const headers = new Headers();
    const passthrough = ['content-type', 'content-length', 'accept-ranges', 'content-range'];
    passthrough.forEach((h) => {
      const v = upstream.headers.get(h);
      if (v) headers.set(h, v);
    });
    if (!headers.get('accept-ranges')) headers.set('Accept-Ranges', 'bytes');

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (err) {
    return new Response('Proxy error: ' + err.message, { status: 500 });
  }
};

export const config = {
  path: '/api/proxy-audio',
};
