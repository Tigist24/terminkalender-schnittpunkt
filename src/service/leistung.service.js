import { findAktive, findById } from "../repositories/leistung.repository.js"
import  { findByLeistung } from "../repositories/mitarbeiter.repository.js"

export async function aktiveLeistungen(){
    return await findAktive()
}

export async function mitarbeiterFuerLeistung(leistungId){
    const leistung = await findById(leistungId)
    if(!leistung || !leistung.aktiv){
        return { fehler: 'diese leistung gibt es nicht'}
    }
    return {personen : await findByLeistung(leistungId)}
}