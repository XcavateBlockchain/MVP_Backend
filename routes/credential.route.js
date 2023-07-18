import express from 'express'
import {
  attestCredential,
  getCredentialById,
  getCredentialsAttested,
  getCredentialsToAttest,
} from '../controllers/credential.controller.js'

const router = express.Router()

router.get('/:id/credential', getCredentialById)
router.get('/to-attest', getCredentialsToAttest)
router.get('/attested', getCredentialsAttested)
router.post('/:id/attest', attestCredential)

export default router
