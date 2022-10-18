// src/server/router/context.ts
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import * as trpcNext from "@trpc/server/adapters/next"
import { prisma } from "../db/client";
import { QueryClient } from "@tanstack/react-query";
import { Cookie } from "next-cookie";
import { verifyJwt } from "../../utils/jwt";
/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = trpcNext.CreateNextContextOptions

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 */

interface CtxUser {
  id: string
  username: string
  email: string
  iat: string
  exp: number
}

const getUserFromRequest = ({req}: trpcNext.CreateNextContextOptions) => {
  const token = req.cookies.token;
  if(token) {
    try {
      const verified = verifyJwt<CtxUser>(token);
      return verified;
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const createContextInner = async (opts: CreateContextOptions) => {
  const user = getUserFromRequest(opts)
  const {req, res} = opts
  return {
    req, 
    res,
    prisma,
    user
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  return await createContextInner({ req, res });
};

export type Context = inferAsyncReturnType<typeof createContext>;
