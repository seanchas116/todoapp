import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await createUsers();
  const promises = users.map((user) => createTodos(user));
  await Promise.all(promises);
}

async function createUsers() {
  const users = [
    {
      id: "1",
      name: "Alice",
    },
    {
      id: "2",
      name: "Bob",
    },
    {
      id: "3",
      name: "Charlie",
    },
  ];

  const promises = users.map((user) => {
    return prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        name: user.name,
      },
    });
  });

  return await Promise.all(promises);
}

async function createTodos(user: User) {
  const promises: Promise<unknown>[] = [];

  for (let i = 0; i < 3; ++i) {
    promises.push(
      prisma.todo.create({
        data: {
          title: `Todo ${i + 1} for ${user.name}`,
          userId: user.id,
        },
      })
    );
  }

  await Promise.all(promises);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
