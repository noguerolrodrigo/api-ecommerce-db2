import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    // --- LA REFERENCIA CLAVE ---
    // Así conectamos Productos con Categorías
    categoria: {
      type: mongoose.Schema.Types.ObjectId, // Guardamos el ID de la categoría
      ref: 'Category', // Le decimos a Mongoose que este ID es de la colección 'Category'
      required: true,
    },
    // Añadí 'marca' porque la ruta de filtro lo pide [cite: 38]
    marca: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;