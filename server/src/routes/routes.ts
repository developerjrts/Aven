import express from "express";
import summaryRouter from "./summary.routes.js";
const router = express.Router();

router.use("/summary", summaryRouter);

export default router;
