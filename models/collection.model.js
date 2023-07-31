import mongoose, { Schema } from 'mongoose'

const CollectionSchema = new Schema(
  {
    id: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    owner: String,
    isFrozen: Boolean,
    isDestroyed: Boolean,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const Collection = mongoose.model('Collection', CollectionSchema)

export { Collection }
