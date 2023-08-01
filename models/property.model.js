import mongoose, { Schema } from 'mongoose'

const PropertySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: String,
    number: String,
    address: {
      street: String,
      city: String,
      zipcode: String,
    },
    description: String,
    features: Object,
    floorPlanImage: String,
    assignmentImage: String,
    images: [
      {
        type: String,
      },
    ],
    type: String,
    price: String,
    rentalIncome: String,
    developmentNumber: String,
    planningPermissionNumber: String,
    localAuthority: String,
    titleDeadNumber: String,
    googleMapLink: String,
    isVerified: Boolean,
    isRejected: Boolean,
    isLocked: Boolean,
    isListed: Boolean,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const Property = mongoose.model('Property', PropertySchema)

export { Property }