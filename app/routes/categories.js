import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authToken, authorizePermission } from "../middlewares/middlewares.js";
import { Permission } from "../middlewares/authorization.js";

const prisma = new PrismaClient();

const router = Router();
router.use(authToken);

/**
 * @swagger
 * /Categories:
 *   get:
 *     summary: Get employee by ID.
 *     description: Get employee by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Employee ID
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/categories",
  authorizePermission(Permission.BROWSE_CATEGORIES),
  authToken,
  async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json({ message: "Data Categories", categories });
  }
);

router.post(
  "/categories",
  authorizePermission(Permission.ADD_CATEGORY),
  async (req, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "name is required",
      });
    }
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    res.json({ message: "success add to categories", category: category });
  }
);

router.get(
  "/categories/:id",
  authorizePermission(Permission.READ_CATEGORY),
  async (req, res) => {
    const categoryId = req.params.id;
    const category = await prisma.category.findFirst({
      where: { id: Number(categoryId) },
    });
    res.json({ message: "Data Categories By ID", category });
  }
);

router.put(
  "/categories/:id",
  authorizePermission(Permission.EDIT_CATEGORY),
  async (req, res) => {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const categoryId = req.params.id;

    if (isNaN(categoryId)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    try {
      const category = await prisma.category.update({
        where: { id: Number(categoryId) },
        data: { name },
      });
      res.json({ message: "Category updated successfully", category });
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  }
);

router.delete(
  "/categories/:id",
  authorizePermission(Permission.DELETE_CATEGORY),
  async (req, res) => {
    const categoryId = req.params.id;
    const category = await prisma.category.delete({
      where: { id: Number(categoryId) },
    });
    res.json({ message: "Data Category Successfully deleted", category });
  }
);
export default router;
