import { cn } from "@/core/lib/utils";
import Image from "next/image";

interface GoogleIconProps {
  className?: string;
}

export function GoogleIcon({ className }: GoogleIconProps) {
  return (
    <Image
      src="/image/google.svg"
      alt="Google"
      width={16}
      height={16}
      className={cn("h-4 w-4", className)}
    />
  );
}
