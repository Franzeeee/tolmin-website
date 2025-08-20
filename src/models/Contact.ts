import { Schema, model, models } from 'mongoose';

const contactSchema = new Schema(
  {
    contact_number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Contact = models.Contact || model('Contact', contactSchema);
export default Contact;