import express from "express";
import productRoutes from "./routes/productRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { HttpError } from "./utils/httpError.js";

const app = express();

app.use(express.json());
app.use("/products", productRoutes);

app.use((_req, _res, next) => {
  next(new HttpError(404, "Endpoint tidak ditemukan"));
});

app.use(errorHandler);

export default app;
