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
    planningPermissionCode: String,
    planningAuthority: String,
    landTitleDeedCode: String,
    companyUrl: String,
    companyName: String,
    companyPhoneNumber: String,
    companyDirector: String,
    address: String,
    landValue: String,
    totalGDV: String,
    duration: String,
    amount: String,
    currency: String,
    repaymentMethod: String,
    developmentPlan: String,
    elevationCGIS: String,
    pricingSchedule: String,
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
