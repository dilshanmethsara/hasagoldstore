import { Router } from "express";
import { paymentMethodService } from "../services/paymentMethodService";

const router = Router();

// List active payment methods (public)
router.get("/", async (_req, res) => {
  try {
    const methods = await paymentMethodService.listActive();
    res.json(methods);
  } catch (error) {
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch payment methods" });
  }
});

export { router as paymentMethodRoutes };
