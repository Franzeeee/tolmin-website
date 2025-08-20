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
    coaches: [
      {
        name: {
          type: String,
          required: false,
        },
        phone: {
          type: String,
          required: false,
        },
        email: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const FootballSchool = models.FootballSchool || model('FootballSchool', footballSchoolSchema);
export default FootballSchool;
