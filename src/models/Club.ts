import { Schema, model, models } from 'mongoose';

const clubSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Club = models.Club || model('Club', clubSchema);
export default Club;
