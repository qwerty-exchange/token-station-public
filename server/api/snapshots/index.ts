import { prisma } from "~/server/prisma";

export default defineEventHandler(async (event) => {

  const { date } = getQuery(event)
  if (date == null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad request: param date',
    });
  }

  const snapshots =  await prisma.snapshot.findMany({
    where: {
      date: {
        gte: new Date(Number(date) - 864000000),
        lt:  new Date(Number(date) + 864000000)
      }
    }
  });
  return {
    snapshots
  }
})
