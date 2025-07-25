// models/Orders.ts
import { Schema, model, models, Types } from 'mongoose';

const ordersSchema = new Schema(
  {
    customerEmail: {
      type: String,
      required: true,
    },
    items: [
      {
        product: {
          type: Types.ObjectId,
          ref: 'Products',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    orderedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Orders = models.Orders || model('Orders', ordersSchema);
export default Orders;
