import express from 'express';
import { createOrder, getMyOrders } from '../controllers/order.controller.js';
import { checkAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas de Pedidos requieren estar logueado
router.use(checkAuth);

// POST /api/ordenes (Crear pedido)
router.post('/', createOrder);

// GET /api/ordenes/mis-pedidos (Ver mis pedidos)
// Usamos esta ruta para /api/ordenes/user/:userId pero más segura
router.get('/mis-pedidos', getMyOrders);

export default router;