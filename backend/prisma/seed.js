import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const graveStyles = [
    // FREE
    {
      key: "classic",
      label: "Classica",
      tier: "FREE",
      sortOrder: 1,
    },

    // MEDIUM
    {
      key: "simple",
      label: "Semplice",
      tier: "MEDIUM",
      sortOrder: 2,
    },
    {
      key: "heart",
      label: "Cuore",
      tier: "MEDIUM",
      sortOrder: 3,
    },
    {
      key: "stone",
      label: "Pietra",
      tier: "MEDIUM",
      sortOrder: 4,
    },
    {
      key: "modern",
      label: "Moderna",
      tier: "MEDIUM",
      sortOrder: 5,
    },

    // PLUS
    {
      key: "angel",
      label: "Angelo",
      tier: "PLUS",
      sortOrder: 6,
    },
    {
      key: "gold",
      label: "Dorata",
      tier: "PLUS",
      sortOrder: 7,
    },
    {
      key: "nature",
      label: "Natura",
      tier: "PLUS",
      sortOrder: 8,
    },
  ];

  for (const style of graveStyles) {
    await prisma.graveStyle.upsert({
      where: { key: style.key },
      update: {},
      create: style,
    });
  }

  console.log("✅ Grave styles seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
