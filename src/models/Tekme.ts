import { Schema, model, models } from 'mongoose';

const tekmeSchema = new Schema(
  {
    league: {
      type: String,
      required: true,
    },
    season: {
      type: String,
      required: true,
    },
    datetime: {
      type: Date,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    enemy: {
      type: String,
      required: true,
    },
    enemyLogo: {
      type: String,
      required: true,
    },
    score: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Tekme = models.Tekme || model('Tekme', tekmeSchema);
export default Tekme;
