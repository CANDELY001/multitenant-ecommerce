import { Category } from "@/payload-types";

export type CustomCategory = Category & {
  subcategories: Omit<Category, "subcategories">[];
  // Prevent nested subcategories for simplicity
  //subcategories: Category[];
};
