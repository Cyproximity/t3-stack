// src/server/router/_app.ts
import { router } from "../trpc";

import { productsRouter } from "./products.route";
import { usersRouter } from "./users.route"

export const appRouter = router({
  products: productsRouter,
  users: usersRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
