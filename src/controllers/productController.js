import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/httpError.js";

const MAX_INT32 = 2_147_483_647;

function parseProductId(value) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id < 1 || id > MAX_INT32) {
    throw new HttpError(400, "ID produk harus berupa bilangan bulat positif");
  }

  return id;
}

function getProductBody(body) {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new HttpError(400, "Body request harus berupa object JSON");
  }

  return body;
}

function validateProductFields(name, price) {
  if (typeof name !== "string" || !name.trim()) {
    throw new HttpError(400, "Nama produk wajib diisi");
  }

  if (
    typeof price !== "number" ||
    !Number.isSafeInteger(price) ||
    price < 0 ||
    price > MAX_INT32
  ) {
    throw new HttpError(
      400,
      "Harga harus berupa bilangan bulat antara 0 dan 2147483647",
    );
  }

  return { name: name.trim(), price };
}

function sendNotFound(res) {
  return res.status(404).json({ message: "Produk tidak ditemukan" });
}

// GET /products
export async function getAllProducts(_req, res) {
  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
  });

  return res.status(200).json(products);
}

// GET /products/:id
export async function getProductById(req, res) {
  const id = parseProductId(req.params.id);
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return sendNotFound(res);
  }

  return res.status(200).json(product);
}

// POST /products
export async function createProduct(req, res) {
  const body = getProductBody(req.body);
  const data = validateProductFields(body.name, body.price);
  const product = await prisma.product.create({ data });

  return res.status(201).json(product);
}

// PUT /products/:id
// Body PUT menyertakan ID dan nilainya harus sama dengan ID pada URL.
export async function updateProduct(req, res) {
  const id = parseProductId(req.params.id);
  const body = getProductBody(req.body);

  if (
    typeof body.id !== "number" ||
    !Number.isSafeInteger(body.id) ||
    body.id !== id
  ) {
    throw new HttpError(400, "ID pada body harus sama dengan ID pada URL");
  }

  const data = validateProductFields(body.name, body.price);
  const existingProduct = await prisma.product.findUnique({ where: { id } });

  if (!existingProduct) {
    return sendNotFound(res);
  }

  const product = await prisma.product.update({
    where: { id },
    data,
  });

  return res.status(200).json(product);
}

// DELETE /products/:id
export async function deleteProduct(req, res) {
  const id = parseProductId(req.params.id);
  const existingProduct = await prisma.product.findUnique({ where: { id } });

  if (!existingProduct) {
    return sendNotFound(res);
  }

  const product = await prisma.product.delete({ where: { id } });

  return res.status(200).json({
    message: "Produk berhasil dihapus",
    data: product,
  });
}
