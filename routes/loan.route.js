import express from 'express'
import multer from 'multer'
import { create } from '../controllers/loan.controller.js'

const router = express.Router()

const upload = multer({ dest: 'assets/' })

router.post(
  '/',
  [upload.fields([
    { name: 'developmentPlan', maxCount: 1 },
    { name: 'elevationCGIS', maxCount: 1 },
    { name: 'pricingSchedule', maxCount: 1 },
  ])],
  create,
)

export default router
