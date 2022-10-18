import * as trpc from "@trpc/server"
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { pbkdf2Sync, randomBytes } from "crypto";
import { router, createUserProcedure, accessUserProcedure, publicProcedure } from "../trpc";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { signJwt } from "../../../utils/jwt";
import { serialize } from "cookie";
import { TokenExpiredError } from "jsonwebtoken";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  username: true,
  email: true,
  createdAt: true,
  updatedAt: true
});

const hashPassword = (password: string, salt: string|null) => {
  if(!salt) salt = randomBytes(32).toString("hex");
  const hash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex"); 
  return { salt, hash };
};

export const usersRouter = router({
  create: createUserProcedure.mutation(async ({ ctx, input }) => {
    const emailExists = await ctx.prisma.user.findUnique({ where: {
      email: input.email.trim()
    }})

    if(emailExists) {
      throw new trpc.TRPCError({
        code: "CONFLICT",
        message: "Email is already been use"
      })
    }
    
    const usernameExists = await ctx.prisma.user.findUnique({ where: {
      username: input.username.trim()
    }})
  
    if(usernameExists) {
      throw new trpc.TRPCError({
        code: "CONFLICT",
        message: "Username already exists"
      })
    }
  
    try {
      const {salt, hash} = hashPassword(input.password, null)
      const user = await ctx.prisma.user.create({
        select: defaultUserSelect,
        data: {
          hash: hash,
          salt: salt,
          email: input.email,
          username: input.username,
          name: input.name
        }
      })
      return user
    } catch (e) {
      if(e instanceof PrismaClientKnownRequestError) {
        if(e.code === "P2002") {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "User already exists",
          });
        }
      }
      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error"
      });
    }
  }),
  access: accessUserProcedure.mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({ 
      where: {
        email: input.email
      }
    })

    if(!user) {
      throw new trpc.TRPCError({
        code: "FORBIDDEN",
        message: "Invalid email or password"
      })
    }

    const { hash } = hashPassword(input.password, user.salt)

    if(hash !== user.hash) {
      throw new trpc.TRPCError({
        code: "FORBIDDEN",
        message: "Invalid email or password"
      })
    }
    
    const jwt = signJwt({ 
      email: user.email, 
      username: user.username, 
      id: user.id 
    })
  
    ctx.res.setHeader("Set-Cookie", serialize("token", jwt, { path: "/" }))

    return {
      redirect: input.redirect||"/"
    }
  }),
  me: publicProcedure.query(({ ctx }) => ctx.user)
});
