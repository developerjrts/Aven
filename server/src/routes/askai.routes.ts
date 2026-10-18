import express from "express";
import * as askAIController from "../controller/askai.controller.js";
const askAIRouter = express.Router();

askAIRouter.route("/create").post(askAIController.createAINote);

export default askAIRouter;
