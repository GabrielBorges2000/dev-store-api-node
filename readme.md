# E-commerce Code Borges Store Api

## Visão Geral

Este projeto define o esquema de um sistema de e-commerce usando Prisma com PostgreSQL. Abaixo estão descritos os casos de uso e as funcionalidades organizadas em diferentes partes: relacionadas a conta, ações que um usuário pode realizar, ações que uma loja pode realizar, e todas as funcionalidades apresentadas em formato de tabela.

## Estrutura do Projeto

- **Prisma Client:** Ferramenta para interagir com a base de dados.
- **PostgreSQL:** Banco de dados utilizado.
- **Node.js:** Ambiente de execução para o servidor da API.
- **Fastify:** Framework web utilizado para construir a API.
- **Swagger:** Ferramenta para documentação da API.
- **Zod:** Biblioteca para validação de esquemas.
- **TypeScript:** Linguagem utilizada no desenvolvimento.
- **JSON Web Token (JWT):** Método para autenticação e autorização.
- **Day.js:** Biblioteca para manipulação de datas.
- **bcrypt:** Biblioteca para hash de senhas.

## Esquema

### Enumerações

- **Roles:** Define os diferentes papéis de usuários (`USER`, `ADMIN`, `CLIENT`).
- **TokenType:** Define os tipos de tokens (`PASSWORD_RECOVER`).
- **AccountProvider:** Define os provedores de contas externas (`GITHUB`).
- **OrderState:** Define os estados de um pedido (`AWAITING_PAYMENT`, `PAYMENT_ACCEPT`, `PAYMENT_REJECTED`, `IN_PREPARATION`, `ON_CARRIAGE`, `CONCLUDED`, `CANCELED`).
- **PaymentMethod:** Define os métodos de pagamento (`CARD_DEBIT`, `CARD_CREDIT`, `TICKET`, `PIX`).

### Modelos

- **User:** Usuário do sistema.
- **Token:** Tokens para recuperação de senha.
- **Account:** Contas de usuários associadas a provedores externos.
- **Store:** Lojas associadas aos usuários.
- **Product:** Produtos vendidos nas lojas.
- **Size:** Tamanhos dos produtos.
- **Tag:** Tags associadas aos produtos.
- **Categorie:** Categorias dos produtos.
- **Order:** Pedidos realizados pelos usuários.
- **ProductOrder:** Associação entre produtos e pedidos.

## Funcionalidades

### Relacionadas à Conta

- Registro de usuário
- Login de usuário
- Recuperação de senha de usuário
- Associação de contas de usuários com provedores externos (e.g., GitHub)

### Ações que um Usuário Pode Realizar

- Criar e excluir pedidos
- Escolher métodos de pagamento para pedidos

### Ações que uma Loja Pode Realizar

- Criar, editar e excluir produtos
- Upload de imagens para produtos
- Associar produtos a categorias, tamanhos e tags
- Gerenciar o contato e informações da loja
- Visualizar os dados do cliente

## Funcionalidades em Tabela

| Tipo                | Ação                                                     |
|---------------------|----------------------------------------------------------|
| 🔐 Conta            | Registro de usuário                                      |
| 🔐 Conta            | Login de usuário                                         |
| 🔐 Conta            | Recuperação de senha de usuário                          |
| 🔐 Conta            | Associação de contas de usuários com provedores externos |
| 🤵‍♂️ Usuário          | Criar pedidos                                            |
| 🤵‍♂️ Usuário          | Cancelar pedidos                                         |
| 🤵‍♂️ Usuário          | Escolher métodos de pagamento para pedidos               |
| 🤵‍♂️ Usuário          | Visualizar o estado dos pedidos                          |
| 🤵‍♂️ Usuário          | Gerenciar endereços de entrega                           |
| 🏪 Loja             | Atualizar o estado dos pedidos                           |
| 🏪 Loja             | Criar produtos                                           |
| 🏪 Loja             | Editar produtos                                          |
| 🏪 Loja             | Excluir produtos                                         |
| 🏪 Loja             | Upload de imagens para produtos                          |
| 🏪 Loja             | Associar produtos a categorias                           |
| 🏪 Loja             | Associar produtos a tamanhos                             |
| 🏪 Loja             | Associar produtos a tags                                 |
| 🏪 Loja             | Gerenciar o contato e informações da loja                |

## Estrutura de Modelos

### User
```prisma
model User {
  id           String   @id @default(uuid())
  name         String?
  email        String   @unique
  passwordHash String?  @map("password_hash")
  avatarUrl    String?  @map("avatar_url")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  tokens   Token[]
  accounts Account[]
  store    Store?
  Order    Order[]
  address  Address[]

  @@map("users")
}
```

### Token
```prisma
model Token {
  id        String    @id @default(uuid())
  type      TokenType
  createdAt DateTime  @default(now()) @map("created_at")

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String @map("user_id")

  @@map("tokens")
}
```

### Account
```prisma
model Account {
  id                String          @id @default(uuid())
  provider          AccountProvider
  providerAccountId String          @unique @map("provider_account_id")

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String @map("user_id")

  @@unique([provider, userId])
  @@map("accounts")
}
```

### Store
```prisma
model Store {
  id        String   @id @unique @default(uuid()) @map("store_id")
  title     String
  slug      String   @unique
  contact   String?
  imageUrl  String?  @map("image_url")
  email     String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user   User   @relation(fields: [userId], references: [id])
  userId String @map("user_id")

  products Product[]
  orders   Order[]

  @@unique([userId])
  @@index([slug])
}
```

### Product
```prisma
model Product {
  id             String   @id @unique @default(uuid()) @map("id")
  title          String
  slug           String   @unique
  price          Float
  imageUrl       String[] @map("image_url")
  description    String?
  promotion      Boolean  @default(false)
  pricePromotion Float?   @map("price_promotion")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  store   Store  @relation(fields: [storeId], references: [id])
  storeId String @map("store_id")

  category     Categorie @relation(fields: [categoriesId], references: [id])
  categoriesId String    @map("category_id")

  sizes         Size[]
  tags          Tag[]
  productOrders ProductOrder[]

  @@unique([storeId, categoriesId, slug])
  @@index([slug])
}
```

### Size
```prisma
model Size {
  id   String @id @default(uuid())
  size String

  product   Product? @relation(fields: [productId], references: [id])
  productId String?  @map("product_id")
}
```

### Tag
```prisma
model Tag {
  id    String @id @default(uuid())
  title String

  product   Product? @relation(fields: [productId], references: [id])
  productId String?  @map("product_id")
}
```

### Categorie
```prisma
model Categorie {
  id    String @id @default(uuid())
  title String

  product Product[]
}
```

### Order
```prisma
model Order {
  id            String        @id @unique @default(uuid())
  totalPrice    Float         @map("total_price")
  paymentMethod PaymentMethod
  state         OrderState    @default(AWAITING_PAYMENT)
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

  user   User   @relation(fields: [userId], references: [id])
  userId String @map("user_id")

  store   Store  @relation(fields: [storeId], references: [id])
  storeId String @map("store_id")

  produtos  ProductOrder[]
  Address   Address        @relation(fields: [addressId], references: [id])
  addressId String         @map("anddress_id")

  @@unique([userId, addressId])
  @@index([id])
}

```

### ProductOrder
```prisma
model ProductOrder {
  id       String     @id @unique @default(uuid())
  quantity Int
  state    OrderState @default(AWAITING_PAYMENT)
  paymentMethod PaymentMethod

  order   Order  @relation(fields: [orderId], references: [id])
  orderId String @map("order_id")

  product   Product @relation(fields: [productId], references: [id])
  productId String  @map("product_id")
}
```

### Address
```prisma
model Address {
  id           String   @id @default(uuid())
  userfullName String   @map("user_full_name")
  street       String
  number       String
  complement   String?
  city         String
  state        String
  postalCode   String   @map("postal_code")
  country      String
  phone        String
  cpf          String
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String @map("user_id")

  orders Order[]
}
```
---

### Conclusão

O schema cobre a maioria dos aspectos essenciais para o funcionamento de um e-commerce básico, permitindo o gerenciamento de usuários, lojas, produtos, pedidos e categorias.

Este `README.md` fornece uma visão geral organizada e detalhada do esquema do e-commerce, facilitando a compreensão e o uso do sistema na versão 1.0.0 MVP da API.


