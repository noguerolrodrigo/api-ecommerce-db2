import mongoose from 'mongoose';

// --- Sub-esquema para los ítems del carrito ---
// No es un modelo, es una plantilla para el array
const cartItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  // Nota: No guardamos el precio aquí
  // Lo calcularemos al momento de ver el carrito
  // para tener siempre el precio actualizado.
});

// --- Esquema Principal del Carrito ---
const cartSchema = new mongoose.Schema(
  {
    // El carrito le pertenece a UN usuario 
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Cada usuario solo puede tener UN carrito
    },
    // Un array de los productos 
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;