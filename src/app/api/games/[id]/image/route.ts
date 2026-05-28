import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG, JPEG, WebP, and GIF are allowed.' },
        { status: 415 },
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Max 5 MB.' }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : file.type === 'image/gif' ? 'gif' : 'jpg';
    const fileName = `${params.id}.${ext}`;

    const gamesDir = path.join(process.cwd(), 'public', 'games');
    await mkdir(gamesDir, { recursive: true });
    await writeFile(path.join(gamesDir, fileName), buffer);

    return NextResponse.json({ ok: true, url: `/games/${fileName}` });
  } catch (error) {
    console.error('[game-image-upload]', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
