/**
 * Tests for Progress component
 *
 * Testing stack: React Testing Library with the project's configured test runner (Jest or Vitest).
 * These tests do not introduce new deps and follow existing conventions.
 */

import React from "react";
import { render, screen } from "@testing-library/react";

/**
 * Prefer relative import to avoid ts/jest alias issues.
 * The Progress component is expected at src/components/ui/progress.tsx
 */
import { Progress } from "./progress";

describe("Progress", () => {
  function getIndicator(el: HTMLElement) {
    const indicator = el.querySelector('[data-slot="progress-indicator"]') as HTMLElement | null;
    if (!indicator) throw new Error("Progress indicator not found");
    return indicator;
  }

  it("renders a root element with data-slot and base classes", () => {
    const { container } = render(<Progress value={0} data-testid="progress" />);
    const root = container.querySelector('[data-slot="progress"]') as HTMLElement | null;
    expect(root).toBeTruthy();
    // Base classes expected on the root
    expect(root).toHaveClass("relative", "h-3", "w-full", "overflow-hidden", "rounded-full");
    expect(root).toHaveClass("border", "bg-white");
  });

  it("merges custom className with base classes", () => {
    const { container } = render(
      <Progress value={0} className="custom-class bg-red-500" />
    );
    const root = container.querySelector('[data-slot="progress"]') as HTMLElement;
    expect(root).toHaveClass("relative", "h-3", "w-full", "overflow-hidden", "rounded-full");
    expect(root).toHaveClass("border", "bg-white");
    expect(root).toHaveClass("custom-class", "bg-red-500");
  });

  it("renders an indicator with expected classes", () => {
    const { container } = render(<Progress value={25} />);
    const indicator = getIndicator(container as unknown as HTMLElement);
    expect(indicator).toHaveClass("bg-pink-400", "h-full", "w-full", "flex-1", "transition-all");
  });

  describe("transform style computation", () => {
    const cases: Array<{ value: number | null | undefined; expected: string }> = [
      { value: undefined, expected: "translateX(-100%)" }, // fallback to 0
      { value: null as unknown as number, expected: "translateX(-100%)" }, // null => 0 via ||
      { value: 0, expected: "translateX(-100%)" },
      { value: 25, expected: "translateX(-75%)" },
      { value: 50, expected: "translateX(-50%)" },
      { value: 75, expected: "translateX(-25%)" },
      { value: 100, expected: "translateX(-0%)" },
    ];

    test.each(cases)("value=%p yields %p", ({ value, expected }) => {
      const { container, rerender } = render(<Progress value={value as number} />);
      const indicator = getIndicator(container as unknown as HTMLElement);
      expect(indicator.style.transform).toBe(expected);

      // Re-render with same to ensure stable output
      rerender(<Progress value={value as number} />);
      expect(getIndicator(container as unknown as HTMLElement).style.transform).toBe(expected);
    });

    it("handles NaN by falling back to 0", () => {
      // @ts-expect-error intentional NaN to test falsy branch
      const { container } = render(<Progress value={Number.NaN} />);
      const indicator = getIndicator(container as unknown as HTMLElement);
      expect(indicator.style.transform).toBe("translateX(-100%)");
    });

    it("does not clamp negative values (shows >100% translation)", () => {
      const { container } = render(<Progress value={-10} />);
      const indicator = getIndicator(container as unknown as HTMLElement);
      // 100 - (-10) = 110 -> translateX(-110%)
      expect(indicator.style.transform).toBe("translateX(-110%)");
    });

    it("does not clamp values > 100 (may produce double minus in string)", () => {
      const { container } = render(<Progress value={150} />);
      const indicator = getIndicator(container as unknown as HTMLElement);
      // 100 - 150 = -50 -> "translateX(--50%)"
      expect(indicator.style.transform).toBe("translateX(--50%)");
    });
  });

  it("forwards additional props to the root element", () => {
    const { container } = render(
      <Progress value={40} id="my-progress" aria-label="Loading progress" />
    );
    const root = container.querySelector('[data-slot="progress"]') as HTMLElement;
    expect(root).toHaveAttribute("id", "my-progress");
    expect(root).toHaveAttribute("aria-label", "Loading progress");
  });

  it("matches expected DOM structure (root contains indicator)", () => {
    const { container } = render(<Progress value={10} />);
    const root = container.querySelector('[data-slot="progress"]');
    const indicator = container.querySelector('[data-slot="progress-indicator"]');
    expect(root).toContainElement(indicator);
  });
});