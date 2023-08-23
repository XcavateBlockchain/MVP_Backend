import express from 'express'
import multer from 'multer'
import { create, getLoansByUser } from '../controllers/loan.controller.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

const upload = multer({ dest: 'assets/' })

router.post(
  '/',
  [auth, upload.fields([
    { name: 'developmentPlan', maxCount: 1 },
    { name: 'elevationCGIS', maxCount: 1 },
    { name: 'pricingSchedule', maxCount: 1 },
  ])],
  create,
)
router.get('/', auth, getLoansByUser)

export default router
