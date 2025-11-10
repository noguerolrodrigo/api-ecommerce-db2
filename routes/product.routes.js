import express from 'express';
import {
  createProduct,
  getAllProducts,
  filterProducts,
  updateStock
} from '../controllers/product.controller.js';
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// --- Rutas Públicas ---
// GET /api/productos (Listar todos con categoría)
router.get('/', getAllProducts);

// GET /api/productos/filtro (Filtrar por precio y marca)
router.get('/filtro', filterProducts);

// (Faltaría GET /api/productos/top - la hacemos después con Agregaciones)

// --- Rutas de Admin ---
// POST /api/productos (Crear producto)
router.post('/', checkAuth, checkAdmin, createProduct);

// PATCH /api/productos/:id/stock (Actualizar stock)
router.patch('/:id/stock', checkAuth, checkAdmin, updateStock);

export default router;