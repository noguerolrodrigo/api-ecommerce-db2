import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Carga las variables de entorno del .env
dotenv.config();

const connectDB = async () => {
  try {
    // Intenta conectarse a la DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Conectado');
  } catch (error) {
    // Si falla, muestra el error y cierra la aplicación
    console.error(`Error de conexión: ${error.message}`);
    process.exit(1); 
  }
};

export default connectDB;