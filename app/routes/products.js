import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authToken, authorizePermission } from "../middlewares/middlewares.js";
import { Permission } from "../middlewares/authorization.js";

const prisma = new PrismaClient();

const router = Router();
router.use(authToken);

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
    },
  });
  res.json({ message: "Data products", products: search });
});

router.get(
  "/products",
  authorizePermission(Permission.BROWSE_PRODUCTS),
  async (req, res) => {
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
  }
);

router.post(
  "/products",
  authorizePermission(Permission.ADD_PRODUCT),
  async (req, res) => {
    const { name, category_id, price, in_stock, description } = req.body;
    if ((!name, !category_id, !price, !in_stock, !description)) {
      return res.status(400).json({
        message: "name, category, price, in_stock, description is required",
      });
    }
    try {
      const product = await prisma.product.create({
        data: {
          name,
          category_id,
          price,
          in_stock,
          description,
        },
      });
      res.json({
        message: "data products successfully added",
        product: product,
      });
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  }
);

router.get(
  "/products/:id",
  authorizePermission(Permission.READ_PRODUCT),
  async (req, res) => {
    const productsId = req.params.id;
    if (isNaN(productsId)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const product = await prisma.product.findFirst({
      where: { id: Number(productsId) },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    if (product === null) {
      return res.json({ message: "Product Not Found" });
    }
    res.json({ message: "Data Products By ID", product });
  }
);

router.put(
  "/products/:id",
  authorizePermission(Permission.EDIT_PRODUCT),
  async (req, res) => {
    const { name, category_id, price, in_stock, description } = req.body;

    if (!name || !category_id || !price) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const productId = req.params.id;

    if (isNaN(productId)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    try {
      const product = await prisma.product.update({
        where: { id: Number(productId) }, // !!!!!!!!!
        data: { name, category_id, price, in_stock, description },
      });
      res.json({ message: "Product updated successfully", product });
    } catch (err) {
      res.status(404).json({ message: "Data Products Not found" });
    }
  }
);

router.delete(
  "/products/:id",
  authorizePermission(Permission.DELETE_PRODUCT),
  async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await prisma.product.delete({
        where: { id: Number(productId) },
      });
      res.json({ message: "Data Category Successfully deleted", product });
    } catch (err) {
      res.status(404).json({ message: "Data Product Not Found" });
    }
  }
);
export default router;
