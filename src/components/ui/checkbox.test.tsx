/**
 * Checkbox component unit tests
 *
 * Testing Stack Note:
 * - No explicit test framework detected in package.json. Assuming Vitest + @testing-library/react + @testing-library/user-event + @testing-library/jest-dom.
 * - If your project uses Jest instead, replace imports from "vitest" with "@jest/globals" and keep the rest as-is.
 *
 * Diff Focus:
 * - No <diff> provided in this context. These tests target core behaviors (happy paths, edge cases, and failure conditions)
 *   for the Checkbox component, typical of Radix/Shadcn patterns.
 */

import "@testing-library/jest-dom/vitest";
import React, { type ComponentProps } from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";

// Adjust import path if your project uses aliases like "@/components/ui/checkbox"
import { Checkbox } from "./checkbox";

afterEach(() => {
  cleanup();
});

const setup = async (props: Partial<ComponentProps<typeof Checkbox>> = {}) => {
  const user = userEvent.setup();
  render(<Checkbox aria-label="Label" {...props} />);
  const checkbox = screen.getByRole("checkbox", { name: /label/i });
  return { user, checkbox };
};

describe("Checkbox - rendering and defaults", () => {
  it("renders with role=checkbox and is unchecked by default", async () => {
    const { checkbox } = await setup();
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("role", "checkbox");
    // Radix sets aria-checked and data-state
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
  });

  it("accepts id and forwards it to the root element", async () => {
    const { checkbox } = await setup({ id: "agree" });
    expect(checkbox).toHaveAttribute("id", "agree");
  });

  it("forwards arbitrary aria-* attributes and className", async () => {
    const { checkbox } = await setup({
      "aria-describedby": "hint",
      className: "custom-class",
    });
    expect(checkbox).toHaveAttribute("aria-describedby", "hint");
    expect(checkbox).toHaveClass("custom-class");
  });
});

describe("Checkbox - uncontrolled behavior", () => {
  it("toggles state on click", async () => {
    const { user, checkbox } = await setup();
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "checked");
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("toggles with Space key when focused (keyboard a11y)", async () => {
    const { user, checkbox } = await setup();
    checkbox.focus();
    expect(checkbox).toHaveFocus();
    await user.keyboard("[Space]");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    await user.keyboard("[Space]");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });
});

describe("Checkbox - controlled behavior", () => {
  it("calls onCheckedChange with the next state (boolean) and updates when parent changes value", async () => {
    const onCheckedChange = vi.fn();

    const Controlled = () => {
      const [checked, setChecked] = React.useState(false);
      return (
        <Checkbox
          aria-label="Ctl"
          checked={checked}
          onCheckedChange={(val: boolean | "indeterminate") => {
            onCheckedChange(val);
            setChecked(Boolean(val));
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<Controlled />);
    const cb = screen.getByRole("checkbox", { name: /ctl/i });

    expect(cb).toHaveAttribute("aria-checked", "false");
    await user.click(cb);
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(cb).toHaveAttribute("aria-checked", "true");

    await user.click(cb);
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(cb).toHaveAttribute("aria-checked", "false");
  });

  it("does not change when disabled and does not fire onCheckedChange", async () => {
    const onCheckedChange = vi.fn();

    const ControlledDisabled = () => (
      <Checkbox aria-label="Disabled" checked={true} disabled onCheckedChange={onCheckedChange} />
    );

    const user = userEvent.setup();
    render(<ControlledDisabled />);
    const cb = screen.getByRole("checkbox", { name: /disabled/i });

    expect(cb).toBeDisabled();
    expect(cb).toHaveAttribute("aria-checked", "true");
    await user.click(cb);
    expect(cb).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

describe("Checkbox - special states", () => {
  it('supports the "indeterminate" state', async () => {
    const { checkbox } = await setup({ checked: "indeterminate" });
    // Radix uses aria-checked="mixed" for indeterminate
    expect(
      checkbox.getAttribute("aria-checked") === "mixed" ||
        checkbox.getAttribute("data-state") === "indeterminate"
    ).toBeTruthy();
  });
});

describe("Checkbox - refs and focus management", () => {
  it("forwards ref to the underlying focusable element", async () => {
    const ref = React.createRef<HTMLElement>();
    render(<Checkbox aria-label="Ref" ref={ref} />);
    expect(ref.current).toBeTruthy();
    expect(ref.current?.getAttribute("role")).toBe("checkbox");
    ref.current?.focus?.();
    expect(ref.current).toHaveFocus();
  });
});

describe("Checkbox - robustness", () => {
  it("handles undefined checked prop gracefully (uncontrolled fallback)", async () => {
    const { checkbox } = await setup({ checked: undefined });
    // Should still be a valid checkbox element
    expect(checkbox).toHaveAttribute("role", "checkbox");
  });
});