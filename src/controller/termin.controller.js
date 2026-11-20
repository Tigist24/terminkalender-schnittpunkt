import { freieZeiten, buchen, terminZumCode, stornierenMitCode } from '../service/termin.service.js'
import {istDatum, istUhrzeit} from '../util/zeit.js'


//hier wird die id benutzt
function personAusEingabe(wert){
    if(wert == null || wert == '' || wert == 'egal'){
        return null
    }
    return Number(wert)
}

export async function getFreieZeiten(req, res){
    const leistungId = Number(req.query.leistung_id)
    const datum = req.query.datum
    const mitarbeiterId = personAusEingabe(req.query.mitarbeiter_id)

    if(!Number.isInteger(leistungId)){
        return res.status(400).json({error : "bitte eine leistung wählen"})
    }
    if(!istDatum(datum)){
        return res.status(400).json({error: "datum bitte als JJJJ-MM-TT"})
    }
    if(mitarbeiterId !== null && !Number.isInteger(mitarbeiterId)){
        return res.status(400).json({error: "ungültige person"})
    }


try {
    const ergebnis = await freieZeiten(leistungId, datum, mitarbeiterId)
    if(ergebnis.fehler){
        return res.status(400).json({error: "fehlerhaftes ergebnis" })
    }
    res.status(200).json(ergebnis.zeiten)
}catch (err) {
    console.log(err)
    res.status(500).json({ error: "freie zeiten konnten nicht geladen werden"})
    }
}

export async function postTermin(req, res){
    const body = req.body
    const daten = {
        leistung_id: Number(body.leistung_id),
        mitarbeiter_id: personAusEingabe(body.mitarbeiter_id),
        datum: body.datum,
        uhrzeit: body.uhrzeit,
        name: String(body.name),
        telefon: String(body.telefon),
        email: String(body.email).toLowerCase()
    }


    if(!Number.isInteger(daten.leistung_id)){
        return res.status(400).json({error: "bitte eine leistung wählen"})
    }
    if(daten.mitarbeiter_id !== null && !Number.isInteger(daten.mitarbeiter_id)){
        return res.status(400).json({error: "ungültige person"})
    }
    if(!istDatum(daten.datum)){
        return res.status(400).json({error: "datum bitte als JJJJ-MM-TT"})
    }
    if(!istUhrzeit(daten.uhrzeit)){
        return res.status(400).json({error: "uhrzeit bitte als HH:MM"})
    }
    if(daten.name.length < 2 || daten.name.length > 100){
        return res.status(400).json({error: "bitte deinen namen angeben"})
    }
    if(!/^[0-9 +\/()-]{6,30}$/.test(daten.telefon)){
        return res.status(400).json({error: "bitte eine gültige telefonnummer angeben"})
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(daten.email) || daten.email.length > 100){
        return res.status(400).json({error: "bitte eine gültige e-mail-adresse angeben"})
    }

    try {
        const ergebnis = await buchen(daten)
        if(ergebnis.fehler){
            // 409 = zeit schon belegt, sonst 400
            const status = ergebnis.fehler.includes('belegt') ? 409 : 400
            return res.status(status).json({error: ergebnis.fehler})
        }
        res.status(201).json(ergebnis.termin)
    }catch (err) {
        console.log(err)
        res.status(500).json({ error: "termin konnte nicht gebucht werden"})
    }


}

//GET /api/termine/:code  termin vor dem stornieren
export async function getTerminZumCode(req, res){
    try{
        const ergebnis = await getTerminZumCode(req.params.code)
        if(ergebnis.fehler){
            return res.status(404).json({error: ergebnis.fehler})
        }
        res.status(200).json(ergebnis.termin)
    }catch (err){
        console.log(err)
        res.status(500).json({error: "termin konnte nicht geladen werden"})
    }
}


//PUT api/termine/:code/storno
export async function putStorno(req, res){
    try{
        const message = await stornierenMitCode(req.params.code)
        if(message){
            return res.status(400).json({error:message})
        }
        res.status(200).json({message:"dein termin wurde storniert"})
        }catch (err){
        console.log(err)
        res.status(500).json({error: "termin konnte nicht storniert werden"})
    }
}
