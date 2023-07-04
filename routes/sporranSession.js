import express from 'express'
import { StatusCodes } from 'http-status-codes';

import { Did, Utils } from '@kiltprotocol/sdk-js';
import { randomAsHex } from '@polkadot/util-crypto';

import { didDocumentPromise } from '../utilities/didDocument.js';
import { decrypt } from '../utilities/cryptoCallbacks.js';
import {
  basicSessionMiddleware,
  setSession,
} from '../utilities/sessionStorage.js';
import { logger } from '../utilities/logger.js';

const router = express.Router()

async function handler(request, response) {
  try {
    logger.debug('Session confirmation started');

    const payload = request.body;
    const { encryptionKeyUri, encryptedChallenge, nonce } = payload;
    const { session } = request;
    console.log(request);

    const encryptionKey = await Did.resolveKey(encryptionKeyUri);

    logger.debug('Session confirmation resolved DID encryption key');

    const { keyAgreementKey, did } = await didDocumentPromise;

    const { data } = await decrypt({
      data: Utils.Crypto.coToUInt8(encryptedChallenge),
      nonce: Utils.Crypto.coToUInt8(nonce),
      keyUri: `${did}${keyAgreementKey.id}`,
      peerPublicKey: encryptionKey.publicKey,
    });
    logger.debug('Session confirmation decrypted challenge');

    const decryptedChallenge = Utils.Crypto.u8aToHex(data);
    console.log(session);
    const originalChallenge = session.didChallenge;

    if (decryptedChallenge !== originalChallenge) {
      response
        .status(StatusCodes.FORBIDDEN)
        .send('Challenge signature mismatch');
      return;
    }

    setSession({
      ...session,
      did: encryptionKey.controller,
      encryptionKeyUri,
      didConfirmed: true,
    });

    logger.debug('Challenge confirmation matches');
    response.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    console.error(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
}

function startSession() {
  const sessionId = randomAsHex(24);
  const challenge = randomAsHex(24);

  setSession({ sessionId, didChallenge: challenge });

  return {
    challenge,
    sessionId,
  };
}

router.get('/', async (request, response) => {
  const { did, keyAgreementKey } = await didDocumentPromise;
  const dAppEncryptionKeyUri = `${did}${keyAgreementKey.id}`;
  response.send({
    dAppEncryptionKeyUri,
    ...startSession(),
  });
});

router.post('/', basicSessionMiddleware, handler);

export default router
