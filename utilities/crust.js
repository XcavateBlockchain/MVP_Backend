import { ApiPromise, WsProvider } from '@polkadot/api'
import { typesBundleForPolkadot } from '@crustio/type-definitions'
import { Keyring } from '@polkadot/keyring'

const crustChainEndpoint = process.env.CRUST_NETWORK_ENDPOINT // More endpoints: https://github.com/crustio/crust-apps/blob/master/packages/apps-config/src/endpoints/production.ts#L9
const crustSeeds = process.env.CRUST_NETWORK_ADMIN_MNEMONIC // Create account(seeds): https://wiki.crust.network/docs/en/crustAccount
const api = new ApiPromise({
  provider: new WsProvider(crustChainEndpoint),
  typesBundle: typesBundleForPolkadot,
})

export const addFile = async (ipfs, fileContent) => {
  // 1. Add file to ipfs
  const cid = await ipfs.add(fileContent)

  // 2. Get file status from ipfs
  const fileStat = await ipfs.files.stat("/ipfs/" + cid.path)

  return {
    cid: cid.path,
    size: fileStat.cumulativeSize
  }
}

export const placeStorageOrder = async (fileCid, fileSize) => {
  // 1. Construct place-storage-order tx
  const tips = 0
  const memo = ''
  // Set listeners for disconnection and reconnection event
  api.on('connected', () => {
    // `ready` event is not emitted upon reconnection and is checked explicitly here
    api.isReady.then(async api => {
      const tx = api.tx.market.placeStorageOrder(fileCid, fileSize, tips, memo)

      // 2. Load seeds(account)
      const kr = new Keyring({ type: 'sr25519' })
      const krp = kr.addFromUri(crustSeeds)

      // 3. Send transaction
      await api.isReadyOrError
      return new Promise((resolve, reject) => {
        tx.signAndSend(krp, ({ events = [], status }) => {
          console.log(`💸  Tx status: ${status.type}, nonce: ${tx.nonce}`)

          if (status.isInBlock) {
            events.forEach(({ event: { method, section } }) => {
              if (method === 'ExtrinsicSuccess') {
                console.log(`✅  Place storage order success!`)
                resolve(true)
              }
            })
          } else {
            // Pass it
          }
        }).catch(e => {
          reject(e)
        })
      })
    })
  })
}

export const addPrepaid = async (fileCid, amount) => {
  // 1. Construct add-prepaid tx
  const tx = api.tx.market.addPrepaid(fileCid, amount)

  // 2. Load seeds(account)
  const kr = new Keyring({ type: 'sr25519' })
  const krp = kr.addFromUri(crustSeeds)

  // 3. Send transaction
  await api.isReadyOrError
  return new Promise((resolve, reject) => {
    tx.signAndSend(krp, ({ events = [], status }) => {
      console.log(`💸  Tx status: ${status.type}, nonce: ${tx.nonce}`)

      if (status.isInBlock) {
        events.forEach(({ event: { method, section } }) => {
          if (method === 'ExtrinsicSuccess') {
            console.log(`✅  Add prepaid success!`)
            resolve(true)
          }
        })
      } else {
        // Pass it
      }
    }).catch(e => {
      reject(e)
    })
  })
}

export const getOrderState = async (cid) => {
  await api.isReadyOrError
  return await api.query.market.filesV2(cid)
}
