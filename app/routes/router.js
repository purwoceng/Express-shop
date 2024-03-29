import { Router } from "express";
import categoriesRoute from "./categories.js";
import productRoute from "./products.js";
import cartRoute from "./cart.js";
import orderRoute from "./order.js";
import loginRoute from "./login.js";
import userRoute from "./users.js";
import search from "./search.js";

const router = Router();
router.use(search);
router.use(userRoute);
router.use(loginRoute);
router.use(categoriesRoute);
router.use(productRoute);
router.use(cartRoute);
router.use(orderRoute);
export default router;
