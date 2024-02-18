import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authToken, authorizePermission } from "../middlewares/middlewares.js";
import { Permission } from "../middlewares/authorization.js";

const prisma = new PrismaClient();

const router = Router();

router.get("/search", async (req, res) => {
  const category = await prisma.category.findFirst({
    where: {
      name: {
        contains: req.query.category,
      },
    },
  });

  const search = await prisma.product.findMany({
    where: {
      category_id: category.id,
      name: {
        contains: req.query.name,
      },
      description: {
        contains: req.query.description,
      },
    },
  });
  res.json({ message: "Data products", products: search });
});

router.get("/products", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // default page = 1, limit = 10
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  try {
    const totalCount = await prisma.product.count(); // Menghitung total jumlah produk
    const totalPages = Math.ceil(totalCount / parsedLimit);

    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      skip: skip,
      take: parsedLimit,
    });

    if (products.length === 0) {
      return res.status(404).json({
        message: "Data products not found",
      });
    }

    res.json({
      message: "Data products",
      products: products,
      page: parsedPage,
      totalPages: totalPages,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
