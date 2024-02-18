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

router.post(
  "/orders/pay",
  authorizePermission(Permission.EDIT_ORDER),
  async (req, res) => {
    try {
      const data = req.body;
      const id = req.user.id;

      if (!id || !data) {
        return res
          .status(400)
          .json({ message: "Missing order or payment data" });
      }

      if (
        !data.order_id ||
        !data.cardNumber ||
        !data.cvv ||
        !data.expiryMonth ||
        !data.expiryYear
      ) {
        return res.status(400).json({
          message: "Missing required fields in order or payment data",
        });
      }

      if (
        isNaN(data.order_id) ||
        isNaN(data.cardNumber) ||
        isNaN(data.cvv) ||
        isNaN(data.expiryMonth) ||
        isNaN(data.expiryYear)
      ) {
        return res.status(400).json({ message: "Invalid data" });
      }

      const order = await prisma.order.findFirst({
        where: { user_id: Number(id), id: Number(data.order_id) },
      });
      if (!order) {
        return res.status(401).json({ message: "Order not found" });
      }
      if (order.status === "paid") {
        return res.status(400).json({ message: "Order already paid" });
      }

      const dataPayment = {
        amount: order.total,
        cardNumber: data.cardNumber,
        cvv: data.cvv,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
      };

      const validNumber = /^\d{16}$/.test(dataPayment.cardNumber);
      if (!validNumber) {
        return res.status(400).json({ message: "Invalid card number" });
      }

      const paymentResponse = await axios.post(
        "http://localhost:3000/pay",
        dataPayment
      );

      if (paymentResponse.status === 200) {
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

      res.json({ message: "success", payment: paymentResponse.data });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
