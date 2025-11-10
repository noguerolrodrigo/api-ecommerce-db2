import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// --- (POST) Añadir un ítem al carrito ---
export const addItemToCart = async (req, res) => {
  const { productoId, cantidad } = req.body;
  const usuarioId = req.user._id; // Viene de checkAuth

  try {
    // 1. Validar que el producto exista y haya stock
    const producto = await Product.findById(productoId);
    if (!producto) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    if (producto.stock < cantidad) {
      return res.status(400).json({ success: false, error: 'Stock insuficiente' });
    }

    // 2. Buscar el carrito del usuario (o crearlo)
    let cart = await Cart.findOne({ usuario: usuarioId });
    if (!cart) {
      cart = new Cart({ usuario: usuarioId, items: [] });
    }

    // 3. Verificar si el producto ya está en el carrito
    const itemIndex = cart.items.findIndex(
      (item) => item.producto.toString() === productoId
    );

    if (itemIndex > -1) {
      // Si ya existe, actualiza la cantidad
      cart.items[itemIndex].cantidad += cantidad;
    } else {
      // Si es nuevo, lo añade con $push (implícito en .push)
      cart.items.push({ producto: productoId, cantidad });
    }

    await cart.save();
    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- (GET) Obtener el carrito del usuario ---
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ usuario: req.user._id })
      .populate('items.producto'); // Rellenamos la info de los productos

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- (DELETE) Eliminar un ítem del carrito ---
export const removeItemFromCart = async (req, res) => {
  const { productoId } = req.params;
  const usuarioId = req.user._id;

  try {
    // Usamos $pull para sacar un elemento de un array
    const cart = await Cart.findOneAndUpdate(
      { usuario: usuarioId },
      { $pull: { items: { producto: productoId } } },
      { new: true } // Devuelve el carrito actualizado
    ).populate('items.producto');

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};