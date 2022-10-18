import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./context";
import { accessUserSchema, createUserSchema } from "../../schema/user.schema";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;

export const createUserProcedure = t.procedure.input(createUserSchema)
export const accessUserProcedure = t.procedure.input(accessUserSchema)
