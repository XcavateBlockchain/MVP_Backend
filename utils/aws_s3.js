import fs from 'fs'
import S3 from 'aws-sdk/clients/s3.js'
import dotenv from 'dotenv'

dotenv.config()

const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
})

/**
 * @notice Upload a file to AWS S3
 * 
 * @param fileName Image file
 * @param fileKey Key of file
 * @returns Promise
 */
export const uploadFile = async (fileName, fileKey) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
      // ACL: 'public-read',
      Body: fs.createReadStream(fileName.path),
      ContentType: fileName.mimetype,
    }

    s3.upload(params, (s3Err, data) => {
      if (s3Err) {
        reject(s3Err)
      }
      resolve(data?.Key)
    })
  })
}