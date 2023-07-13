import express from 'express'
import multer from 'multer'
import { connectDid, create } from '../controllers/user.controller.js'

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

export default router
