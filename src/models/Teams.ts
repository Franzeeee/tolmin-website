import { Schema, model, models } from 'mongoose'

const TeamMemberSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  number: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
    enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Coach', 'Staff'],
  },
}, {
  timestamps: true,
})

export const TeamMember = models.TeamMember || model('TeamMember', TeamMemberSchema)
