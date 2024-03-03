import { prisma } from "~/server/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const token = getHeader(event, "X-Token")

  if (token != process.env.API_TOKEN!) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }


  if (body == null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad request: param date',
    });
  }
  await prisma.snapshot.create({
    data: body
  });

  return {
    msg: "OK"
  }
})
