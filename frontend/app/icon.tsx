import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bridge (filled shapes) */}
          <g fill="#ffffff" stroke="none">
            <path d="M100 360 A200 200 0 0 1 500 360 L460 360 A160 160 0 0 0 140 360 Z" />
            <rect x="120" y="340" width="360" height="44" />
            <rect x="150" y="384" width="48" height="116" />
            <rect x="276" y="384" width="48" height="116" />
            <rect x="402" y="384" width="48" height="116" />
            <rect x="120" y="500" width="360" height="26" />
          </g>

          {/* Carve arches */}
          <g fill="transparent">
            <path d="M140 500 A60 60 0 0 1 260 500 Z" />
            <path d="M260 500 A60 60 0 0 1 340 500 Z" />
            <path d="M380 500 A60 60 0 0 1 460 500 Z" />
          </g>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
