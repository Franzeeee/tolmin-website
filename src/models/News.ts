import mongoose, { Document, Model, models, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  content: string;
  publishedAt: Date;
  author?: string;
}

const NewsSchema = new Schema<INews>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  author: { type: String },
});

const News: Model<INews> = models.News || mongoose.model<INews>('News', NewsSchema);

export default News;
