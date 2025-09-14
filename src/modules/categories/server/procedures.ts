import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.payload.find({
      collection: "categories",
      depth: 1, //Populate subcategories, subcategories.[0] will be type of Category
      pagination: false,
      where: { parent: { exists: false } },
      sort: "name",
    });
    const formattedData = data.docs.map((category) => ({
      ...category,
      subcategories: (category.subcategories?.docs ?? []).map(
        (subcategory: Category) => ({
          // Because of Depth: 1 we are confident doc will be type of Category
          ...subcategory,
          //subcategories: undefined,  Ensure subcategories is always undefined
        })
      ),
    }));
    return formattedData;
  }),
});
