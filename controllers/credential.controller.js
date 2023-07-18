import { StatusCodes } from 'http-status-codes'
import { CredentialModel } from '../models/credential.model.js'
import { attest } from '../utilities/attest.js'
import { logger } from '../utilities/logger.js'

export const getCredentialsToAttest = async (req, res) => {
  try {
    const credentials = await CredentialModel.find({
      attested: false,
      revoked: false,
    })
      .populate('userId')

    return res.status(StatusCodes.OK).send({
      error: null,
      data: credentials,
    })
  } catch (err) {
    return res.send({
      error: err.toString(),
      data: null,
    })
  }
}

export const getCredentialsAttested = async (req, res) => {
  try {
    const credentials = await CredentialModel.find({
      attested: true,
      revoked: false,
    })
      .populate('userId')

    return res.status(StatusCodes.OK).send({
      error: null,
      data: credentials,
    })
  } catch (err) {
    return res.send({
      error: err.toString(),
      data: null,
    })
  }
}

export const getCredentialById = async (req, res) => {
  try {
    const { id } = req.params

    if (id) {
      const credential = await CredentialModel.findById(id)
      if (credential) {
        return res.status(StatusCodes.OK).send({
          error: null,
          data: credential,
        })
      } else {
        return res.status(StatusCodes.NO_CONTENT).send({
          error: 'Not found',
          data: null,
        })
      }
    }
  } catch (error) {
    return res.send({
      error: error.toString(),
      data: null,
    })
  }
}

export const attestCredential = async (req, res) => {
  try {
    const { id } = req.params
    if (id) {
      const credential = await CredentialModel.findById(id)

      logger.debug(`Getting credential`)
      if (credential?.contents) {
        logger.debug('Attesting credential')
        const contents = credential.contents
        const attestation = await attest(contents)

        logger.debug('Credential attested, updating database')
        if (attestation?.claimHash) {
          await CredentialModel.findByIdAndUpdate(
            id,
            {
              $set: {
                attested: true,
              },
            },
            {
              new: true,
            },
          )

          const uCredential = await CredentialModel.findById(id)

          return res.status(StatusCodes.OK).send({
            error: null,
            data: uCredential,
          })
        } else {
          return res.status(StatusCodes.NO_CONTENT).send({
            error: 'Not acceptable to attest',
            data: null,
          })
        }
      } else {
        return res.status(StatusCodes.NO_CONTENT).send({
          error: 'Not found a credential',
          data: null,
        })
      }
    } else {
      return res.status(StatusCodes.NO_CONTENT).send({
        error: 'Missed credential id',
        data: null,
      })
    }
  } catch (err) {
    console.log('attestation error :: ', err)
    return res.send({
      error: err.toString(),
      data: null,
    })
  }
}
