import { objectType, extendType, intArg, stringArg } from 'nexus';

export const Image = objectType({
  name: 'Image',
  definition(t) {
    t.int('id');
    t.string('createdAt');
    t.string('updatedAt');
    t.string('title');
    t.string('description');
    t.string('url');
  },
});

export const Edge = objectType({
  name: "Edges",
  definition(t) {
    t.string("cursor");
    t.field("node", {
      type: Image,
    });
  },
});

export const PageInfo = objectType({
  name: "PageInfo",
  definition(t) {
    t.string("endCursor");
    t.boolean("hasNextPage");
  },
});

export const Response = objectType({
  name: "Response",
  definition(t) {
    t.field("pageInfo", { type: PageInfo });
    t.list.field("edges", {
      type: Edge,
    });
  },
});

export const ImagesQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("images", {
      type: Response,
      args: {
        first: intArg(),
        after: intArg(),
      },
      async resolve(_, args, ctx) {
        let queryResults = null;

        if (!args.first) {
          args.first = 10;
        }

        if (args.after) {
          queryResults = await ctx.prisma.image.findMany({
            take: args.first,
            skip: 1,
            cursor: {
              id: args.after,
            },
          });
        } else {
          queryResults = await ctx.prisma.image.findMany({
            take: args.first,
          });
        }

        if (queryResults.length > 0) {
          // last element
          const lastImageInResults = queryResults[queryResults.length - 1];
          // cursor we'll return
          const myCursor = lastImageInResults.id;

          // queries after the cursor to check if we have nextPage
          const secondQueryResults = await ctx.prisma.image.findMany({
            take: args.first,
            cursor: {
              id: myCursor,
            },
          });

          const result = {
            pageInfo: {
              endCursor: myCursor.toString(),
              hasNextPage: secondQueryResults.length >= args.first,
            },
            edges: queryResults.map((image: any) => ({
              cursor: image.id,
              node: image,
            })),
          };

          return result;
        }
        return {
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
          edges: [],
        };
      },
    });
  },
});