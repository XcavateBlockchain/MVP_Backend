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
  $id: 'kilt:ctype:0xc961223d14beee8ee1b626e5a657167c0bc8e08cf95b26eb31837d3740f9752d',
}
