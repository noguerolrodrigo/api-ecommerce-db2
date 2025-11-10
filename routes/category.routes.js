import express from 'express';
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// --- Rutas Públicas ---
// GET /api/categorias (Listar todas)
router.get('/', getAllCategories);

// --- Rutas de Admin ---
// (Requieren token válido y rol de admin)

// POST /api/categorias (Crear)
router.post('/', checkAuth, checkAdmin, createCategory);

// PUT /api/categorias/:id (Actualizar)
router.put('/:id', checkAuth, checkAdmin, updateCategory);

// DELETE /api/categorias/:id (Eliminar)
router.delete('/:id', checkAuth, checkAdmin, deleteCategory);

export default router;