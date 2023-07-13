import mongoose, { Schema } from 'mongoose'

const PropertySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const Property = mongoose.model('property', PropertySchema)

export { Property }
