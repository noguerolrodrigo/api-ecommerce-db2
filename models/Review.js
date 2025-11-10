import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    comentario: {
      type: String,
      trim: true,
      required: true,
    },
    calificacion: {
      type: Number,
      min: 1, // Calificación mínima
      max: 5, // Calificación máxima
      required: true,
    },
    // --- LAS DOS REFERENCIAS CLAVE ---
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;