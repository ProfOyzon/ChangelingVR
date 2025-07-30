import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'Changeling VR';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: '#002033',
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: '2rem',
        }}
      >
        <div
          style={{
            fontSize: 64,
            color: '#ffcc66',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            padding: '2rem',
            border: '2px dashed #313131',
          }}
        >
          Changeling VR
        </div>
      </div>
    ),
  );
}
