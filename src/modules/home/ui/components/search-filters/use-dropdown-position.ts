import { RefObject } from "react";

export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };
    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; // Assume a fixed width for the dropdown (w-60 = 15rem = 240px )

    //Calculate the initial position
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    //check if the dropdown go off the right edge of the viewport
    if (left + dropdownWidth > window.innerWidth) {
      //Align to right edge of butto instead
      left = rect.right - window.scrollX - dropdownWidth;

      //if still off the screen, align to the right edge of viewport with some padding
      if (left < 0) left = window.innerWidth - dropdownWidth - 16; //10px padding
    }

    if (left < 0) left = 16; //10px padding
    return { top, left };
  };
  return getDropdownPosition;
};
