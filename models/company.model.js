import mongoose, { Schema } from 'mongoose'

const CompanySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    credential: {
      type: Schema.Types.ObjectId,
      ref: 'Credential',
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
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const Company = mongoose.model('Company', CompanySchema)

export { Company }
