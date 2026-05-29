import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, readdir, unlink } from 'fs/promises';
import path from 'path';

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif'] as const;

const MIME_BY_EXT: Record<(typeof IMAGE_EXTENSIONS)[number], string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
};

function gamesDir(): string {
  return path.join(process.cwd(), 'public', 'games');
}

async function findGameImageFile(gameId: string): Promise<{ filePath: string; ext: string } | null> {
  const dir = gamesDir();
  for (const ext of IMAGE_EXTENSIONS) {
    const filePath = path.join(dir, `${gameId}.${ext}`);
    try {
      await readFile(filePath);
      return { filePath, ext };
    } catch {
      // try next extension
    }
  }
  return null;
}

async function removeExistingGameImages(gameId: string): Promise<void> {
  const dir = gamesDir();
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return;
  }

  const prefix = `${gameId}.`;
  await Promise.all(
    entries
      .filter((name) => name.startsWith(prefix))
      .map((name) => unlink(path.join(dir, name)).catch(() => undefined)),
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const match = await findGameImageFile(params.id);
  if (!match) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  const buffer = await readFile(match.filePath);
  const contentType = MIME_BY_EXT[match.ext as keyof typeof MIME_BY_EXT] ?? 'application/octet-stream';

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

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

    const ext =
      file.type === 'image/png'
        ? 'png'
        : file.type === 'image/webp'
          ? 'webp'
          : file.type === 'image/gif'
            ? 'gif'
            : 'jpg';
    const fileName = `${params.id}.${ext}`;

    const dir = gamesDir();
    await mkdir(dir, { recursive: true });
    await removeExistingGameImages(params.id);
    await writeFile(path.join(dir, fileName), buffer);

    return NextResponse.json({ ok: true, url: `/api/games/${params.id}/image` });
  } catch (error) {
    console.error('[game-image-upload]', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
