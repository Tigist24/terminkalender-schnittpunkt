import { pool } from '../db.js'

export async function getLeistungen(_req, res){
    try { const [rows] = await pool.query(
        `SELECT id, name, dauer_min, preis_cent
        FROM leistung
        WHERE aktiv=TRUE
        ORDER BY name`
        )
        res.status(200).json(rows)
    }   catch (err){
        console.error(err)
        res.status(500).json({error: 'Leistungen konnten nicht geladen werden'})
    }
}

export async function getMitarbeiterFuerLeistung(req, res) {
    const leistungId = Number(req.params.id)

    if(!Number.isInteger(leistungId) || leistungId <= 0){
        return res.status(400).json({error: 'diese LeistungsId gibt es nicht'})
    }
    try{
        const [leistungen] = await pool.execute(
            'SELECT id FROM leistung WHERE id = ? AND aktiv = TRUE', [leistungId]
        )
        if (leistungen.length === 0){
            return res.status(404).json({error: 'leistungen nicht gefunden'})
        }

        const [mitarbeiter] = await pool.execute(
            `SELECT m.id, m.name
            FROM mitarbeiter m
            JOIN mitarbeiter_leistung ml On ml.mitarbeiter_id = m.id
            WHERE ml.leistung_id =? AND aktiv = TRUE
            ORDER BY m.name`,
            [leistungId]
        )
        res.status(200).json(mitarbeiter)
    } catch (err) {
        console.error(err)
        res.status(500).json({error:'Mitarbeitende konnten nicht geladen werden'})
    }
}