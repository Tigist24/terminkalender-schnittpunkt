import express from 'express'
import { getLeistungen } from '../controllers/leistungenController.js'

export const router = express.Router()

router.get('/', getLeistungen)

export default router

