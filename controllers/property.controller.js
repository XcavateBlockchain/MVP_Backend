import { FILE_TYPES } from '../utilities/constants.js'
import { uploadFile } from '../utilities/aws_s3.js'
import { StatusCodes } from 'http-status-codes'
import util from 'util'
import fs from 'fs'
import { Property } from '../models/property.model.js'

import path from 'path'
import { create as ipfsCreate } from 'ipfs-http-client'
import { addFile, addPrepaid, getOrderState, placeStorageOrder } from '../utilities/crust.js'

const unlinkFile = util.promisify(fs.unlink)

export const create = async (req, res) => {
  try {
    const { body } = req
    const { _id } = req.user

    // upload image to S3
    let uploadFilePromises = []

    const floorPlanImage = req.files.floorPlanImage
    const assignmentImage = req.files.assignmentImage
    const images = req.files.images

    const floorPlanImagekey = `${floorPlanImage[0].filename}.${FILE_TYPES[floorPlanImage[0].mimetype]}`
    uploadFilePromises.push(uploadFile(floorPlanImage[0], floorPlanImagekey))

    const assignmentImageKey = `${assignmentImage[0].filename}.${FILE_TYPES[assignmentImage[0].mimetype]}`
    uploadFilePromises.push(uploadFile(assignmentImage[0], assignmentImageKey))

    if (images.length > 0) {
      images.map(image => {
        const key = `${image.filename}.${FILE_TYPES[image.mimetype]}`
        uploadFilePromises.push(uploadFile(image, key))
      })
    }

    Promise.all(uploadFilePromises)
      .then(async (values) => {

        await unlinkFile(floorPlanImage[0].path)
        await unlinkFile(assignmentImage[0].path)

        if (images.length > 0) {
          images.map(async (image) => {
            await unlinkFile(image.path)
          })
        }

        let _image = {
          floorPlanImage: floorPlanImage[0] ? `${process.env.CDN_URL}/${values[0]}` : '',
          assignmentImage: assignmentImage[0] ? `${process.env.CDN_URL}/${values[1]}` : '',
        }

        let _images = []

        if (values.length > 2) {
          values.map((value, index) => {
            if (index > 1) {
              _images = [
                ..._images,
               `${process.env.CDN_URL}/${value}`,
              ]
            }
          })
        }

        const address = JSON.parse(body?.address)
        const features = JSON.parse(body?.features)

        const property = new Property({
          ...body,
          ..._image,
          user: _id,
          images: _images,
          features,
          address: {
            street: address?.street || '',
            city: address?.city || '',
            zipcode: address?.zipcode || '',
          },
        })
        const doc = await property.save()

        return res.status(StatusCodes.CREATED).send({
          error: null,
          data: doc,
        })
      })
      .catch((err) => {
        console.log('uploading error :: ', err)
        return res.status(StatusCodes.BAD_REQUEST).send({
          error: err.toString(),
          data: null,
        })
      })
  } catch (err) {
    console.log('creating error :: ', err)
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: err.toString(),
      data: null,
    })
  }
}

export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      isVerified: true,
      isListed: true,
      isRejected: false,
      isLocked: false,
    })
      .populate('user')
      .populate('collect')

    return res.status(StatusCodes.OK).send({
      error: null,
      data: properties,
    })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: err.toString(),
      data: null,
    })
  }
}

export const getAllPropertiesByUser = async (req, res) => {
  try {
    const { _id } = req.user

    const properties = await Property.find({
      user: _id,
    })
      .populate('user')
      .populate('collect')

    return res.status(StatusCodes.OK).send({
      error: null,
      data: properties,
    })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: err.toString(),
      data: null,
    })
  }
}

export const getPropertyById = async (req, res) => {
  try {
    const { propertyId } = req.params
    
    const property = await Property.findById(propertyId)
      .populate('user')
      .populate('collect')
    
    return res.status(StatusCodes.OK).send({
      error: null,
      data: property,
    })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: error.toString(),
      data: null,
    })
  }
}

export const uploadFilesToCrust = async (req, res) => {
  try {
    const ipfsW3GW = process.env.CRUST_IPFS_W3GW // More web3 authed gateways: https://github.com/crustio/ipfsscan/blob/main/lib/constans.ts#L29

    // I. Upload file to IPFS
    // 1. Read file
    const filePath = 'sampleFile.txt'
    const fileContent = await fs.readFileSync(path.resolve(__dirname, filePath))

    // 2. [Gateway] Create IPFS instance
    // Now support: ethereum-series, polkadot-series, solana, elrond, flow, near, ...
    // Let's take ethereum as example
    // const pair = ethers.Wallet.createRandom()
    // const sig = await pair.signMessage(pair.address)
    // const authHeaderRaw = `eth-${pair.address}:${sig}`
    // const authHeader = Buffer.from(authHeaderRaw).toString('base64')
    const ipfsRemote = ipfsCreate({
      url: `${ipfsW3GW}/api/v0`,
      // headers: {
      //   authorization: `Basic ${authHeader}`
      // }
    })

    // 3. Add IPFS
    const rst = await addFile(ipfsRemote, fileContent) // Or use IPFS local
    console.log(rst)

    // II. Place storage order
    await placeStorageOrder(rst.cid, rst.size)
    // III. [OPTIONAL] Add prepaid
    // Learn what's prepard for: https://wiki.crust.network/docs/en/DSM#3-file-order-assurance-settlement-and-discount
    const addedAmount = 100 // in pCRU, 1 pCRU = 10^-12 CRU
    await addPrepaid(rst.cid, addedAmount)

    // IV. Query storage status
    // Query forever here ...
    while (true) {
      const orderStatus = (await getOrderState(rst.cid)).toJSON()
      console.log('Replica count: ', orderStatus['reported_replica_count']) // Print the replica count
      await new Promise(f => setTimeout(f, 1500)) // Just wait 1.5s for next chain-query
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: error.toString(),
      data: null,
    })
  }
}
