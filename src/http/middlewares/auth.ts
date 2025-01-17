import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { UnauthorizedError } from '../routes/_error/unnathurazed-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch (error) {
        throw new UnauthorizedError('Invalid auth token!')
      }
    }

    request.getStoreId = async () => {
      try {
      } catch (error) {
        throw new UnauthorizedError('Invalid auth token!')
      }
    }
  })
})
