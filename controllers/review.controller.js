import Review from '../models/Review.js';
import Order from '../models/Order.js';

// --- (POST) Crear nueva reseña (Solo Clientes que compraron) ---
export const createReview = async (req, res) => {
  const { productoId, calificacion, comentario } = req.body;
  const usuarioId = req.user._id;

  try {
    // 1. VALIDACIÓN CLAVE: ¿El usuario compró este producto?
    // Buscamos un pedido del usuario, que esté 'entregado' (o al menos 'pendiente')
    // y que en sus 'items' contenga el 'productoId'.
    const orderExists = await Order.findOne({
      usuario: usuarioId,
      // estado: 'entregado', // (Podrías agregar esto para más rigor)
      'items.producto': productoId, // Busca dentro del array de items
    });

    if (!orderExists) {
      return res.status(403).json({
        success: false,
        error: 'No puedes reseñar un producto que no has comprado',
      });
    }

    // 2. (Opcional) Verificar si ya reseñó este producto
    const reviewExists = await Review.findOne({ usuario: usuarioId, producto: productoId });
    if (reviewExists) {
       return res.status(400).json({ success: false, error: 'Ya has reseñado este producto' });
    }

    // 3. Crear la reseña
    const review = new Review({
      usuario: usuarioId,
      producto: productoId,
      calificacion,
      comentario,
    });

    await review.save();
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- (GET) Obtener reseñas de un producto (Público) ---
// GET /api/resenas/product/:productId [cite: 61]
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ producto: productId })
      .populate('usuario', 'nombre'); // Solo mostrar el nombre del usuario

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};