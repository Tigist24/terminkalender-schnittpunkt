

import { aktiveLeistungen, mitarbeiterFuerLeistung } from '../service/leistung.service.js'

export async function getLeistungen(_req, res){
    try { const leistungen = await aktiveLeistungen()
        res.status(200).json(leistungen)
    }   catch (err){
        console.log(err)
        res.status(500).json({error: 'leistungen konnten nicht geladen werden'})
    }
}

export async function getMitarbeiterFuerLeistung(req,res){
    const leistungId = Number(req.params.id)
    if(!Number.isInteger(leistungId)){
        return res.status(400).json({error: 'ungültige leistung'})
    }
    try {


        const ergebnis = await mitarbeiterFuerLeistung(leistungId)
        if(ergebnis.fehler){
            return res.status(404).json({error: ergebnis.fehler})
        }
        res.status(200).json(ergebnis.personen)
    }
catch(err){
    console.log(err)
    res.status(500).json({error: 'personen können nicht geladen werden'})
    }
}