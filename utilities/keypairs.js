import { Utils } from '@kiltprotocol/sdk-js';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { configuration } from './configuration.js';

export const keypairsPromise = (async () => {
  await cryptoWaitReady();

  const payer = Utils.Crypto.makeKeypairFromUri(configuration.payerMnemonic, 'sr25519');

  const authentication = Utils.Crypto.makeKeypairFromUri(
    configuration.authenticationMnemonic,
    'sr25519',
  );

  const assertionMethod = Utils.Crypto.makeKeypairFromUri(
    configuration.assertionMethodMnemonic,
    'sr25519',
  );

  const keyAgreement = Utils.Crypto.makeEncryptionKeypairFromSeed(
    Utils.Crypto.mnemonicToMiniSecret(configuration.keyAgreementMnemonic),
  );

  return {
    payer,
    authentication,
    assertionMethod,
    keyAgreement,
  };
})();
