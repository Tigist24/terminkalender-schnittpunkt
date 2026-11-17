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