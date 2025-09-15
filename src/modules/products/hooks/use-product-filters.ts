import {
  useQueryStates,
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";

const sortValues = ["curated", "trending", "hot_and_new"] as const;

export const params = {
  search: parseAsString
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
  sort: parseAsStringLiteral(sortValues).withDefault("curated"),
  minPrice: parseAsString.withDefault(""),
  maxPrice: parseAsString.withDefault(""),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
};

export const useProductFilters = () => {
  return useQueryStates(params);
};
