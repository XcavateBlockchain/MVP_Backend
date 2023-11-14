import express from 'express'
import multer from 'multer'
import { connectDid, create, updateBannerImage, updateProfileImage, updateRole } from '../controllers/user.controller.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

const upload = multer({ dest: 'assets/' })

router.post(
  '/',
  [upload.fields([
    { name: 'idDoc1', maxCount: 1 },
    { name: 'idDoc2', maxCount: 1 },
  ])],
  create,
)
router.post('/connect-did', connectDid)
router.post('/update-role', auth, updateRole)
router.post(
  '/update-profile-image',
  [auth, upload.fields([
    { name: 'profileImage', maxCount: 1 },
  ])],
  updateProfileImage,
)
router.post(
  '/update-banner-image',
  [auth, upload.fields([
    { name: 'bannerImage', maxCount: 1 },
  ])],
  updateBannerImage,
)

export default router
