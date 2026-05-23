import { Router } from "express";
import {
  getCategories,
  getProductBySlug,
  listProducts,
} from "../controllers/productController";

const router = Router();

router.get("/", listProducts);
router.get("/categories", getCategories);
router.get("/:slug", getProductBySlug);

// the product link is like this: http://localhost:3000/api/products/camera

export default router;
