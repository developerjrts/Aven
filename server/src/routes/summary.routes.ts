import express from "express";
import * as summaryController from "../controller/summary.controller.js";
const summaryRouter = express.Router();

summaryRouter.route("/create").post(summaryController.createSummary);

export default summaryRouter;
