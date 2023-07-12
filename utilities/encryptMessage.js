import { Did, Message } from '@kiltprotocol/sdk-js';

import { encrypt } from './cryptoCallbacks.js';
import { configuration } from './configuration.js';

export async function encryptMessageBody(
  encryptionKeyUri,
  messageBody,
) {
  const { did } = Did.parse(encryptionKeyUri);

  const message = Message.fromBody(messageBody, configuration.did, did);
  return Message.encrypt(message, encrypt, encryptionKeyUri);
}
