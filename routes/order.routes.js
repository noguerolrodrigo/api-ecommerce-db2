import express from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderStats } from '../controllers/order.controller.js';
import { checkAuth, checkAdmin} from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas de Pedidos requieren estar logueado
router.use(checkAuth);

// POST /api/ordenes (Crear pedido)
router.post('/', createOrder);

// GET /api/ordenes/mis-pedidos (Ver mis pedidos)
// Usamos esta ruta para /api/ordenes/user/:userId pero más segura
router.get('/mis-pedidos', getMyOrders);
// --- Rutas de Admin (requieren checkAuth y checkAdmin) ---

// GET /api/ordenes/stats (Agregación)
router.get('/stats', checkAdmin, getOrderStats); // <-- Se añade ruta

// GET /api/ordenes (Listar todos los pedidos)
router.get('/', checkAdmin, getAllOrders); // <-- Se añade ruta

// PATCH /api/ordenes/:id/status (Actualizar estado)
router.patch('/:id/status', checkAdmin, updateOrderStatus); // Se añade ruta

export default router;