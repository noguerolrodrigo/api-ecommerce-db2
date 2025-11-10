import express from 'express';
import dotenv from 'dotenv'; // <-- dotenv es clave
import connectDB from './config/db.js'; // Importa la conexión
import userRoutes from './routes/user.routes.js'; // <-- IMPORTAR RUTAS

// Carga variables de entorno
dotenv.config();

// Llama a la función de conexión
connectDB();

// ... (imports de express, dotenv, db, userRoutes)
import categoryRoutes from './routes/category.routes.js'; // <-- 1. IMPORTAR

// ... (dotenv.config(), connectDB())

const app = express();
// ... (PORT, app.use(express.json()))



// Definimos el puerto
const PORT = process.env.PORT || 8080;

// Middleware para que Express entienda JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API de E-commerce funcionando!' });
});

// <-- USAR RUTAS -->
// Le decimos a la app que use /api/usuarios para todas las rutas de user.routes.js
app.use('/api/usuarios', userRoutes);
app.use('/api/categorias', categoryRoutes);

// Ponemos el servidor a escuchar
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});