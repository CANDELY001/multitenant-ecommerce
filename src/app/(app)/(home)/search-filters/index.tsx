import { Category } from "@/payload-types";
import { SearchInput } from "./Search-input";
import { Categories } from "./categories";

interface SearchFiltersProps {
  data: any;
}

export const SearchFilters = ({ data }: SearchFiltersProps) => {
  return (
    <div className="p-4 lg:p-12 border-b flex flex-col gap-4 w-full">
      <SearchInput />
      <Categories data={data} />
    </div>
  );
};
