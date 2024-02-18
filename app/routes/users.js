import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authToken } from "../middlewares/middlewares.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const router = Router();
router.use(authToken);
const bcryptRound = Number(process.env.BCRYPT_ROUND);

router.get("/users", async (req, res) => {
  const user_id = req.user.id;
  const users = await prisma.user.findMany({
    where: { id: Number(user_id) },
  });
  res.json({ message: "Data Users", users });
});

router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }
  const reqpassword = bcrypt.hashSync(password, bcryptRound);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: reqpassword,
      is_blocked: false,
      role_id: 2,
    },
  });
  res.json({ message: "success add to users", user: user });
});

router.get("/users/:id", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: Number(req.params.id) },
  });
  res.json({ message: "Data Users By ID", user });
});

router.put("/users", async (req, res) => {
  const user_id = req.user.id;
  const { name, email, password } = req.body;
  const reqpassword = bcrypt.hashSync(password, bcryptRound);
  const user = await prisma.user.update({
    where: { id: Number(user_id) },
    data: {
      name,
      email,
      password: reqpassword,
      is_blocked: false,
      role_id: 2,
    },
  });
  res.json({ message: "success update to users", user: user });
});

export default router;
