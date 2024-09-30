import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { count, eq } from "drizzle-orm";
import { userIdSchema, userCreateSchema } from "@/app/users/create/zod";
import { type PostgresError } from "postgres";

const paginationSchema = z.object({
  pageSize: z.number().min(1).max(100).default(10),
  pageIndex: z.number().min(0).default(0),
});

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(userCreateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.insert(users).values({
          name: input.name,
          email: input.email,
        });
      } catch (error) {
        if ((error as PostgresError)?.code === "23505") {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "User already exists",
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred, please try again later.",
            cause: error,
          });
        }
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: userIdSchema }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.delete(users).where(eq(users.id, input.id));
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: error,
        });
      }
    }),

  one: publicProcedure
    .input(z.object({ id: userIdSchema }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
      });

      return user ?? null;
    }),

  all: publicProcedure.input(paginationSchema).query(async ({ ctx, input }) => {
    const rows = await ctx.db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.createdAt)],
      limit: input.pageSize,
      offset: input.pageSize * input.pageIndex,
    });

    const total = await ctx.db.select({ count: count() }).from(users);

    return {
      rows: rows ?? null,
      total: total?.pop()?.count ?? 0,
    };
  }),
});
