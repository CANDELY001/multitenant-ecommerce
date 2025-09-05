/**
 * Tests for Textarea component.
 *
 * Testing Library & Framework:
 * - React Testing Library (@testing-library/react)
 * - User interactions via @testing-library/user-event
 * - Test runner: Vitest (prefer) or Jest (compatible with minor import changes)
 *
 * These tests focus on the behavior and DOM output of the Textarea component,
 * covering happy paths, edge cases, and failure-like conditions (invalid/disabled).
 */

import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

// Prefer local relative import to avoid TS path alias differences across repos
// If your component is in a different file, adjust the path accordingly.
import { Textarea } from "./textarea"

describe("Textarea", () => {
  test("renders a textarea element with data-slot attribute", () => {
    render(<Textarea />)
    const el = screen.getByRole("textbox") as HTMLTextAreaElement
    expect(el).toBeInTheDocument()
    expect(el.tagName.toLowerCase()).toBe("textarea")
    expect(el).toHaveAttribute("data-slot", "textarea")
  })

  test("applies default Tailwind utility classes", () => {
    render(<Textarea />)
    const el = screen.getByRole("textbox")
    const cls = el.getAttribute("class") || ""
    // Check a few representative classes from the default set
    expect(cls).toContain("border-input")
    expect(cls).toContain("placeholder:text-muted-foreground")
    expect(cls).toContain("focus-visible:ring-[3px]")
    expect(cls).toContain("rounded-md")
    expect(cls).toContain("min-h-16")
    expect(cls).toContain("w-full")
    expect(cls).toContain("md:text-sm") // ensure default responsive text class present
    // Also ensure the override group that's always included
    expect(cls).toContain("md:text-base")
    expect(cls).toContain("bg-white")
  })

  test("merges className prop with default classes", () => {
    render(<Textarea className="custom-class another-class" />)
    const el = screen.getByRole("textbox")
    const cls = el.getAttribute("class") || ""
    expect(cls).toContain("custom-class")
    expect(cls).toContain("another-class")
    // Ensure defaults still present
    expect(cls).toContain("border-input")
  })

  test("supports placeholder, id and name props", () => {
    render(<Textarea id="bio" name="bio" placeholder="Tell us about yourself" />)
    const el = screen.getByPlaceholderText("Tell us about yourself")
    expect(el).toHaveAttribute("id", "bio")
    expect(el).toHaveAttribute("name", "bio")
  })

  test("supports aria-invalid attribute for accessibility", () => {
    render(<Textarea aria-invalid="true" />)
    const el = screen.getByRole("textbox")
    expect(el).toHaveAttribute("aria-invalid", "true")
    // Class list contains aria-invalid utility variants statically
    const cls = el.getAttribute("class") || ""
    expect(cls).toContain("aria-invalid:")
  })

  test("respects disabled prop and is non-interactive", async () => {
    const user = userEvent.setup()
    render(<Textarea disabled defaultValue="cannot edit" />)
    const el = screen.getByDisplayValue("cannot edit")
    expect(el).toBeDisabled()
    // Attempting to type should not change value
    await user.type(el, " - trying to type")
    expect(el).toHaveValue("cannot edit")
  })

  test("uncontrolled usage with defaultValue allows typing to update value", async () => {
    const user = userEvent.setup()
    render(<Textarea defaultValue="hello" />)
    const el = screen.getByDisplayValue("hello")
    await user.type(el, " world")
    expect(el).toHaveValue("hello world")
  })

  test("controlled usage updates value via onChange", async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [val, setVal] = React.useState("start")
      return <Textarea value={val} onChange={(e) => setVal(e.currentTarget.value)} />
    }
    render(<Controlled />)
    const el = screen.getByDisplayValue("start")
    await user.type(el, "++")
    expect(el).toHaveValue("start++")
  })

  test("accepts rows and cols props to adjust size", () => {
    render(<Textarea rows={7} cols={33} />)
    const el = screen.getByRole("textbox")
    expect(el).toHaveAttribute("rows", "7")
    expect(el).toHaveAttribute("cols", "33")
  })

  test("focus behavior: autofocus prop sets initial focus", () => {
    render(
      <div>
        <button>before</button>
        <Textarea autoFocus />
      </div>
    )
    const el = screen.getByRole("textbox")
    expect(el).toHaveFocus()
  })

  test("passes through arbitrary data attributes", () => {
    render(<Textarea data-qa="bio-textarea" />)
    const el = screen.getByRole("textbox")
    expect(el).toHaveAttribute("data-qa", "bio-textarea")
  })

  test("forwards placeholder text content and supports empty value", async () => {
    render(<Textarea placeholder="empty ok" value="" readOnly />)
    const el = screen.getByPlaceholderText("empty ok")
    expect(el).toHaveValue("")
  })
})