import { Kind } from 'graphql';
import { objectType, intArg, nonNull, mutationField, queryField, arg, inputObjectType, scalarType } from 'nexus';

const DateScalar = scalarType({
  name: 'Date',
  asNexusMethod: 'date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value)
  },
  serialize(value) {
    return value.getTime()
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value)
    }
    return null
  },
})

export const DateTime = DateScalar

export const Image = objectType({
  name: 'Image',
  definition(t) {
    t.int('id');
    t.field('createdAt', { type: DateTime });
    t.field('updatedAt', { type: DateTime });
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

export const ImagesQuery = queryField("images", {
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

export const AddImageInput = inputObjectType({
  name: 'AddImageInput',
  definition(t) {
    t.nonNull.string('title')
    t.string('description')
    t.nonNull.string('url')
  },
})

export const ImageMutation = mutationField('addImage', {
  type: 'Image',
  args: {
    data: nonNull(
      arg({
        type: 'AddImageInput',
      }),
    ),
  },
  async resolve(_, args, ctx) {
    return await ctx.prisma.image.create({
      data: {
        title: args.data.title,
        description: args.data.description ?? '',
        url: args.data.url,
      },
    });
  },
})
