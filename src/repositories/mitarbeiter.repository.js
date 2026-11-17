import { pool } from "../util/db.js"

export async function findAll(){
    const [rows] = await pool.execute('SELECT * FROM mitarbeiter WHERE aktiv = TRUE ORDER BY id')
    return rows
}

export async function findByLeistung(leistungId){
    const [rows] = await pool.execute(`
        SELECT mitarbeiter.id, mitarbeiter.name
        FROM mitarbeiter
        JOIN mitarbeiter_leistung ON mitarbeiter_leistung.mitarbeiter_id = mitarbeiter.id
        WHERE mitarbeiter_leistung.leistung_id = ? AND aktiv = true
        ORDER BY mitarbeiter.id`, [leistungId])
        return rows
}