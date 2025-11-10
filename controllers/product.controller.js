import Product from '../models/Product.js';
import Category from '../models/Category.js'; // Lo necesitamos para validar

// --- (POST) Crear nuevo producto (Solo Admin) ---
export const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, marca } = req.body;

    // 1. Validar que la categoría exista
    const categoryExists = await Category.findById(categoria);
    if (!categoryExists) {
      return res.status(404).json({ success: false, error: 'La categoría no existe' });
    }

    // 2. Crear el producto
    const product = new Product({
      nombre,
      descripcion,
      precio,
      stock,
      categoria, // Guardamos el ID de la categoría
      marca,
    });
    await product.save();

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- (GET) Listar productos con categoría (Público) ---
// Esta es la ruta GET /api/productos que pide el PDF
export const getAllProducts = async (req, res) => {
  try {
    // Usamos .populate() para que "categoria" no sea solo un ID,
    // sino que traiga el objeto completo de la categoría.
    const products = await Product.find({}).populate('categoria');
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- (GET) Ruta de Filtro (Público) ---
// Esta es la ruta GET /api/productos/filtro que pide el PDF
export const filterProducts = async (req, res) => {
  try {
    const { precioMin, precioMax, marca } = req.query;
    let filtro = {};

    // 1. Construir el filtro de precio ($gte, $lte)
    if (precioMin || precioMax) {
      filtro.precio = {};
      if (precioMin) {
        // $gte = "greater than or equal" (mayor o igual)
        filtro.precio.$gte = Number(precioMin);
      }
      if (precioMax) {
        // $lte = "less than or equal" (menor o igual)
        filtro.precio.$lte = Number(precioMax);
      }
    }

    // 2. Construir el filtro de marca
    if (marca) {
      // $eq (implícito)
      filtro.marca = marca;
      // Si quisieras case-insensitive:
      // filtro.marca = new RegExp(marca, 'i');
    }

    const products = await Product.find(filtro).populate('categoria');
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- (PATCH) Actualizar Stock (Solo Admin) ---
// Esta es la ruta PATCH /api/productos/:id/stock
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
       return res.status(400).json({ success: false, error: 'Stock no válido' });
    }

    // $set: actualiza solo este campo
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: { stock: stock } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};