import Link from "next/link";
import Image from "next/image";

import logoDark from "@/public/logos/gmp-logo.png";
import logoWhite from "@/public/logos/gmp-logo-white.png";
import iconDark from "@/public/logos/gmp-icon.png";
import iconWhite from "@/public/logos/gmp-icon-white.png";

interface LogoProps {
  white?: boolean;
  iconOnly?: boolean;
  className?: string;
  /** rendered height in px */
  height?: number;
}

export function Logo({ white = false, iconOnly = false, className = "", height = 38 }: LogoProps) {
  const src = iconOnly ? (white ? iconWhite : iconDark) : (white ? logoWhite : logoDark);
  // intrinsic aspect ratios: full 960x407, icon 421x400
  const ratio = iconOnly ? 421 / 400 : 960 / 407;
  const width = Math.round(height * ratio);

  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="GMP Tools — Início">
      <Image
        src={src}
        alt="GMP Tools"
        width={width}
        height={height}
        priority
        style={{ height, width: "auto" }}
      />
    </Link>
  );
}
