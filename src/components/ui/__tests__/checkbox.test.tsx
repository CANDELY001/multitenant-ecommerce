/**
 * Test library/framework: React Testing Library with Jest/Vitest (jsdom).
 * These tests assert structure, accessibility, behavior, and edge cases for the Checkbox component.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Prefer relative import to avoid relying on tsconfig path aliases in test environment.
import { Checkbox } from "../checkbox";

// Helper to query by data-slot to align with component structure
const getCheckboxRoot = () => screen.getByRole("checkbox");
const getIndicator = () => screen.getByTestId("checkbox-indicator") || screen.getByLabelText("indicator", { selector: "[data-slot='checkbox-indicator']" });

/**
 * Since the component uses Radix Checkbox under the hood, role="checkbox" and aria-checked states are expected.
 * We avoid mocking lucide-react or @radix-ui/react-checkbox to keep behavior realistic; jsdom handles button/ARIA fine.
 */

describe("Checkbox (ui/checkbox)", () => {
  it("renders with role=checkbox and data-slot attributes", () => {
    render(<Checkbox aria-label="demo checkbox" />);
    const root = getCheckboxRoot();
    expect(root).toBeInTheDocument();
    // data-slot on root
    expect(root).toHaveAttribute("data-slot", "checkbox");
    // indicator exists and is nested
    const indicator = screen.getByTestId("checkbox-indicator");
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute("data-slot", "checkbox-indicator");
    expect(root).toContainElement(indicator);
  });

  it("merges className props and retains base classes (including bg-white)", () => {
    render(<Checkbox aria-label="checkbox" className="custom-class another" />);
    const root = getCheckboxRoot();
    expect(root).toHaveClass("bg-white");
    expect(root).toHaveClass("custom-class");
    expect(root).toHaveClass("another");
    // basic shape-related classes expected from the component
    expect(root.className).toMatch(/rounded-\[4px\]/);
    expect(root.className).toMatch(/size-4/);
  });

  it("is unchecked by default and toggles to checked on click", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="toggle me" />);
    const root = getCheckboxRoot();

    // Unchecked initial state
    expect(root).toHaveAttribute("aria-checked", "false");

    await user.click(root);
    // Toggled state
    expect(root).toHaveAttribute("aria-checked", "true");

    await user.click(root);
    expect(root).toHaveAttribute("aria-checked", "false");
  });

  it("supports keyboard interaction (Space toggles check state)", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="keyboard" />);
    const root = getCheckboxRoot();

    root.focus();
    expect(root).toHaveFocus();

    await user.keyboard("[Space]");
    expect(root).toHaveAttribute("aria-checked", "true");

    await user.keyboard("[Space]");
    expect(root).toHaveAttribute("aria-checked", "false");
  });

  it("respects defaultChecked for uncontrolled usage", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="default" defaultChecked />);
    const root = getCheckboxRoot();

    expect(root).toHaveAttribute("aria-checked", "true");
    await user.click(root);
    expect(root).toHaveAttribute("aria-checked", "false");
  });

  it("invokes onCheckedChange callback with correct values", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi ? vi.fn() : (jest.fn && jest.fn()) || (() => {});
    render(<Checkbox aria-label="cb" onCheckedChange={onCheckedChange} />);
    const root = getCheckboxRoot();

    await user.click(root);
    // Radix passes boolean true/false (and 'indeterminate' when applicable)
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    await user.click(root);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="disabled" disabled />);
    const root = getCheckboxRoot();

    expect(root).toHaveAttribute("aria-disabled", "true");
    const before = root.getAttribute("aria-checked");
    await user.click(root);
    expect(root).toHaveAttribute("aria-checked", before);
  });

  it("forwards arbitrary aria-* attributes (e.g., aria-invalid)", () => {
    render(<Checkbox aria-label="invalid" aria-invalid="true" />);
    const root = getCheckboxRoot();
    expect(root).toHaveAttribute("aria-invalid", "true");
  });

  it("renders an indicator with a CheckIcon svg of expected size class", () => {
    render(<Checkbox aria-label="icon check" />);
    const indicator = screen.getByTestId("checkbox-indicator");
    // The icon should be an SVG element with class "size-3.5"
    const svg = indicator.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.className?.toString()).toMatch(/size-3\.5/);
  });
});