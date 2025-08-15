import { Schema, model, models } from 'mongoose';

const oldTeamSchema = new Schema(
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

const OldTeam = models.OldTeam || model('OldTeam', oldTeamSchema);
export default OldTeam;
