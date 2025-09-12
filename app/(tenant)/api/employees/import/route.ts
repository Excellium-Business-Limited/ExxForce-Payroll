import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Basic size limit: 5MB
    const contentLength = req.headers.get('content-length');
    if (contentLength && Number(contentLength) > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 5MB allowed.' }, { status: 413 });
    }

    if (contentType.includes('application/json')) {
      const data = await req.json();
      // TODO: Server-side validation & forward to backend import endpoint
      console.log('Received JSON import payload with', Array.isArray(data) ? data.length : 'unknown', 'items');
      return NextResponse.json({ ok: true, received: Array.isArray(data) ? data.length : 1 });
    }

    // For file uploads (FormData) handle as stream - return a stub response
    if (contentType.includes('multipart/form-data')) {
      // Next.js App Router doesn't parse multipart automatically. In production add a parser or forward the raw request.
      return NextResponse.json({ ok: true, message: 'Multipart upload received (stub).' });
    }

    return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
  } catch (err) {
    console.error('Import API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
