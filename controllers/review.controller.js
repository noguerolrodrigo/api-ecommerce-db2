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
// GET /api/resenas/product/:productId
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ producto: productId })
      .populate('usuario', 'nombre'); // Solo mostrar el nombre del usuario

    res.json({ success: true, data: reviews });
  } catch (error)
    {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- (GET) Obtener reseñas de un producto (Público) ---
// GET /api/resenas/product/:productId [cite: 61]
export const getTopRatedProducts = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      // --- Etapa 1: Agrupar ($group) ---
      // Agrupamos todas las reseñas por el campo 'producto'
      {
        $group: {
          _id: '$producto', // Agrupar por ID de producto
          // --- Operador $avg ---
          promedioCalificacion: { $avg: '$calificacion' }, // Calcular el promedio
          // --- Operador $count ---
          totalResenas: { $sum: 1 }, // Contar cuántas reseñas tiene cada grupo
        },
      },
      // --- Etapa 2: Ordenar ($sort) ---
      // Ordenamos de mayor a menor promedio
      {
        $sort: { promedioCalificacion: -1 }, // -1 = descendente
      },
      // --- Etapa 3: Unir ($lookup) ---
      // Opcional pero recomendado: traemos la info del producto
      {
        $lookup: {
          from: 'products', // Nombre de la colección en MongoDB (¡suele ser plural!)
          localField: '_id', // El campo de esta colección (Review)
          foreignField: '_id', // El campo de la colección 'products'
          as: 'productoData', // Nombre del array donde se guardará
        },
      },
      // --- Etapa 4: Desanidar ($unwind) ---
      // $lookup devuelve un array, lo "desarmamos" para tener un objeto
      {
        $unwind: '$productoData',
      },
      // --- Etapa 5: Proyectar ($project) ---
      // Limpiamos la salida para que sea más clara
      {
        $project: {
          _id: 0, // No mostrar el ID del grupo
          productoId: '$_id',
          nombreProducto: '$productoData.nombre',
          promedioCalificacion: 1, // 1 = mostrar este campo
          totalResenas: 1,
        },
      },
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};