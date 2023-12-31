import express from 'express'
import { Credential, CType, Message, Quote } from '@kiltprotocol/sdk-js'
import { StatusCodes } from 'http-status-codes'
import { decrypt } from '../../utilities/cryptoCallbacks.js'
import { logger } from '../../utilities/logger.js'
import { auth } from '../../middleware/auth.js'
import {
  sessionMiddleware,
  setSession,
} from '../../utilities/sessionStorage.js'
import { supportedCTypes } from '../../utilities/supportedCTypes.js'
import { CredentialModel } from '../../models/credential.model.js'
import { User } from '../../models/user.model.js'

const router = express.Router()

async function handler(request, response){
  try {
    logger.debug('Handling attestation request')
    const { _id } = request.user
    const { body } = request
    const { type: credentialType } = body
    delete body?.type

    const message = await Message.decrypt(body, decrypt)
    const messageBody = message.body
    logger.debug('Request attestation message decrypted')

    Message.verifyMessageBody(messageBody)
    const { type } = messageBody

    if (type === 'reject' || type === 'reject-terms') {
      response.status(StatusCodes.CONFLICT).send('Message contains rejection')
      return
    }

    if (type !== 'request-attestation') {
      throw new Error('Unexpected message type')
    }

    const { quote, credential } = messageBody.content

    if (quote) {
      await Quote.verifyQuoteAgreement(quote)
      logger.debug('Quote agreement verified')
    }

    Credential.verifyDataStructure(credential)
    logger.debug('Credential data structure verified')

    const cTypes = Object.values(supportedCTypes)
    const cTypeId = CType.hashToId(credential.claim.cTypeHash)
    if (!cTypes.find(({ $id }) => $id === cTypeId)) {
      response.status(StatusCodes.FORBIDDEN).send('Unsupported CType')
    }
    logger.debug('CType supported')

    const { session } = request
    setSession({ ...session, credential })

    logger.debug('Request attestation complete')

    // storing credential to the proper credential owner
    const cDoc = new CredentialModel({
      user: _id,
      cTypeTitle: credentialType,
      cTypeHash: credential?.claim?.cTypeHash || '',
      contents: credential || {},
      owner: credential?.claim?.owner || '',
      rootHash: credential?.rootHash || '',
      attested: false,
      revoked: false,
    })
    const doc = await cDoc.save()

    await User.findByIdAndUpdate(
      _id,
      {
        $push: {
          credentials: doc?._id,
        },
      },
      {
        new: true,
      },
    )

    const user = await User.findById(_id)
      .populate('companies')
      .populate('credentials')

    response.status(StatusCodes.CREATED).send({
      error: null,
      data: user,
    })
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
}

router.post('/', auth, sessionMiddleware, handler)

export default router
