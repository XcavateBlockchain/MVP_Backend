import express from 'express'
import multer from 'multer'
import { create } from '../controllers/property.controller.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

const upload = multer({ dest: 'assets/' })

router.post(
  '/',
  [auth, upload.fields([
    { name: 'floorPlanImage', maxCount: 1 },
    { name: 'assignmentImage', maxCount: 1 },
    { name: 'images', maxCount: 4 },
  ])],
  create,
)

export default router
