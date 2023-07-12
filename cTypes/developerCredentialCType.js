export const developerCredentialCtype = {
  $schema: 'http://kilt-protocol.org/draft-01/ctype#',
  title: 'Developer Credential',
  additionalProperties: false,
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
  $id: 'kilt:ctype:0x78c6a7f74bdb7b7f8ed5b228dcfd97d047808a8d42faa83d7d7fe9ca2e108d2a',
}
