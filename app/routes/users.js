import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const router = Router();

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
export default router;
