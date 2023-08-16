import { User } from '../models/user.model.js'
import { FILE_TYPES } from '../utilities/constants.js'
import { uploadFile } from '../utilities/aws_s3.js'
import { StatusCodes } from 'http-status-codes'
import util from 'util'
import fs from 'fs'

const unlinkFile = util.promisify(fs.unlink)

export const create = async (req, res) => {
  try {
    const { body } = req

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
        const token = await doc.generateAuthToken()

        return res.status(StatusCodes.CREATED).send({
          error: null,
          data: {
            user: doc,
            token: token,
          },
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

export const connectDid = async (req, res) => {
  try {
    const { did } = req.body

    const existingUser = await User.findOne({
      did,
    })

    // If user doesn't exist, create a new one
    if (!existingUser) {
      return res.status(StatusCodes.NO_CONTENT).send({
        error: `No credential linked with this did: ${did}`,
        data: null
      })
    } else {
      if (existingUser?.isLocked) {
        return res.status(StatusCodes.LOCKED).send({
          error: 'Your account was locked by some reason',
          data: null,
        })
      } else {
        const token = await existingUser.generateAuthToken()

        return res.status(StatusCodes.ACCEPTED).send({
          error: null,
          data: {
            user: existingUser,
            token,
          }
        })
      }
    }
  } catch (err) {
    const errorMessage = typeof err === 'object' && err !== null
      ? err.toString()
      : 'Unexpected Error'

    return res.status(StatusCodes.BAD_REQUEST).send({
      error: errorMessage,
      data: null,
    })
  }
}

export const updateRole = async (req, res) => {
  try {
    const { _id } = req.user
    const { role } = req.body
    
    await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          role,
        },
      },
      {
        new: true,
      },
    )

    const user = await User.findById(_id)

    return res.status(StatusCodes.OK).send({
      error: null,
      data: user,
    })
  } catch (error) {
    const errorMessage = typeof error === 'object' && error !== null
      ? error.toString()
      : 'Unexpected Error'

    return res.status(StatusCodes.BAD_REQUEST).send({
      error: errorMessage,
      data: null,
    })
  }
}

export const updateProfileImage = async (req, res) => {
  try {
    const { _id } = req.user

    const profileImage = req.files.profileImage

    const profileImagekey = `${profileImage[0].filename}.${FILE_TYPES[profileImage[0].mimetype]}`
    const uploadedImage = await uploadFile(profileImage[0], profileImagekey)
    await unlinkFile(uploadedImage[0].path)

    await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          profileImage: `${process.env.CDN_URL}/${uploadedImage}` || '',
        },
      },
      {
        new: true,
      },
    )

    const user = await User.findById(_id)

    return res.status(StatusCodes.OK).send({
      error: null,
      data: user,
    })
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: err.toString(),
      data: null,
    })
  }
}
