import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // No puede haber dos emails iguales
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      enum: ['cliente', 'admin'], // Solo permite estos dos valores
      default: 'cliente', // Por defecto, es cliente
    },
    // Podes agregar 'direccion' y 'telefono' aquí [cite: 5]
    direccion: { type: String, trim: true },
    telefono: { type: String, trim: true },
  },
  {
    timestamps: true, // Crea 'createdAt' y 'updatedAt'
  }
);

// --- IMPORTANTE: Hashear la contraseña ANTES de guardar ---
// Esto se ejecuta automáticamente ANTES de un .save()
userSchema.pre('save', async function (next) {
  // Si la contraseña no se modificó, no la volvemos a hashear
  if (!this.isModified('password')) {
    return next();
  }

  // "Salt" es la complejidad del hasheo
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;