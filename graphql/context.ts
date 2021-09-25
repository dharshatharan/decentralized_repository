import { PrismaClient } from '@prisma/client';
import { prisma } from '../lib/db';

export type Context = {
  prisma: PrismaClient;
};
export async function createContext({ }): Promise<Context> {
  return {
    prisma,
  };
}