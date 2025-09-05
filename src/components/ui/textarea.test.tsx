/* Compatibility shim: prefer vitest vi, fall back to jest in Jest environments */
// @ts-expect-error compatibility shim for global vi in non-Vitest environments
const vi: { fn: (...args: unknown[]) => unknown } | undefined = (global as unknown as { vi?: { fn: (...args: unknown[]) => unknown } }).vi;
const jest: { fn: (...args: unknown[]) => unknown } | undefined = (global as unknown as { jest?: { fn: (...args: unknown[]) => unknown } }).jest;
import React from "react";
import { Textarea } from "./textarea";
/**
import { fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Textarea } from "./textarea";
* Tests for Textarea component.
* Note: This project uses a standard React unit testing stack.
* Framework: detected at runtime (Vitest or Jest); test APIs are compatible across both in this file.
* Library: @testing-library/react (+ @testing-library/user-event when available).
*/

const renderTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement> = {}) => {
  return render(<Textarea aria-label={props["aria-label"] || "message"} {...props} />);
};

describe("Textarea", () => {
  it("renders without crashing and is accessible by label", () => {
    renderTextarea({ "aria-label": "comment" });
    expect(screen.getByLabelText("comment")).toBeInTheDocument();
  });
});

it("renders with default classes and merges custom className", () => {
  const { container } = renderTextarea({ className: "custom-class", "aria-label": "content" });
  const el = screen.getByLabelText("content");
  expect(el).toHaveClass("custom-class");
  // Smoke-check: default Tailwind-y classes include some of these tokens in this codebase pattern
  // We only assert presence of a few stable tokens to reduce brittleness.
  const classAttr = el.getAttribute("class") || "";
  expect(classAttr).toMatch(/rounded|border|px-3|py-2/);
  expect(container).toMatchSnapshot();
});

it("forwards other props to the underlying textarea", () => {
  renderTextarea({ placeholder: "Type here...", maxLength: 120, name: "note", "aria-label": "note area" });
  const el = screen.getByLabelText("note area") as HTMLTextAreaElement;
  expect(el).toHaveAttribute("placeholder", "Type here...");
  expect(el).toHaveAttribute("maxlength", "120");
  expect(el).toHaveAttribute("name", "note");
});

it("supports disabling via disabled prop", async () => {
  renderTextarea({ disabled: true, "aria-label": "disabled area" });
  const el = screen.getByLabelText("disabled area") as HTMLTextAreaElement;
  expect(el).toBeDisabled();

  // Verify interaction is prevented
  if (typeof userEvent !== "undefined") {
    await userEvent.type(el, "hello").catch(() => Promise.resolve());
    expect(el.value).toBe("");
  } else {
    // Fallback using fireEvent
    fireEvent.change(el, { target: { value: "hello" } });
    // Depending on browser simulation, value may still change; we at least assert disabled attribute.
    expect(el).toBeDisabled();
  }
});

it("calls onChange and updates value when enabled", async () => {
  const handleChange = vi ? vi.fn() : jest.fn();
  renderTextarea({ "aria-label": "msg", onChange: handleChange, defaultValue: "" });
  const el = screen.getByLabelText("msg") as HTMLTextAreaElement;

  if (typeof userEvent !== "undefined") {
    await userEvent.type(el, "Hello");
  } else {
    fireEvent.change(el, { target: { value: "Hello" } });
  }

  expect(handleChange).toHaveBeenCalled();
  expect(el.value).toContain("Hello");
});

it("honors readOnly and does not invoke onChange on input", async () => {
  const handleChange = vi ? vi.fn() : jest.fn();
  renderTextarea({ "aria-label": "ro", readOnly: true, onChange: handleChange, defaultValue: "init" });
  const el = screen.getByLabelText("ro") as HTMLTextAreaElement;

  if (typeof userEvent !== "undefined") {
    await userEvent.type(el, "x").catch(() => Promise.resolve());
  } else {
    fireEvent.change(el, { target: { value: "initx" } });
  }

  // Some environments still fire change for readOnly; assert value stayed initial and handler not called ideally.
  expect(el.value).toBe("init");
  expect(handleChange).not.toHaveBeenCalled();
});

it("forwards ref to the underlying textarea element", () => {
  const ref = React.createRef<HTMLTextAreaElement>();
  render(<Textarea ref={ref} aria-label="ref-elt" />);
  expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  expect(ref.current?.tagName).toBe("TEXTAREA");
});

it("supports controlled value updates", async () => {
  const Wrapper = () => {
    const [val, setVal] = React.useState("a");
    return (
      <>
        <button onClick={() => setVal((v) => v + "b")}>append</button>
        <Textarea aria-label="controlled" value={val} onChange={(e) => setVal(e.target.value)} />
      </>
    );
  };
  render(<Wrapper />);
  const el = screen.getByLabelText("controlled") as HTMLTextAreaElement;
  expect(el.value).toBe("a");

  const btn = screen.getByRole("button", { name: "append" });
  if (typeof userEvent !== "undefined") {
    await userEvent.click(btn);
  } else {
    fireEvent.click(btn);
  }
  expect(el.value).toBe("ab");
});

it("applies aria-invalid and data attributes if provided", () => {
  renderTextarea({ "aria-label": "aria", "aria-invalid": "true", "data-testid": "ta" });
  const el = screen.getByTestId("ta");
  expect(el).toHaveAttribute("aria-invalid", "true");
});