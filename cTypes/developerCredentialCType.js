export const developerCredentialCtype = {
  $schema: 'http://kilt-protocol.org/draft-01/ctype#',
  title: 'Developer Credential',
  properties: {
    fullName: { type: "string" },
    phoneNumber: { type: "string" },
    email: { type: "string" },
    profession: { type: "string" },
    address: { type: "string" },
    idDoc1: { type: "string" },
    idDoc2: { type: "string" }
  },
  type: 'object',
  $id: 'kilt:ctype:0x4c5ff36428a9cb3d2c20d6cd8419842f08f412b2bdfbbd33ddc2df8120533bcc',
}
