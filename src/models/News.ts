import { Schema, model, models } from 'mongoose';

const newsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    publishedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const News = models.News || model('News', newsSchema);
export default News;
