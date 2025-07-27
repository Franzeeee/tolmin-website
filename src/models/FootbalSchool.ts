import { Schema, model, models } from 'mongoose';

const footballSchoolSchema = new Schema(
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

const FootballSchool = models.FootballSchool || model('FootballSchool', footballSchoolSchema);
export default FootballSchool;
