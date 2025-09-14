import { Media, Tenant } from "@/payload-types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { DEFAULT_LIMIT } from "@/constant";

export const libraryRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.payload.find({
        collection: "orders",
        depth: 0,
        page: input.cursor,
        limit: input.limit,
        where: {
          user: {
            equals: ctx.session.user.id,
          },
        },
      });
      const productIds = ordersData.docs.map((order) => order.product);

      const productsData = await ctx.payload.find({
        collection: "products",
        pagination: false,
        depth: 2, // Add depth to populate relationships
        where: {
          id: {
            in: productIds,
          },
        },
      });

      return {
        ...productsData,
        docs: productsData.docs.map((doc) => ({
          ...doc, // Spread all product properties
          image: doc.images as Media | null, // Map images to image
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
