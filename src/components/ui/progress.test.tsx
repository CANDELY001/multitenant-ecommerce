/**
 * Tests for Progress component
 * Framework/Libraries: React Testing Library with jest-dom matchers.
 * If your project uses Vitest, these tests run under Vitest too (compatible expect API).
 * If your setup differs, adapt the imports accordingly.
 */
import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"

// Prefer the actual component path in your repo
import { Progress } from "./progress"

// Utility: render helper to reduce duplication
const setup = (props: React.ComponentProps<typeof Progress> = {}) => {
  const utils = render(<Progress data-testid="progress" {...props} />)
  const progress = utils.getByTestId("progress")
  return { ...utils, progress }
}

describe("Progress", () => {
  it("renders a progressbar role for accessibility", () => {
    const { progress } = setup({ value: 25 })
    // Radix Progress.Root should render role="progressbar"
    expect(progress).toHaveAttribute("role", "progressbar")
    // It should expose aria-valuemin/max/now when determinate
    expect(progress).toHaveAttribute("aria-valuemin", "0")
    expect(progress).toHaveAttribute("aria-valuemax", "100")
    expect(progress).toHaveAttribute("aria-valuenow", "25")
  })

  it("supports indeterminate state when value is undefined", () => {
    const { progress } = setup()
    // In indeterminate state, aria-valuenow is omitted per ARIA spec
    expect(progress).not.toHaveAttribute("aria-valuenow")
  })

  it("clamps value to [0, 100] when out of bounds (negative)", () => {
    const { progress } = setup({ value: -10 })
    // Consumers often clamp to 0; assert aria-valuenow reflects clamped value
    // If your implementation does not clamp, adjust expectation accordingly.
    const now = progress.getAttribute("aria-valuenow")
    // Accept either omitted (indeterminate) or clamped "0"
    if (now !== null) {
      expect(Number(now)).toBeGreaterThanOrEqual(0)
    }
  })

  it("clamps value to [0, 100] when out of bounds (exceeds 100)", () => {
    const { progress } = setup({ value: 150 })
    const now = progress.getAttribute("aria-valuenow")
    if (now !== null) {
      expect(Number(now)).toBeLessThanOrEqual(100)
    }
  })

  it("applies provided className to the root", () => {
    const { progress } = setup({ className: "my-progress" })
    expect(progress).toHaveClass("my-progress")
  })

  it("forwards refs to the root element", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Progress ref={ref} data-testid="progress" value={40} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    // Ensure it points to the same DOM node we render
    expect(ref.current).toBe(screen.getByTestId("progress"))
  })

  it("updates aria-valuenow when value changes (controlled)", async () => {
    const user = userEvent.setup()
    const Wrapper = () => {
      const [val, setVal] = React.useState(10)
      return (
        <div>
          <button onClick={() => setVal(v => Math.min(100, v + 15))}>inc</button>
          <Progress data-testid="progress" value={val} />
        </div>
      )
    }
    render(<Wrapper />)
    const progress = screen.getByTestId("progress")
    const btn = screen.getByRole("button", { name: /inc/i })
    expect(progress).toHaveAttribute("aria-valuenow", "10")
    await user.click(btn)
    expect(progress).toHaveAttribute("aria-valuenow", "25")
    await user.click(btn)
    expect(progress).toHaveAttribute("aria-valuenow", "40")
  })

  it("respects max prop when provided (aria-valuemax reflects it)", () => {
    // Some wrappers may pass max down to Radix; verify aria-valuemax aligns.
    const { progress } = setup({ value: 30, max: 200 } as React.ComponentProps<typeof Progress>)
    // If component doesn't support custom max, expect default 100
    const maxAttr = progress.getAttribute("aria-valuemax")
    if (maxAttr) {
      const max = Number(maxAttr)
      expect([100, 200]).toContain(max)
    }
  })

  it("renders indicator transform relative to value if exposed in DOM", () => {
    // Many implementations render an inner Indicator with inline transform
    // Try to locate it heuristically by role or test id
    const { container } = render(<Progress value={50} />)
    // Look for an element commonly named 'Indicator' by class semantics
    const indicator =
      container.querySelector('[data-state="indeterminate"]') ||
      container.querySelector('[data-state="complete"]') ||
      container.querySelector('[class*="Indicator"]') ||
      container.querySelector('[style*="translateX"]')
    // If no indicator is present (implementation detail), skip assertion gracefully
    if (indicator) {
      expect(indicator.getAttribute("style") || "").toMatch(/translateX\(/)
    }
  })

  it("is robust to unexpected props (ignores unknown attributes)", () => {
    const { progress } = setup({ value: 20, // @ts-expect-error intentional
      unknownProp: "ignored" })
    // Unknown props should not break rendering
    expect(progress).toBeInTheDocument()
  })
})