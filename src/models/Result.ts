import { Schema, model, models } from 'mongoose';

const resultSchema = new Schema(
  {
    season: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Result = models.Result || model('Result', resultSchema);
export default Result;
