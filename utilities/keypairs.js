import { Utils, ConfigService } from '@kiltprotocol/sdk-js';
import {initKilt} from './initKilt.js'
import { configuration } from './configuration.js';

export const keypairsPromise = (async () => {
  // This init now has crypto await ready inside it. 
  await initKilt()
  // The Config Service now is a way to fetch the api without having to reinitatilise the chain every time. Since we cache it and fetch with the config service
  const api = ConfigService.get('api')

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
