import express from 'express'
import { getLeistungen, getMitarbeiterFuerLeistung } from '../controller/leistung.controller.js'

export const router = express.Router()

router.get('/', getLeistungen)
router.get('/:id/mitarbeiter',getMitarbeiterFuerLeistung )

export default router

