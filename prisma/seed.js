import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.product.count();

  if (count > 0) {
    console.log(`Seed dilewati; tabel Product sudah berisi ${count} data.`);
    return;
  }

  await prisma.product.createMany({
    data: [
      { name: "Buku", price: 15000 },
      { name: "Pulpen", price: 5000 },
    ],
  });

  console.log("Seed produk berhasil: Buku dan Pulpen.");
}

main()
  .catch((error) => {
    console.error("Seed produk gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
