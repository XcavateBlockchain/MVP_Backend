import { User } from '../models/user.model.js'
import { FILE_TYPES } from '../utils/constants.js'
import { uploadFile } from '../utils/aws_s3.js'
import { StatusCodes } from 'http-status-codes'
import util from 'util'
import fs from 'fs'

const unlinkFile = util.promisify(fs.unlink)

export const create = async (req, res) => {
  try {
    const { body } = req
    console.log('req :: ', req.files)

    // upload image to S3
    let uploadFilePromises = []

    const idDoc1 = req.files.idDoc1
    const idDoc2 = req.files.idDoc2

    const idDoc1key = `${idDoc1[0].filename}.${FILE_TYPES[idDoc1[0].mimetype]}`
    uploadFilePromises.push(uploadFile(idDoc1[0], idDoc1key))

    if (idDoc2 && idDoc2[0]) {
      const idDoc2Key = `${idDoc2[0].filename}.${FILE_TYPES[idDoc2[0].mimetype]}`
      uploadFilePromises.push(uploadFile(idDoc2[0], idDoc2Key))
    }

    Promise.all(uploadFilePromises)
      .then(async (values) => {
        const images = values

        await unlinkFile(idDoc1[0].path)

        let _image = {
          idDoc1: images[0] ? `${process.env.CDN_URL}/${images[0]}` : '',
          idDoc2: '',
        }

        if (idDoc2 && idDoc2[0]) {
          await unlinkFile(idDoc2[0].path)

          _image = {
            ..._image,
            idDoc2: images[1] ? `${process.env.CDN_URL}/${images[1]}` : '',
          }
        }

        const user = new User({
          ...body,
          ..._image,
        })
        const doc = await user.save()

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
