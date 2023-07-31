import express from 'express'
import { auth } from '../middleware/auth.js'
import { create, getLastId } from '../controllers/collection.controller.js'

const router = express.Router()

router.post('/', auth, create)
router.get('/getLastId', getLastId)

export default router
