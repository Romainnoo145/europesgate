import { FC } from "react";

interface BridgeLogoProps {
  className?: string;
  variant?: "default" | "gradient" | "white";
}

export const BridgeLogo: FC<BridgeLogoProps> = ({
  className = "w-10 h-10",
  variant = "default"
}) => {
  const showTile = variant !== "gradient";

  const tileFill = variant === "white"
    ? "#ffffff"
    : "#ffffff";

  const bridgeFill = variant === "gradient" || variant === "white"
    ? "#ffffff"
    : "#000000";

  const archFill = variant === "gradient"
    ? "transparent"
    : variant === "white"
    ? "#ffffff"
    : "#ffffff";

  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      role="img"
      aria-labelledby="bridge-logo-title"
    >
      <title id="bridge-logo-title">Europe's Gate Bridge Logo</title>

      {/* Tile with rounded top-left corner */}
      <defs>
        <clipPath id="tileClip">
          <path d="M150 0H600V600H0V150C0 67.157 67.157 0 150 0Z" />
        </clipPath>
      </defs>
      {showTile && (
        <rect
          x="0"
          y="0"
          width="600"
          height="600"
          fill={tileFill}
          clipPath="url(#tileClip)"
        />
      )}

      {/* Bridge (filled shapes) */}
      <g fill={bridgeFill} stroke="none" fillRule="evenodd">
        <path d="M100 360 A200 200 0 0 1 500 360 L460 360 A160 160 0 0 0 140 360 Z" />
        <rect x="120" y="340" width="360" height="44" />
        <rect x="150" y="384" width="48" height="116" />
        <rect x="276" y="384" width="48" height="116" />
        <rect x="402" y="384" width="48" height="116" />
        <rect x="120" y="500" width="360" height="26" />
      </g>

      {/* Carve arches */}
      <g fill={archFill}>
        <path d="M140 500 A60 60 0 0 1 260 500 Z" />
        <path d="M260 500 A60 60 0 0 1 340 500 Z" />
        <path d="M380 500 A60 60 0 0 1 460 500 Z" />
      </g>
    </svg>
  );
};
