import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import { generateAuthCookie } from "../utils";
import { registerSchema } from "../ui/schemas";
import { stripe } from "@/lib/strip";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.payload.auth({ headers });
    return session;
  }),
  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const account = await stripe.accounts.create({});

      if (!account) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create Stripe account",
        });
      }
      const tenant = await ctx.payload.create({
        collection: "tenants",
        data: {
          name: input.username,
          slug: input.username,
          stripeAccountId: account.id,
        },
      });
      // First create the user
      const user = await ctx.payload.create({
        collection: "users",
        data: {
          email: input.email,
          username: input.username,
          password: input.password, // This will be hashed automatically by Payload
          tenants: [{ tenant: tenant.id }],
        },
      });

      // Then login the user to get a token
      const loginData = await ctx.payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!loginData.token) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create session after registration",
        });
      }

      // Set the auth cookie
      await generateAuthCookie({
        prefix: ctx.payload.config.cookiePrefix,
        value: loginData.token,
      });

      return {
        success: true,
        user: loginData.user,
        message: "Account created successfully",
      };
    }),
  login: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });
      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }
      await generateAuthCookie({
        prefix: ctx.payload.config.cookiePrefix,
        value: data.token,
      });

      return {
        success: true,
        user: data.user,
        message: "Logged in successfully",
      };
    }),
});
