import express from 'express'
import { auth } from '../middleware/auth.js'
import { create, createLoanCollection, getLastId } from '../controllers/collection.controller.js'

const router = express.Router()

router.post('/', auth, create)
router.post('/createLoanCollection', auth, createLoanCollection)
router.get('/getLastId', getLastId)

export default router
