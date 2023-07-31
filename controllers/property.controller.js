import { FILE_TYPES } from '../utils/constants.js'
import { uploadFile } from '../utils/aws_s3.js'
import { StatusCodes } from 'http-status-codes'
import util from 'util'
import fs from 'fs'
import { Property } from '../models/property.model.js'

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
    const { _id } = req.user

    const properties = await Property.find({
      user: _id,
    })
      .populate('user')

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
