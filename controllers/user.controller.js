import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// --- Función para generar un Token ---
const generateToken = (id) => {
  // Usamos la variable secreta de .env
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // El token expira en 30 días
  });
};

// --- (POST) Registrar un nuevo usuario ---
export const registerUser = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // 1. Validar que vengan los datos
    if (!nombre || !email || !password) {
      return res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
    }

    // 2. Verificar si el email ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'El email ya está registrado' });
    }

    // 3. Crear el nuevo usuario
    // El "hash" de la contraseña lo hace automáticamente
    // nuestro modelo de User, gracias al 'userSchema.pre('save', ...)'
    const user = new User({
      nombre,
      email,
      password,
      rol, // Si no se pasa, el modelo usará 'cliente' por defecto
    });

    await user.save(); // Aquí se hashea la contraseña y se guarda

    // 4. Generar token y responder
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        token: token,
      },
    });
  } catch (error) {
    // Usamos el middleware de error (que crearemos después)
    // Por ahora, solo logueamos
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- (GET) Listar todos los usuarios (Ruta de Admin) ---
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password'); // No mostrar contraseñas
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};