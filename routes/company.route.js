import express from 'express'
import multer from 'multer'
import { create } from '../controllers/company.controller.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

const upload = multer({ dest: 'assets/' })

router.post(
  '/',
  [auth, upload.fields([
    { name: 'idDoc1', maxCount: 1 },
    { name: 'idDoc2', maxCount: 1 },
  ])],
  create,
)

export default router
