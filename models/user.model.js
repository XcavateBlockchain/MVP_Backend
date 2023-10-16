import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'

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
    profileImage: String,
    bannerImage: String,
    isLocked: Boolean,
    isVerified: Boolean,
    isRejected: Boolean,
    companies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Company',
      }
    ],
    credentials: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Credential',
      }
    ],
    tokens: [      
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

UserSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign(
    {
      _id: user._id.toString(),
    },
    process.env.JWT_SECRET,
  )

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

const User = mongoose.model('User', UserSchema)

export { User }
