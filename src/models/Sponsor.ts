import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['main', 'partner', 'support'], 
    required: true 
  },
  logoUrl: { type: String },
  website: { type: String },
  createdAt: { type: Date, default: Date.now }
})

const Sponsor = mongoose.models.Sponsor || mongoose.model("Sponsor", sponsorSchema)


export default Sponsor;