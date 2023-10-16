import mongoose, { Schema } from 'mongoose'

const CompanySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: String,
    registrationNumber: String,
    email: String,
    phoneNumber: String,
    address: String,
    associationWebsite: String,
    associationMembershipNumber: String,
    idDoc1: String,
    idDoc2: String,
    attested: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const Company = mongoose.model('Company', CompanySchema)

export { Company }
