import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-lg bg-surface px-3.5 py-3 text-base text-fg shadow-border outline-none transition-[box-shadow] duration-150 placeholder:text-subtle hover:shadow-border-hover focus-visible:shadow-border-hover disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
