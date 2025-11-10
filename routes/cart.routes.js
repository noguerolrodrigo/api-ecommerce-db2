import express from 'express';
import {
  addItemToCart,
  getCart,
  removeItemFromCart,
} from '../controllers/cart.controller.js';
import { checkAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// TODAS las rutas del carrito requieren estar logueado
router.use(checkAuth);

// GET /api/carrito (Obtener mi carrito)
router.get('/', getCart);

// POST /api/carrito (Añadir ítem)
router.post('/', addItemToCart);

// DELETE /api/carrito/:productoId (Quitar ítem)
router.delete('/:productoId', removeItemFromCart);

// (La ruta de /total la podemos calcular en el GET)

export default router;