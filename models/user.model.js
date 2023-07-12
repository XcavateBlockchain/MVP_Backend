import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema(
  {
    fullName: String,
    phoneNumber: String,
    email: String,
    profession: String,
    address: String,
    idDoc1: String,
    idDoc2: String,
    did: String,
    role: String,
    paid: Boolean,
    attested: Boolean,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const User = mongoose.model('user', UserSchema)

export { User }
