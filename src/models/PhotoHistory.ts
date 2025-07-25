import { Schema, model, models } from 'mongoose';

const photoHistorySchema = new Schema(
  {
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    images: {
      type: [String], // array of Cloudinary URLs
      required: true,
    },
  },
  { timestamps: true }
);

const PhotoHistory = models.PhotoHistory || model('PhotoHistory', photoHistorySchema);
export default PhotoHistory;
