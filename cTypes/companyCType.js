export const companyCtype = {
  $schema: 'http://kilt-protocol.org/draft-01/ctype#',
  title: 'Company',
  properties: {
    address: { type: "string" },
    associationMembershipNumber: { type: "string" },
    associationWebsite: { type: "string" },
    companyEmail: { type: "string" },
    companyName: { type: "string" },
    companyRegNumber: { type: "number" },
    companyTelephone: { type: "string" },
    idDoc1: { type: "string" },
    idDoc2: { type: "string" }
  },
  type: 'object',
  $id: 'kilt:ctype:0x8b92874e649e1c7e634e44f542f967a34267ab16026e6b836c54e0f69b1b4015',
}
