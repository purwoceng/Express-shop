import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authToken, authorizePermission } from "../middlewares/middlewares.js";
import { Permission } from "../middlewares/authorization.js";
import axios from "axios";

const prisma = new PrismaClient();

const router = Router();
router.use(authToken);

router.get(
  "/orders",
  authorizePermission(Permission.BROWSE_ORDERS),
  async (req, res) => {
    const user_id = req.user.id;
    const user = req.user.role_id;

    if (user === 1) {
      const orders = await prisma.order.findMany({
        orderBy: { date: "desc" },
      });
      return res.json({ message: "Data Orders", orders: orders });
    }

    const orders = await prisma.order.findMany({
      where: { user_id: Number(user_id) },
      orderBy: { date: "desc" },
    });
    res.json({ message: "Data Orders", orders: orders });
  }
);

router.post(
  "/orders",
  authorizePermission(Permission.ADD_ORDER),
  async (req, res) => {
    try {
      const cartData = await prisma.cart.findMany({
        where: { user_id: Number(req.user.id) },
        include: { product: true },
      });

      if (cartData.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      const total = cartData.reduce((acc, item) => acc + item.total, 0);
      const lastOrderNumber = await prisma.order.count();
      const date = new Date();
      const year = date.getFullYear();
      const order = await prisma.order.create({
        data: {
          user_id: req.user.id,
          date: new Date(),
          number:
            "ORD-" + year + "-" + lastOrderNumber.toString().padStart(4, "0"),
          total,
        },
      });

      const orderItems = cartData.map((item) => {
        return {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price,
          total: item.total,
        };
      });

      await prisma.orderItem.createMany({ data: orderItems });

      await prisma.cart.deleteMany({
        where: { user_id: Number(req.user.id) },
      });

      res.json({ message: "Order created successfully", order });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.post("/orders/pay", async (req, res) => {
  try {
    const data = req.body;
    const order = req.order.id;
    if (!order || !data) {
      return res.status(400).json({ message: "Missing order or payment data" });
    }

    if (
      !order.id ||
      !data.cardNumber ||
      !data.cvv ||
      !data.expiryMonth ||
      !data.expiryYear
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields in order or payment data" });
    }

    const dataPayment = {
      amount: order.total,
      cardNumber: data.cardNumber,
      cvv: data.cvv,
      expiryMonth: data.expiryMonth,
      expiryYear: data.expiryYear,
    };

    const paymentResponse = await axios.post(
      "http://localhost:3000/pay",
      dataPayment
    );
    const paymentData = paymentResponse.data;

    if (paymentData.status === "success") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "paid",
        },
      });
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "failed",
        },
      });
    }

    // Mengirim respons kepada klien dengan data pembayaran
    res.json(paymentData);
  } catch (error) {
    // Menangani kesalahan
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
