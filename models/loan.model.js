import mongoose, { Schema } from 'mongoose'

const LoanSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    collect: {
      type: Schema.Types.ObjectId,
      ref: 'Collection',
    },
    // company: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Company',
    // },
    developmentCompanyName: String,
    developmentExperience: Number,
    landOwnerName: String,
    projectName: String,
    projectLocation: String,
    planningPermissionCode: String,
    landTitleDeedNumber: String,
    existingLandValue: String,
    totalGDV: String,
    developmentPlan: String,
    elevationCGIS: String,
    estimatedPricingSchedule: String,
    description: String,
    amount: String,
    termRequired: String,
    paymentAccount: String,
    isApproved: {
      type: Boolean,
      default: false,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
    isMinted: {
      type: Boolean,
      default: false,
    },
    isCanceled: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const Loan = mongoose.model('Loan', LoanSchema)

export { Loan }
