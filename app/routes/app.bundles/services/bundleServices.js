import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getBundles() {
  try {
    const bundles = await prisma.bundle.findMany();
    return bundles;
  } catch (error) {
    console.error("Error in getBundles:", error);
    throw error;
  }
  // In a production app, you may manage prisma disconnection differently.
  // await prisma.$disconnect();
}

export async function createBundle(formData) {
  const title = formData.get("name");
  const description = formData.get("description");
  try {
    return await prisma.bundle.create({
      data: { title, description },
    });
  } catch (error) {
    console.error("Error creating bundle:", error);
    throw error;
  }
}

export async function updateBundle(id, data) {
  try {
    return await prisma.bundle.update({
      where: { id: id }, 
      data,
    });
  } catch (error) {
    console.error("Error updating bundle:", error);
    throw error;
  }
}

export async function deleteBundle(id) {
  try {
    return await prisma.bundle.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting bundle:", error);
    throw error;
  }
}