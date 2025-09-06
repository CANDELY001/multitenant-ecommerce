import type { ReactNode } from "react";
import { Category } from "@/payload-types";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SearchFilters } from "./search-filters";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { CustomCategory } from "./types";

interface layoutProps {
  children: ReactNode;
}
const layout = async ({ children }: layoutProps) => {
  const payload = await getPayload({ config: configPromise });
  const data = await payload.find({
    collection: "categories",
    depth: 1, //Populate subcategories, subcategories.[0] will be type of Category
    pagination: false,
    where: { parent: { exists: false } },
    sort: "name",
  });
  const formattedData: CustomCategory[] = data.docs.map(
    (category) =>
      ({
        ...category,
        subcategories: (category.subcategories?.docs ?? []).map(
          (subcategory: any) => ({
            // Because of Depth: 1 we are confident doc will be type or Category
            ...(subcategory as Category),
            subcategories: [] as Category[], // Ensure subcategories is always an array
          })
        ),
      }) as CustomCategory
  );
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#F4F4F4]">{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
