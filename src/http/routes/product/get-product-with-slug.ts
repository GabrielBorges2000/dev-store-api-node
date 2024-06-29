import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_error/bad-request-error'

export async function getProdutoWithSlug(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/get-product/:slug',
    {
      schema: {
        tags: ['product'],
        summary: 'Get produto by slug',
        params: z.object({
          slug: z.string(),
        }),
        response: {
          400: z.object({
            message: z.string(),
          }),
          200: z.object({
            product: z.object({
              title: z.string(),
              price: z.coerce.number(),
              imageUrl: z.array(z.string()),
              description: z.string().nullable(),
              promotion: z.boolean(),
              category: z.object({
                title: z.string(),
                id: z.string(),
              }),
              tags: z.array(
                z.object({
                  title: z.string(),
                  id: z.string(),
                }),
              ),
              sizes: z.array(
                z.object({
                  size: z.string(),
                  id: z.string(),
                }),
              ),
              store: z.object({
                title: z.string(),
                id: z.string(),
                slug: z.string(),
              }),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const product = await prisma.product.findUnique({
        select: {
          title: true,
          price: true,
          imageUrl: true,
          description: true,
          promotion: true,
          category: {
            select: {
              title: true,
              id: true,
            },
          },
          tags: {
            select: {
              title: true,
              id: true,
            },
          },
          sizes: {
            select: {
              size: true,
              id: true,
            },
          },
          store: {
            select: {
              title: true,
              id: true,
              slug: true,
            },
          },
        },
        where: {
          slug: request.params.slug,
        },
      })

      console.log({ product })

      if (!product) {
        throw new BadRequestError('product not found!')
      }

      return reply.status(200).send({ product })
    },
  )
}
