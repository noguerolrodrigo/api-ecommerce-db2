import Category from '../models/Category.js';

// --- (POST) Crear nueva categoría (Solo Admin) ---
export const createCategory = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) {
      return res.status(400).json({ success: false, error: 'El nombre es obligatorio' });
    }

    const categoryExists = await Category.findOne({ nombre });
    if (categoryExists) {
      return res.status(400).json({ success: false, error: 'La categoría ya existe' });
    }

    const category = new Category({ nombre, descripcion });
    await category.save();

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- (GET) Listar todas las categorías (Público) ---
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- (PUT) Actualizar categoría (Solo Admin) ---
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { nombre, descripcion },
      { new: true, runValidators: true } // 'new: true' devuelve el doc actualizado
    );

    if (!category) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- (DELETE) Eliminar categoría (Solo Admin) ---
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }
    // (Opcional: aquí deberías verificar si algún producto usa esta categoría)
    res.json({ success: true, data: { message: 'Categoría eliminada' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};