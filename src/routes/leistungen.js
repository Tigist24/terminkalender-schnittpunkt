import express from 'express'
import { getLeistungen } from '../controllers/leistungenController'

export const router = express.Router()

router.get('/', getLeistungen)

