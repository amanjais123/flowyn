import { workflowRouter } from '@/features/workflows/server/routers';
import {  createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';

export const appRouter = createTRPCRouter({
workflows : workflowRouter ,

});
// export type definition of API
export type AppRouter = typeof appRouter;
