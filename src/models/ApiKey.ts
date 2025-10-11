import { Schema, model, models } from 'mongoose';

const apiKeySchema = new Schema(
  {
    api_key: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ApiKey = models.ApiKey || model('ApiKey', apiKeySchema);
export default ApiKey;