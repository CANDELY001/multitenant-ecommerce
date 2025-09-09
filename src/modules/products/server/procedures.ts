import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sort, Where } from "payload";
import { z } from "zod";
import { Category, Media, Product } from "@/payload-types";
import { sub } from "date-fns";
import { sortValues } from "../search-params";
import { DEFAULT_LIMIT } from "@/constant";

export const productRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};

      let sort: Sort = "-createdAt";
      if (input.sort === "curated") {
        sort = "-createdAt"; // Example: Curated products sorted by creation date
      }
      if (input.sort === "trending") {
        sort = "name"; // Example: Curated products sorted by creation date
      }
      if (input.sort === "hot_and_new") {
        sort = "+createdAt"; // Example: Curated products sorted by creation date
      }
      if (input.minPrice && input.maxPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxPrice) {
        where.price = {
          // ...where.price,
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
      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }

      const data = await ctx.payload.find({
        collection: "products",
        depth: 1, //Populate category and images
        sort,
        where: where,
        limit: input.limit,
        page: input.cursor,
      });

      return {
        ...data,
        docs: data.docs.map((product) => ({
          ...product,
          image: product.images as Media | null,
        })) as (Product & { image: Media | null })[],
      };
    }),
});
