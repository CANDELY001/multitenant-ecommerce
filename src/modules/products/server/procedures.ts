import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sort, Where } from "payload";
import { z } from "zod";
import { Category, Media, Product, Tenant } from "@/payload-types";
import { sortValues } from "../search-params";
import { DEFAULT_LIMIT } from "@/constant";
import { headers as getHeaders } from "next/headers";

export const productRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const session = await ctx.payload.auth({ headers });
      const data = await ctx.payload.findByID({
        collection: "products",
        id: input.id,
        depth: 2, //Populate category and images, tenant & tenant.image
      });
      let isPurchased = false;

      if (session.user) {
        const ordersData = await ctx.payload.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                product: {
                  equals: input.id,
                },
              },
              {
                user: {
                  equals: session.user.id,
                },
              },
            ],
          },
        });

        isPurchased = !!ordersData.docs[0];
      }
      return {
        ...data,
        isPurchased,
        image: data.images as Media | null,
        tenant: data.tenant as Tenant & { image: Media | null },
      };
    }),
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
        tenantSlug: z.string().nullable().optional(),
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

      // Filter by tenant if tenantSlug is provided
      if (input.tenantSlug) {
        // First, find the tenant by slug
        const tenantData = await ctx.payload.find({
          collection: "tenants",
          where: {
            slug: {
              equals: input.tenantSlug,
            },
          },
          limit: 1,
        });

        const tenant = tenantData.docs[0];
        if (tenant) {
          where["tenant"] = {
            equals: tenant.id,
          };
        } else {
          // If tenant doesn't exist, return empty results
          return {
            docs: [],
            totalDocs: 0,
            limit: input.limit,
            totalPages: 0,
            page: input.cursor,
            pagingCounter: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: null,
            nextPage: null,
          };
        }
      }

      const data = await ctx.payload.find({
        collection: "products",
        depth: 2, //Populate category and images, tenant & tenant.image
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
          tenant: product.tenant as Tenant,
        })) as (Product & { image: Media | null })[],
      };
    }),
});
