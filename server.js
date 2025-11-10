import express from 'express';

// Inicializamos la app
const app = express();

// Definimos el puerto
const PORT = process.env.PORT || 8080;

// Middleware para que Express entienda JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API de E-commerce funcionando!' });
});

// Ponemos el servidor a escuchar
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});