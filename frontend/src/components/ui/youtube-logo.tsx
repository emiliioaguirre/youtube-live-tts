import Image from "next/image";
import { cn } from "@/lib/utils";

interface YouTubeLogoProps {
  className?: string;
}

export function YouTubeLogo({ className }: YouTubeLogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Logo"
      width={32}
      height={32}
      className={cn("size-8", className)}
    />
  );
}
