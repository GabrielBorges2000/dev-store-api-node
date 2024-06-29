import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'

export async function registerProduct(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/register-product',
      {
        schema: {
          tags: ['product'],
          summary: 'Register a new products to the store',
          security: [{ bearerAuth: [] }],
          body: z.object({}),
          response: {
            400: z.object({
              message: z.string(),
            }),
            200: z.object({
              user: z.object({
                id: z.string().uuid(),
                name: z.string().nullable(),
                email: z.string().email(),
                avatarUrl: z.string().url().nullable(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        return reply.status(201).send({ message: 'ok' })
      },
    )
}
