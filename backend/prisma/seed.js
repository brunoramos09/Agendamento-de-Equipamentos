require('dotenv/config');
const { PrismaClient } = require('../src/generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@teste.com' },
    update: {
      name: 'Admin',
      password: 'senha',
      role: 'ADMIN',
    },
    create: {
      id: 1,
      name: 'Admin',
      email: 'admin@teste.com',
      password: 'senha',
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'default@teste.com' },
    update: {
      name: 'Default',
      password: 'senha',
      role: 'NORMAL',
    },
    create: {
      id: 2,
      name: 'Default',
      email: 'default@teste.com',
      password: 'senha',
      role: 'NORMAL',
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
