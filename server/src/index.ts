import "dotenv/config";
import express, { type Application } from "express";
import router from "./routes/routes.js";

const port: Number = Number(process.env.PORT) || 5000;
const app: Application = express();

app.use(express.json());
app.use("/api", router);

app.use((req, res) => {
  res.status(404).json({
    message: "This page is not exists",
    status: false,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
