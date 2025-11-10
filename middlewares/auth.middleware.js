import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// --- 1. checkAuth (El Guardia Principal) ---
// Revisa si el token es válido y si el usuario existe.
export const checkAuth = async (req, res, next) => {
  let token;

  // El token debe venir en los headers así: "Authorization: Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Obtenemos el token (quitando la palabra "Bearer")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificamos que el token sea válido con nuestra clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Si es válido, buscamos al usuario en la DB (sin la contraseña)
      // y lo "adjuntamos" al objeto 'req' para usarlo en las rutas.
      req.user = await User.findById(decoded.id).select('-password');

      // 4. Si todo OK, ¡adelante! Pasa al siguiente middleware o al controlador.
      next();

    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, error: 'Token no válido' });
    }
  }

  // Si no hay token en el header
  if (!token) {
    return res.status(401).json({ success: false, error: 'No autorizado, no hay token' });
  }
};

// --- 2. checkAdmin (El Guardia "VIP") ---
// Revisa si el usuario es Admin.
// IMPORTANTE: Este middleware DEBE usarse *después* de checkAuth.
export const checkAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    // Si 'req.user' existe (gracias a checkAuth) Y es 'admin', ¡adelante!
    next();
  } else {
    // Si no, no tiene permisos.
    return res.status(403).json({ success: false, error: 'Acceso denegado, se requiere rol de administrador' });
  }
};