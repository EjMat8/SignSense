"use client";

import { getSkinById } from "@/lib/skins";

type SkinAvatarProps = {
  skinId: string;
  size?: "sm" | "md";
  className?: string;
};

const sizeMap = { sm: "w-9 h-9", md: "w-11 h-11" };

export function SkinAvatar({
  skinId,
  size = "sm",
  className = "",
}: SkinAvatarProps) {
  const skin = getSkinById(skinId);
  const primary = skin?.primary ?? "#58CC02";
  const primaryDark = skin?.primaryDark ?? "#45A501";
  const primaryLight = skin?.primaryLight ?? "#7CE830";

  return (
    <div
      className={`${sizeMap[size]} shrink-0 rounded-full overflow-hidden bg-muted/50 flex items-center justify-center ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse
          cx="50"
          cy="55"
          rx="38"
          ry="40"
          fill={primary}
          stroke={primaryDark}
          strokeWidth="3"
        />
        <ellipse cx="50" cy="62" rx="24" ry="22" fill={primaryLight} />
        <ellipse cx="38" cy="42" rx="6" ry="7" fill="#FFFFFF" />
        <circle cx="40" cy="42" r="3.5" fill="#1A1A2E" />
        <ellipse cx="62" cy="42" rx="6" ry="7" fill="#FFFFFF" />
        <circle cx="64" cy="42" r="3.5" fill="#1A1A2E" />
        <path
          d="M 38 58 Q 50 70 62 58"
          fill="none"
          stroke="#1A1A2E"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
