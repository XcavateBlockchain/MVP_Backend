import { Loan } from '../models/loan.model.js'
import { StatusCodes } from 'http-status-codes'
import { FILE_TYPES } from '../utilities/constants.js'
import { uploadFile } from '../utilities/aws_s3.js'
import util from 'util'
import fs from 'fs'

const unlinkFile = util.promisify(fs.unlink)

export const create = async (req, res) => {
  try {
    const { body } = req

    // upload image to S3
    let uploadFilePromises = []

    const developmentPlan = req.files.developmentPlan
    const elevationCGIS = req.files.elevationCGIS
    const pricingSchedule = req.files.pricingSchedule

    const developmentPlanKey = `${developmentPlan[0].filename}.${FILE_TYPES[developmentPlan[0].mimetype]}`
    uploadFilePromises.push(uploadFile(developmentPlan[0], developmentPlanKey))

    if (elevationCGIS && elevationCGIS[0]) {
      const elevationCGISKey = `${elevationCGIS[0].filename}.${FILE_TYPES[elevationCGIS[0].mimetype]}`
      uploadFilePromises.push(uploadFile(elevationCGIS[0], elevationCGISKey))
    }

    if (pricingSchedule && pricingSchedule[0]) {
      const pricingScheduleKey = `${pricingSchedule[0].filename}.${FILE_TYPES[pricingSchedule[0].mimetype]}`
      uploadFilePromises.push(uploadFile(pricingSchedule[0], pricingScheduleKey))
    }

    Promise.all(uploadFilePromises)
      .then(async (values) => {
        const images = values

        await unlinkFile(developmentPlan[0].path)

        let _image = {
          developmentPlan: images[0] ? `${process.env.CDN_URL}/${images[0]}` : '',
          elevationCGIS: '',
          pricingSchedule: '',
        }

        if (elevationCGIS && elevationCGIS[0] && !pricingSchedule && !pricingSchedule[0]) {
          await unlinkFile(elevationCGIS[0].path)

          _image = {
            ..._image,
            elevationCGIS: images[1] ? `${process.env.CDN_URL}/${images[1]}` : '',
          }
        } else if (!elevationCGIS && !elevationCGIS[0] && pricingSchedule && pricingSchedule[0]) {
          await unlinkFile(pricingSchedule[0].path)

          _image = {
            ..._image,
            pricingSchedule: images[1] ? `${process.env.CDN_URL}/${images[1]}` : '',
          }
        } else if (elevationCGIS && elevationCGIS[0] && pricingSchedule && pricingSchedule[0]) {
          await unlinkFile(elevationCGIS[0].path)
          await unlinkFile(pricingSchedule[0].path)

          _image = {
            ..._image,
            elevationCGIS: images[1] ? `${process.env.CDN_URL}/${images[1]}` : '',
            pricingSchedule: images[2] ? `${process.env.CDN_URL}/${images[2]}` : '',
          }
        }

        const loan = new Loan({
          ...body,
          ..._image,
        })
        const doc = await loan.save()

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
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: error.toString(),
      data: null,
    })
  }
}
