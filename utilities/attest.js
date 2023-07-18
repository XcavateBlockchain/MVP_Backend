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
  console.log('credential :: ', credential)

  const attestation = Attestation.fromCredentialAndDid(
    credential,
    configuration.did,
  )
  console.log('attestation :: ', attestation)

  const { claimHash, cTypeHash } = attestation

  const { payer } = await keypairsPromise
  console.log('payer :: ', payer)

  const tx = api.tx.attestation.add(claimHash, cTypeHash, null)
  console.log('tx :: ', tx)
  const authorized = await Did.authorizeTx(
    configuration.did,
    tx,
    sign,
    payer.address,
  )
  console.log('authorized :: ', authorized)

  await Blockchain.signAndSubmitTx(authorized, payer)
  console.log('attestation done')

  return attestation
}
