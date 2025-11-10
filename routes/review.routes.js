import express from 'express';
import { createReview, getProductReviews, getTopRatedProducts } from '../controllers/review.controller.js';
import { checkAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// --- Rutas Públicas ---
// GET /api/resenas/top (NUEVA RUTA DE AGREGACIÓN)
router.get('/top', getTopRatedProducts); 
// GET /api/resenas/product/:productId
router.get('/product/:productId', getProductReviews);

// --- Rutas de Cliente ---
// POST /api/resenas
router.post('/', checkAuth, createReview);

export default router;