import type { FastifyInstance } from 'fastify'

// AUTH
import { autenticateWithGithub } from './auth/authenticate-with-github'
import { autenticateWithPassword } from './auth/authenticate-with-password'
import { createAccount } from './auth/create-account'
import { getProfile } from './auth/get-profile'
import { requestPasswordRecover } from './auth/request-password-recover'
import { resetPassword } from './auth/reset-password'
import { getAllProduto } from './product/get-all-products'
// PRODUCTS
import { getProdutoWithSlug } from './product/get-product-with-slug'

export async function registerRoutes(app: FastifyInstance) {
  // AUTH
  app.register(createAccount)
  app.register(autenticateWithGithub)
  app.register(autenticateWithPassword)
  app.register(getProfile)
  app.register(requestPasswordRecover)
  app.register(resetPassword)
  // AUTH

  // PRODUCTS
  app.register(getAllProduto)
  app.register(getProdutoWithSlug)
  // PRODUCTS
}
