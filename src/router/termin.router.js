import express from 'express'

import { getFreieZeiten, postTermin, putStorno, getTerminZumCode } from '../controller/termin.controller.js'

export const router = express.Router()

router.get('/zeiten', getFreieZeiten)
router.post('/termine', postTermin)
router.get('/termine/:code', getTerminZumCode)
router.put('/termine/:code/storno', putStorno)

export default router