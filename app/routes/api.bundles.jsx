import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function loader({ request }) {
  const bundles = await prisma.bundle.findMany();
  return bundles;

};