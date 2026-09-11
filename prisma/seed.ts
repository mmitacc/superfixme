import { prisma } from "../src/lib/prisma.ts";

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const [ada, alan, grace] = await Promise.all([
    prisma.user.create({ data: { name: "Ada Lovelace", email: "ada@example.com" } }),
    prisma.user.create({ data: { name: "Alan Turing", email: "alan@example.com" } }),
    prisma.user.create({ data: { name: "Grace Hopper", email: "grace@example.com" } }),
  ]);

  const [electronica, oficina] = await Promise.all([
    prisma.category.create({ data: { name: "Electronica" } }),
    prisma.category.create({ data: { name: "Oficina" } }),
  ]);

  const [teclado, mouse, monitor, silla] = await Promise.all([
    prisma.product.create({
      data: { name: "Teclado mecanico", description: "Switches azules", price: 49.99, stock: 25, categoryId: electronica.id },
    }),
    prisma.product.create({
      data: { name: "Mouse inalambrico", description: "2.4GHz + Bluetooth", price: 29.99, stock: 40, categoryId: electronica.id },
    }),
    prisma.product.create({
      data: { name: "Monitor 27\"", description: "IPS 144Hz", price: 279.0, stock: 10, categoryId: electronica.id },
    }),
    prisma.product.create({
      data: { name: "Silla ergonomica", description: "Soporte lumbar ajustable", price: 189.5, stock: 15, categoryId: oficina.id },
    }),
  ]);

  await prisma.order.create({
    data: {
      userId: ada.id,
      status: "PAID",
      items: {
        create: [
          { productId: teclado.id, quantity: 1, unitPrice: teclado.price },
          { productId: mouse.id, quantity: 2, unitPrice: mouse.price },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: alan.id,
      status: "PENDING",
      items: {
        create: [{ productId: monitor.id, quantity: 1, unitPrice: monitor.price }],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: grace.id,
      status: "SHIPPED",
      items: {
        create: [{ productId: silla.id, quantity: 1, unitPrice: silla.price }],
      },
    },
  });

  console.log("Seed completado: 3 usuarios, 2 categorias, 4 productos, 3 ordenes.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
