import { TRPCError } from "@trpc/server";
import { router, productProducure, createProductGroupProcedure, createProductProcedure } from "../trpc";

export const productsRouter = router({
  getAllProductGroups: productProducure.query(async ({ ctx }) => {
    const productGroups = await ctx.prisma.productGroup.findMany({
      where: {
        userId: ctx.user?.id
      },
      include: { 
        products: true
      }
    });

    return productGroups;
  }),
  createProductGroup: createProductGroupProcedure.mutation(async ({ ctx, input }) => {
    const userId = ctx.user?.id;

    // check if theres a duplicate product group
    const isProductGroupExists = await ctx.prisma.productGroup.count({ 
      where: {
        userId: userId,
        name: input.name
      }
    });

    if(isProductGroupExists>0) {
      throw new TRPCError({ code: "CONFLICT", message: "product group is already exists" })
    }

    const productGroup = await ctx.prisma.productGroup.create({
      data: {
        name: input.name,
        description: input.description,
        published: input.published,
        userId: userId
      }
    });

    return productGroup;
  }),
  createProduct: createProductProcedure.mutation(async ({ ctx, input }) => {
    const groupId = input.groupId;
    const userId = ctx.user?.id;

    const productGroup = await ctx.prisma.productGroup.findFirst({ 
      where: { 
        id: groupId,
        userId: userId
      }
    });

    if(!productGroup) {
      throw new TRPCError({ code: "NOT_FOUND", message: "product group is missing" });
    }

    // check if theres a same product name in the same product group
    const isProductNameExists = await ctx.prisma.product.count({ 
      where: { name: input.name, groupId: groupId }
     })

    if(isProductNameExists>0) {
      throw new TRPCError({ code: "CONFLICT", message: "product name is already exists" });
    }

    const product = ctx.prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        stock: input.stock,
        price: input.price,
        groupId: groupId
      },
      include: {
        group: true
      }
    })
    
    return { success: true , product }
  })
});
