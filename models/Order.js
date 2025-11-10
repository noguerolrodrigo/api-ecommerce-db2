import mongoose from 'mongoose';

// Sub-esquema para los ítems del pedido
const orderItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  // ¡Importante! Guardamos el precio al momento de la compra
  // para que no cambie si el producto se actualiza.
  subtotal: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    // Asociado a un usuario [cite: 17]
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema], // [cite: 16]

    // Información general del pedido [cite: 15]
    total: {
      type: Number,
      required: true,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
      default: 'pendiente',
    },
    metodoDePago: {
      type: String,
      required: true,
      default: 'MercadoPago', // (o el que uses)
    },
    // La 'fecha' la maneja 'timestamps' [cite: 15]
  },
  {
    timestamps: true, // Esto crea 'createdAt' (fecha) y 'updatedAt'
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;