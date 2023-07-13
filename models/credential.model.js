import mongoose, { Schema } from 'mongoose'

const CredentialSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    cTypeTitle: String,
    cTypeHash: String,
    contents: Object,
    owner: String,
    rootHash: String,
    attested: Boolean,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const CredentialModel = mongoose.model('credential', CredentialSchema)

export { CredentialModel }
