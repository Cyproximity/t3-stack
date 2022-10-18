import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const productsRouter = router({
  hello: publicProcedure.query(()=> "rest")
});
