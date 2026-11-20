// alle regeln aus dem gespräch
import { findById as findLeistung } from "../repositories/leistung.repository.js"
import { findByLeistung } from "../repositories/mitarbeiter.repository.js"
import { pool } from "../util/db.js"
import { terminErstellen, sperrePerson, hatUeberschneidung, findByCode, statusAendern } from "../repositories/termin.repository.js"
import { uhrzeitZuMinuten, minutenZuUhrzeit, zuDatetime, datetimeZuDate, wochentag, wochentagName } from "../util/zeit.js"
import { speichern as speichereKunde } from "../repositories/kunde.repository.js"
import crypto from 'crypto'

const oeffnungszeiten = [
    'geschlossen',                           // sonntag (0)
    'geschlossen',                           // montag (1)
    { von: '09:00', bis: '18:00' },         // dienstag (2)
    { von: '09:00', bis: '18:00' },         // mittwoch (3)
    { von: '09:00', bis: '18:00' },         // donnerstag (4)
    { von: '09:00', bis: '18:00' },         // freitag (5)
    { von: '09:00', bis: '14:00' }          // samstag (6)
]

const minuten_takt = 15
const stunden_vorlauf = 2
const monate_voraus = 3
const storno_frist = 24



export function pruefeZeitRegeln(datum, startMinuten, dauer) {
    const offen = oeffnungszeiten[wochentag(datum)]
    if (offen==='geschlossen') {
        return 'Am ' + wochentagName(datum) + ' ist der Salon geschlossen'
    }
    if (startMinuten % minuten_takt != 0) {
        return 'Termine beginnen nur im Viertelstundentakt (9:00, 9:15...)'
    }
    if (startMinuten < uhrzeitZuMinuten(offen.von) || startMinuten + dauer > uhrzeitZuMinuten(offen.bis)) {
        return 'Der Termin muss komplett in die Öffnungszeit passen (' + offen.von + ' bis ' + offen.bis + ' Uhr)'
    }

    const beginn = datetimeZuDate(zuDatetime(datum, startMinuten))
    const frueheste = new Date(Date.now() + stunden_vorlauf * 60 * 60 * 1000)
    const spaeteste = new Date()
    if (beginn < frueheste) {
        return 'Online geht es nur mindestens ' + stunden_vorlauf + ' Stunden vorher, kurzfristig bitte anrufen'
    }
   
    spaeteste.setMonth(spaeteste.getMonth() + monate_voraus)
    if (beginn > spaeteste) {
        return 'Termine gehen höchstens ' + monate_voraus + ' Monate im Voraus'
    }
    return null
}


// welche personen kommen in frage: alle die die leistung machen, oder nur die gewünschte
async function moeglichePersonen(leistungId, mitarbeiterId) {
    const personen = await findByLeistung(leistungId)
    if (!mitarbeiterId) {
        return personen // "egal welche"
    }
    return personen.filter(person => person.id == mitarbeiterId)
}

// gibt { fehler } oder { zeiten: ['09:00', '09:15', ...] } zurück
export async function freieZeiten(leistungId, datum, mitarbeiterId) {
    const leistung = await findLeistung(leistungId)
    if (!leistung || !leistung.aktiv) {
        return { fehler: 'Diese Leistung gibt es nicht' }
    }
    const personen = await moeglichePersonen(leistungId, mitarbeiterId)
    if (personen.length == 0) {
        return { fehler: 'Diese Person bietet die Leistung nicht an' }
    }
    const offen = oeffnungszeiten[wochentag(datum)]
    if (!offen) {
        return { zeiten: [] }
    }

   
    const dauer = leistung.dauer_minuten
    const zeiten = []
    console.log('test', wochentag(datum), offen, leistung.dauer_minuten, pruefeZeitRegeln(datum, 600, 30))

    for (let start = uhrzeitZuMinuten(offen.von); start + dauer <= uhrzeitZuMinuten(offen.bis); start += minuten_takt) {
        if (pruefeZeitRegeln(datum, start, dauer)) {
            continue 
        }

        const beginn = zuDatetime(datum, start)
        const ende = zuDatetime(datum, start +dauer)

        for (const person of personen){
            const belegt = await hatUeberschneidung(pool, person.id, beginn, ende)
            if(!belegt){
                zeiten.push(minutenZuUhrzeit(start))
                break
            }
        }
    }
    return { zeiten: zeiten }
}
////////
    // gibt { fehler } oder { termin } zurück
export async function buchen(daten) {
    const leistung = await findLeistung(daten.leistung_id)
    if (!leistung || !leistung.aktiv) {
        return { fehler: 'die leistung gibt es nicht' }
    }

    const start = uhrzeitZuMinuten(daten.uhrzeit)
    const regelNichtEingehalten = pruefeZeitRegeln(daten.datum, start, leistung.dauer_minuten)
    if (regelNichtEingehalten) {
        return { fehler: regelNichtEingehalten }
    }

    const personen = await moeglichePersonen(leistung.id, daten.mitarbeiter_id)
    if (personen.length == 0) {
        return { fehler: 'diese mitarbeiter*in bietet diese leistung nicht an' }
    }

    const beginn = zuDatetime(daten.datum, start)
    const ende = zuDatetime(daten.datum, start + leistung.dauer_minuten)

    // ab hier alles über eine verbindung
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()

        // erst sperren, dann prüfen
        let gewaehlt = null
        for (const person of personen) {
            await sperrePerson(conn, person.id)
            const belegt = await hatUeberschneidung(conn, person.id, beginn, ende)
            if (!belegt) {
                gewaehlt = person
                break
            }
        }
        if (!gewaehlt) {
            await conn.rollback()
            return { fehler: 'dieses zeitfenster ist schon belegt, wähle ein anderes' }
        }

        const kundeId = await speichereKunde(conn, daten)
        const stornoCode = crypto.randomUUID()
        await terminErstellen(conn, {
            kunde_id: kundeId,
            mitarbeiter_id: gewaehlt.id,
            leistung_id: leistung.id,
            beginn: beginn,
            ende: ende,
            preis: leistung.preis,
            storno_code: stornoCode
        })
        await conn.commit()

        return {
            termin: {
                leistung: leistung.name,
                mitarbeiter: gewaehlt.name,
                beginn: beginn,
                ende: ende,
                preis: leistung.preis,
                storno_code: stornoCode
            }
        }
    } catch (err) {
        await conn.rollback()
        throw err
    } finally {
        conn.release()
    }
}

// termin zum code, ohne interne id
export async function terminZumCode(code) {
    const termin = await findByCode(code)
    if (!termin) {
        return { fehler: 'zu diesem code gibt es keinen termin' }
    }
    delete termin.id
    return { termin: termin }
}

// stornieren nur bis 24 stunden vorher
export async function stornierenMitCode(code) {
    const termin = await findByCode(code)
    if (!termin) {
        return 'zu diesem code gibt es keinen termin'
    }
    if (termin.status != 'gebucht') {
        return 'dieser termin ist schon ' + termin.status
    }
    const grenze = new Date(Date.now() + storno_frist * 60 * 60 * 1000)
    if (datetimeZuDate(termin.beginn) < grenze) {
        return 'weniger als ' + storno_frist + ' stunden vorher geht das nur telefonisch über den salon'
    }
    await statusAendern(termin.id, 'storniert')
    return null
}

