import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// --- (POST) Crear un nuevo pedido (desde el carrito) ---
export const createOrder = async (req, res) => {
  try {
    const usuarioId = req.user._id;

    // 1. Buscar el carrito del usuario
    const cart = await Cart.findOne({ usuario: usuarioId }).populate('items.producto');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Tu carrito está vacío' });
    }

    let totalPedido = 0;
    const itemsDelPedido = [];
    const bulkStockUpdate = []; // Array para actualizar stock en masa

    // 2. Validar stock y calcular el total
    for (const item of cart.items) {
      const producto = item.producto; // Ya viene populado

      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          success: false,
          error: `Stock insuficiente para ${producto.nombre}`,
        });
      }

      const subtotal = producto.precio * item.cantidad;
      totalPedido += subtotal;

      itemsDelPedido.push({
        producto: producto._id,
        cantidad: item.cantidad,
        subtotal: subtotal,
      });

      // Preparamos la operación de actualización de stock
      bulkStockUpdate.push({
        updateOne: {
          filter: { _id: producto._id },
          update: { $inc: { stock: -item.cantidad } }, // $inc resta la cantidad
        },
      });
    }

    // 3. (Simulación de Pago)
    const { metodoDePago } = req.body;
    if (!metodoDePago) {
       return res.status(400).json({ success: false, error: 'Método de pago es requerido' });
    }

    // 4. Crear el Pedido
    const order = new Order({
      usuario: usuarioId,
      items: itemsDelPedido,
      total: totalPedido,
      metodoDePago: metodoDePago,
      estado: 'pendiente', // Estado inicial
    });
    await order.save();

    // 5. Actualizar el stock en la DB (¡Crítico!)
    await Product.bulkWrite(bulkStockUpdate);

    // 6. Vaciar el carrito
    await Cart.findOneAndUpdate(
      { usuario: usuarioId },
      { $set: { items: [] } } // $set vacía el array
    );

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- (GET) Obtener pedidos de MI usuario ---
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ usuario: req.user._id })
      .populate('items.producto');

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};