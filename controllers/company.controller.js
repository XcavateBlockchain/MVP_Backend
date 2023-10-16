import { Company } from '../models/company.model.js'
import { User } from '../models/user.model.js'
import { FILE_TYPES } from '../utilities/constants.js'
import { uploadFile } from '../utilities/aws_s3.js'
import { StatusCodes } from 'http-status-codes'
import util from 'util'
import fs from 'fs'

const unlinkFile = util.promisify(fs.unlink)

/** using aws for file management */
// export const create = async (req, res) => {
//   try {
//     const { _id } = req.user
//     const { body } = req

//     // upload image to S3
//     let uploadFilePromises = []

//     const idDoc1 = req.files.idDoc1
//     const idDoc2 = req.files.idDoc2

//     const idDoc1key = `${idDoc1[0].filename}.${FILE_TYPES[idDoc1[0].mimetype]}`
//     uploadFilePromises.push(uploadFile(idDoc1[0], idDoc1key))

//     if (idDoc2 && idDoc2[0]) {
//       const idDoc2Key = `${idDoc2[0].filename}.${FILE_TYPES[idDoc2[0].mimetype]}`
//       uploadFilePromises.push(uploadFile(idDoc2[0], idDoc2Key))
//     }

//     Promise.all(uploadFilePromises)
//       .then(async (values) => {
//         const images = values

//         await unlinkFile(idDoc1[0].path)

//         let _image = {
//           idDoc1: images[0] ? `${process.env.CDN_URL}/${images[0]}` : '',
//           idDoc2: '',
//         }

//         if (idDoc2 && idDoc2[0]) {
//           await unlinkFile(idDoc2[0].path)

//           _image = {
//             ..._image,
//             idDoc2: images[1] ? `${process.env.CDN_URL}/${images[1]}` : '',
//           }
//         }

//         const company = new Company({
//           ...body,
//           ..._image,
//           user: _id,
//         })
//         const doc = await company.save()

//         // add the new company to the user
//         await User.findByIdAndUpdate(
//           _id,
//           {
//             $push: {
//               companies: doc?._id,
//             }
//           },
//           {
//             new: true,
//           },
//         )

//         const user = await User.findById(_id)
//           .populate('companies')
//           .populate('credentials')

//         return res.status(StatusCodes.CREATED).send({
//           error: null,
//           data: {
//             company: doc,
//             user: user,
//           },
//         })
//       })
//       .catch((err) => {
//         console.log('uploading error :: ', err)
//         return res.status(StatusCodes.BAD_REQUEST).send({
//           error: err.toString(),
//           data: null,
//         })
//       })
//   } catch (err) {
//     console.log('creating error :: ', err)
//     return res.status(StatusCodes.BAD_REQUEST).send({
//       error: err.toString(),
//       data: null,
//     })
//   }
// }

export const create = async (req, res) => {
  try {
    const { _id } = req.user
    const { body } = req

    const company = new Company({
      ...body,
      user: _id,
    })
    const doc = await company.save()

    // add the new company to the user
    await User.findByIdAndUpdate(
      _id,
      {
        $push: {
          companies: doc?._id,
        }
      },
      {
        new: true,
      },
    )

    const user = await User.findById(_id)
      .populate('companies')
      .populate('credentials')

    return res.status(StatusCodes.CREATED).send({
      error: null,
      data: {
        company: doc,
        user: user,
      },
    })
  } catch (err) {
    console.log('creating error :: ', err)
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: err.toString(),
      data: null,
    })
  }
}
