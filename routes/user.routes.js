import express from 'express';
import { registerUser, getAllUsers } from '../controllers/user.controller.js';
// --- 1. Importar los middlewares ---
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// --- 2. Aplicar los middlewares ---

// POST /api/usuarios/
// El registro es público, no necesita guardias.
router.post('/', registerUser);

// GET /api/usuarios/
// Para esta ruta, el usuario debe:
// 1. Tener un token válido (checkAuth)
// 2. Ser admin (checkAdmin)
router.get('/', checkAuth, checkAdmin, getAllUsers); 

export default router;