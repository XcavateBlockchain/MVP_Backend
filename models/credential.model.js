import mongoose, { Schema } from 'mongoose'

const CredentialSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    cTypeTitle: String,
    cTypeHash: String,
    contents: Object,
    owner: String,
    rootHash: String,
    attested: Boolean,
    revoked: Boolean,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const CredentialModel = mongoose.model('Credential', CredentialSchema)

export { CredentialModel }
