import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./context";

import { accessUserSchema, createUserSchema } from "../../schema/user.schema";
import {
  createProductGroupSchema,
  createProductSchema,
} from "../../schema/product.schema";
import { ZodError } from "zod";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    // return shape;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;

export const hideRouteWhenAuthenticated = t.procedure.use(
  async ({ ctx, next }) => {
    if (ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "user is logged in",
      });
    }
    return next();
  }
);

export const createUserProcedure =
  hideRouteWhenAuthenticated.input(createUserSchema);
export const accessUserProcedure =
  hideRouteWhenAuthenticated.input(accessUserSchema);

const protectedProdure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "user must logged in",
    });
  }
  return next();
});

export const productProducure = protectedProdure;
export const createProductGroupProcedure = protectedProdure.input(
  createProductGroupSchema
);
export const createProductProcedure =
  protectedProdure.input(createProductSchema);
