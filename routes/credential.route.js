import express from 'express'
import {
  attestCredential,
  getCredentialById,
  getCredentialsAttested,
  getCredentialsToAttest,
  revokeCredential,
} from '../controllers/credential.controller.js'

const router = express.Router()

router.get('/:id/credential', getCredentialById)
router.get('/to-attest', getCredentialsToAttest)
router.get('/attested', getCredentialsAttested)
router.post('/:id/attest', attestCredential)
router.post('/:id/revoke', revokeCredential)

export default router
