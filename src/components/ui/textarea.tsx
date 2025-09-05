import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Stateless textarea component that renders a styled HTML `<textarea>` and forwards native textarea props.
 *
 * The component applies a set of default utility classes (including focus, disabled, dark-mode and responsive variants),
 * always sets `data-slot="textarea"`, and merges any provided `className` with the defaults.
 *
 * All other props are spread onto the underlying `<textarea>` (e.g., `value`, `onChange`, `placeholder`, `rows`, etc.).
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base  transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "md:text-base bg-white",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
