import { cn } from "@/lib/utils";

export function GoldMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-champagne", className)}
      aria-hidden="true"
    >
      <rect
        x="7"
        y="7"
        width="18"
        height="9"
        rx="1.4"
        fill="currentColor"
        opacity="0.55"
      />
      <rect x="4" y="14" width="24" height="11" rx="1.6" fill="currentColor" />
    </svg>
  );
}
