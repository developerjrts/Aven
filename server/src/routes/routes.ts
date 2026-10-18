import express from "express";
import askAIRouter from "./askai.routes.js";
import summaryRouter from "./summary.routes.js";
const router = express.Router();

router.use("/summary", summaryRouter);
router.use("/askai", askAIRouter);

export default router;
