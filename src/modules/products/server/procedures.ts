import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Where } from "payload";
import { z } from "zod";
import { Category } from "@/payload-types";
import { sub } from "date-fns";

export const productRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};

      if (input.minPrice) {
        where.price = { ...where.price, greater_than_equal: input.minPrice };
      }
      if (input.maxPrice) {
        where.price = {
          ...where.price,
          less_than_equal: input.maxPrice,
        };
      }
      if (input.category) {
        const categoriesData = await ctx.payload.find({
          collection: "categories",
          limit: 1,
          depth: 1, //Populate subcategories, subcategories.[0] will be type of Category
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });
        const formattedData = categoriesData.docs.map((category) => ({
          ...category,
          subcategories: (category.subcategories?.docs ?? []).map(
            (subcategory: Category) => ({
              ...(subcategory as Category),
              subcategories: undefined, // strip nested
            })
          ),
        }));

        const parentCategory = formattedData[0] as
          | (Category & { subcategories: Category[] })
          | undefined;

        if (parentCategory) {
          // Get subcategory slugs from the already formatted data
          const subcategoriesSlugs = parentCategory.subcategories.map(
            (subcategory) => subcategory.slug
          );

          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategoriesSlugs],
          };
        }
      }
      const data = await ctx.payload.find({
        collection: "products",
        depth: 1, //Populate category and images
        sort: "name",
        where: where,
      });
      return data;
    }),
});
