import mongoose, { Schema } from 'mongoose'

const CollectionSchema = new Schema(
  {
    id: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
    },
    owner: String,
    seller: String,
    isFrozen: Boolean,
    isDestroyed: Boolean,
    loan: {
      type: Schema.Types.ObjectId,
      ref: 'Loan',
    },
    type: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const Collection = mongoose.model('Collection', CollectionSchema)

export { Collection }
