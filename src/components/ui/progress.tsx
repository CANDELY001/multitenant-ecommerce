"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

/**
 * Responsive progress bar component using Radix UI primitives.
 *
 * Renders a track and an indicator whose horizontal translation represents progress from 0 to 100.
 *
 * @param value - Progress percentage between 0 and 100; treated as 0 when `undefined`.
 * @returns A JSX element rendering the progress track and indicator.
 */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        " relative h-3 w-full overflow-hidden rounded-full",
        "border bg-white",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-pink-400 h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
