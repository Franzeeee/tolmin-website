import { Schema, model, models } from 'mongoose';

const productsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sizes: {
      type: [String],
      required: false, // Optional sizes array
    },

  },
  { timestamps: true }
);

const Products = models.Products || model('Products', productsSchema);
export default Products;
