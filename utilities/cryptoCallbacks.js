import { naclOpen, naclSeal } from '@polkadot/util-crypto';

import { keypairsPromise } from './keypairs.js';
import { didDocumentPromise } from './didDocument.js';

export async function sign({ data, keyRelationship }) {
  if (keyRelationship === 'capabilityDelegation') {
    throw new Error('Delegation not supported');
  }
  const { authentication, assertionMethod } = await keypairsPromise;
  const { did, authenticationKey, assertionMethodKey } =
    await didDocumentPromise;

  const [keypair, publicKey] =
    keyRelationship === 'authentication'
      ? [authentication, authenticationKey]
      : [assertionMethod, assertionMethodKey];

  const keyUri = `${did}${publicKey.id}`;

  return {
    signature: keypair.sign(data, { withType: false }),
    keyType: keypair.type,
    keyUri,
  };
}

export async function signWithAssertionMethod({ data }) {
  const { assertionMethod } = await keypairsPromise;

  const { did, assertionMethodKey } = await didDocumentPromise;
  const keyUri = `${did}${assertionMethodKey.id}`;

  return {
    signature: assertionMethod.sign(data, { withType: false }),
    keyType: assertionMethod.type,
    keyUri,
  };
}

export async function encrypt({
  data,
  peerPublicKey,
}) {
  const { keyAgreement } = await keypairsPromise;

  const { did, keyAgreementKey } = await didDocumentPromise;
  const keyUri = `${did}${keyAgreementKey.id}`;

  const { sealed, nonce } = naclSeal(
    data,
    keyAgreement.secretKey,
    peerPublicKey,
  );

  return {
    data: sealed,
    nonce,
    keyUri,
  };
}

export async function decrypt({
  data,
  nonce,
  peerPublicKey,
}) {
  const { keyAgreement } = await keypairsPromise;

  const decrypted = naclOpen(
    data,
    nonce,
    peerPublicKey,
    keyAgreement.secretKey,
  );
  if (!decrypted) {
    throw new Error('Failed to decrypt with given key');
  }

  return {
    data: decrypted,
  };
}
