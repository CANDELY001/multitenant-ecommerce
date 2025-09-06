import { Category } from "@/payload-types";
import { SearchInput } from "./Search-input";
import { Categories } from "./categories";
import { CustomCategory } from "../types";

interface SearchFiltersProps {
  data: CustomCategory[];
}

export const SearchFilters = ({ data }: SearchFiltersProps) => {
  return (
    <div className="p-4 lg:p-12 border-b flex flex-col gap-4 w-full">
      <SearchInput data={data} />
      <div className="hidden lg:block md:block">
        <Categories data={data} />
      </div>
    </div>
  );
};
