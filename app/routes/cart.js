import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authToken, authorizePermission } from "../middlewares/middlewares.js";
import { Permission } from "../middlewares/authorization.js";

const prisma = new PrismaClient();

const router = Router();
router.use(authToken);

router.get(
  "/cart",
  authorizePermission(Permission.BROWSE_ORDERS),
  async (req, res) => {
    const user_id = req.user.id;
    const cart = await prisma.cart.findMany({
      where: { user_id: Number(user_id) },
      include: {
        product: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    if (cart.length === 0) {
      return res.status(404).json({
        message: "data cart not found",
      });
    }
    const total_price = cart.reduce((acc, item) => acc + item.total, 0);
    let total_products = 0;
    cart.forEach((row) => {
      if (row.product_id) {
        total_products++;
      }
    });
    res.json({ message: "Data Cart", cart, total_price, total_products });
  }
);

router.post(
  "/cart",
  authorizePermission(Permission.ADD_CART),
  async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;
    const product = await prisma.product.findUnique({
      where: { id: Number(product_id) },
    });

    const in_stock = product.in_stock;

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (in_stock === false) {
      return res.status(400).json({ message: "Product out of stock" });
    }

    const existingCart = await prisma.cart.findFirst({
      where: { product_id: Number(product_id) },
    });

    let total = product.price * quantity;

    if (existingCart) {
      const newQuantity = existingCart.quantity + quantity;
      total = product.price * newQuantity;
      await prisma.cart.update({
        where: { id: existingCart.id },
        data: { quantity: newQuantity, total },
      });

      return res.json({ message: "Cart updated successfully" });
    }

    const cart = await prisma.cart.create({
      data: {
        product_id: product_id,
        quantity: quantity,
        total: total,
        user_id: user_id,
      },
    });

    res.json({ message: "Cart created successfully", cart });
  }
);

router.delete(
  "/cart/:id",
  authorizePermission(Permission.DELETE_CART),
  async (req, res) => {
    const { id } = req.params;

    try {
      await prisma.cart.delete({
        where: { id: Number(id) },
      });
      res.json({ message: "Cart deleted successfully" });
    } catch (err) {
      res.status(404).json({ message: "Cart item not found" });
    }
  }
);

router.delete(
  "/cart",
  authorizePermission(Permission.DELETE_CART),
  async (req, res) => {
    const user_id = req.user.id;
    await prisma.cart.deleteMany({
      where: { user_id: Number(user_id) },
    });
    res.json({ message: "Cart emptied successfully" });
  }
);
export default router;
