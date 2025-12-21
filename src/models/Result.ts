import { Schema, model, models } from 'mongoose';

const resultSchema = new Schema(
  {
    season_start: {
      type: String,
      required: true,
    },
    season_end: {
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
