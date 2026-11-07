import { HttpError } from "../utils/httpError.js";

export function errorHandler(error, _req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Format JSON tidak valid" });
  }

  console.error(error);
  return res.status(500).json({ message: "Terjadi kesalahan pada server" });
}
