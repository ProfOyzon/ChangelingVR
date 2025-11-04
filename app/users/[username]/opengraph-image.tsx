import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { getProfileByUsername } from '@/lib/db/queries';

// Image metadata
export const alt = 'Changeling VR';
export const size = {
  width: 1200,
  height: 675,
};
export const contentType = 'image/png';

// Helper function to get the avatar URL
async function getAvatarUrl(avatarUrl: string | null): Promise<string> {
  if (!avatarUrl) {
    const logoData = await readFile(join(process.cwd(), 'public/placeholder.png'), 'base64');
    return `data:image/png;base64,${logoData}`;
  }

  try {
    const res = await fetch(avatarUrl);
    if (!res.ok) throw new Error('Failed to fetch image');

    const imageBuffer = Buffer.from(await res.arrayBuffer());
    const pngBuffer = await sharp(imageBuffer).png().toBuffer();
    const base64Image = pngBuffer.toString('base64');
    return `data:image/png;base64,${base64Image}`;
  } catch {
    const logoData = await readFile(join(process.cwd(), 'public/placeholder.png'), 'base64');
    return `data:image/png;base64,${logoData}`;
  }
}

// Image generation
export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  if (!username || typeof username !== 'string') return;

  const user = await getProfileByUsername(username);
  if (!user) return;

  const avatarUrl = await getAvatarUrl(user.avatarUrl);
  const logo = await readFile(join(process.cwd(), 'public/logo-with-name.svg'), 'base64');
  const logoUrl = `data:image/svg+xml;base64,${logo}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: '#002033',
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
      >
        <div
          style={{
            width: '50%',
            height: '100%',
            display: 'flex',
            padding: '4rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <img src={logoUrl} alt="Changeling VR Logo" width={240} height={60} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 64, color: '#e85206', fontWeight: 'bold' }}>
                {user.displayName}
              </span>
              <span style={{ fontSize: 24, color: '#ffcc66', opacity: 0.75 }}>
                @{user.username}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            width: '50%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            padding: '2rem',
            background: '#002033',
          }}
        >
          <img
            src={avatarUrl}
            alt={user.displayName || username}
            width={512}
            height={512}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              borderRadius: '2rem',
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
