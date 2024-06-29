import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

import { createSlug } from '@/utils/create-slug'

export const prisma = new PrismaClient()

async function seed() {
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.store.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('biel2000', 1)

  const user = await prisma.user.create({
    data: {
      name: 'Gabriel Borges Oliveira',
      email: 'gabriel@teste.com',
      avatarUrl: 'https://github.com/GabrielBorges2000.png',
      passwordHash,
    },
  })

  const store = await prisma.store.create({
    data: {
      title: faker.company.buzzAdjective(),
      slug: createSlug(faker.company.buzzPhrase()),
      userId: user.id,
      contact: '11986237504',
      email: faker.internet.email(),
      imageUrl: faker.image.avatarGitHub(),
    },
  })

  const category = await prisma.category.create({
    data: {
      title: faker.commerce.department(),
    },
  })

  for (let i = 0; i < 30; i++) {
    const productName = faker.commerce.productName()

    await prisma.product.create({
      data: {
        title: productName,
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price()),
        promotion: false,
        imageUrl: faker.image.urlPlaceholder(),
        storeId: store.id,
        categoriesId: category.id,
        slug: createSlug(productName),
      },
    })
  }

  console.log(user)
}
seed().then(() => {
  console.log('Database seeded!')
})
