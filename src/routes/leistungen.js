import express from 'express'
import { getLeistungen, getMitarbeiterFuerLeistung } from '../controllers/leistungenController.js'

export const router = express.Router()

router.get('/', getLeistungen)
router.get('/:id/mitarbeiter', getMitarbeiterFuerLeistung)

export default router

