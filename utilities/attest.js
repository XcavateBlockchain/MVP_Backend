import {
  Attestation,
  Blockchain,
  ConfigService,
  Did
} from '@kiltprotocol/sdk-js'
import { configuration } from './configuration.js'
import { sign } from './cryptoCallbacks.js'
import { keypairsPromise } from './keypairs.js'

export async function attest(credential){
  const api = ConfigService.get('api')

  const attestation = Attestation.fromCredentialAndDid(
    credential,
    configuration.did,
  )

  const { claimHash, cTypeHash } = attestation

  const { payer } = await keypairsPromise

  const tx = api.tx.attestation.add(claimHash, cTypeHash, null)
  const authorized = await Did.authorizeTx(
    configuration.did,
    tx,
    sign,
    payer.address,
  )

  await Blockchain.signAndSubmitTx(authorized, payer)
  console.log('attestation done')

  return attestation
}
