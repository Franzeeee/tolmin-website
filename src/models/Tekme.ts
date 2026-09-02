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
    round: {
      type: String,
      required: false,
    },
    datetime: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      enum: ['HOME', 'AWAY'],
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    opponent: {
      type: String,
      required: true,
    },
    opponentLogo: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'FINISHED'],
      required: true,
      default: 'SCHEDULED',
    },
    tolminScore: {
      type: Number,
      required: false,
      default: null,
    },
    opponentScore: {
      type: Number,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

const Tekme = models.Tekme || model('Tekme', tekmeSchema);
export default Tekme;
