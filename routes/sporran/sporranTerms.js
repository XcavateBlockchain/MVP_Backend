import { Claim, Quote } from '@kiltprotocol/sdk-js'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { configuration } from '../../utilities/configuration.js'
import { sign } from '../../utilities/cryptoCallbacks.js'
import { encryptMessageBody } from '../../utilities/encryptMessage.js'
import { logger } from '../../utilities/logger.js'
import { sessionMiddleware } from '../../utilities/sessionStorage.js'
import {
  kiltCost,
  supportedCTypes,
} from '../../utilities/supportedCTypes.js'

const TTL = 5 * 60 * 60 * 1000
const TERMS = 'https://example.com/terms-and-conditions'

async function handler(request, response){
  try {
    console.log('Submit terms started')
    logger.debug('Submit terms started')
    const { session } = request
    const { encryptionKeyUri } = session

    const { type, claimContents } = request.body 
    console.log('type :: ', type)
    console.log('claimContents :: ', claimContents)
    console.log('updated contents :: ', {
      fullName: claimContents?.fullName || '',
      phoneNumber: claimContents?.phoneNumber || '',
      email: claimContents?.email || '',
      profession: claimContents?.profession || '',
      address: claimContents?.address || '',
      idDoc1: claimContents?.idDoc1 || '',
      idDoc2: claimContents?.idDoc2 || '',
    })
    console.log('supportedCTypes[type] :: ', supportedCTypes[type])
    console.log('did :: ', session.did)

    const claim = Claim.fromCTypeAndClaimContents(
      supportedCTypes[type],
      {
        fullName: claimContents?.fullName || '',
        phoneNumber: claimContents?.phoneNumber || '',
        email: claimContents?.email || '',
        profession: claimContents?.profession || '',
        address: claimContents?.address || '',
        idDoc1: claimContents?.idDoc1 || '',
        idDoc2: claimContents?.idDoc2 || '',
      },
      session.did,
    )
    console.log('claim :: ', claim)
    logger.debug('Generated claim')

    const quote = {
      attesterDid: configuration.did,
      cTypeHash: claim.cTypeHash,
      cost: { tax: { VAT: 0 }, net: kiltCost[type], gross: kiltCost[type] },
      currency: 'KILT',
      timeframe: new Date(Date.now() + TTL).toISOString(),
      termsAndConditions: TERMS,
    }

    const signedQuote = await Quote.createAttesterSignedQuote(quote, sign)
    logger.debug('Signed quote')

    const output = await encryptMessageBody(encryptionKeyUri, {
      content: {
        claim,
        legitimations: [],
        quote: signedQuote,
        cTypes: [supportedCTypes[type]],
      },
      type: 'submit-terms',
    })
    logger.debug('Submit terms complete')
    response.send(output)
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
}
export const router = Router()

router.post('/', sessionMiddleware, handler)

export default router
