import {
  Attestation,
  Blockchain,
  ConfigService,
  Did,
} from '@kiltprotocol/sdk-js';
import { configuration } from './configuration.js';
import { sign } from './cryptoCallbacks.js';
import { keypairsPromise } from './keypairs.js';

export async function revoke(credential) {
  const api = ConfigService.get('api');
  const { rootHash } = credential;

  const tx = api.tx.attestation.revoke(rootHash, null);

  const { payer } = await keypairsPromise;

  const authorized = await Did.authorizeTx(
    configuration.did,
    tx,
    sign,
    payer.address,
  );

  await Blockchain.signAndSubmitTx(authorized, payer);

  const attestation = await api.query.attestation.attestations(rootHash);

  return Attestation.fromChain(attestation, rootHash);
}
