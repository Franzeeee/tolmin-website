// models/Orders.ts
import { Schema, model, models, Types } from 'mongoose';

const ordersSchema = new Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: false },
      address: { type: String, required: true },
    },
    items: [
      {
        product: {
          type: Types.ObjectId,
          ref: 'Products',
          required: true,
        },
        name: { type: String, required: true }, // e.g. "Majica Tolmin"
        size: { type: String, required: false }, // e.g. "M", "L"
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }, // per item
      },
    ],
    totalItems: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'Credit Card', 'Paypal'], // extend if needed
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    deliveryMethod: {
      type: String,
      enum: ['Home Delivery', 'Pickup', 'Postal Service'], // extend if needed
      required: true,
    },
    totalPayment: { type: Number, required: true }, // total amount to be paid
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },

    orderedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Orders = models.Orders || model('Orders', ordersSchema);
export default Orders;
