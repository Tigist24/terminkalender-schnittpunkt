import { pool } from "../util/db.js"

export async function findAktive(){
    const [rows] = await pool.execute('SELECT * FROM leistung WHERE aktiv = TRUE ORDER BY name')
    return rows
}

export async function findById(id){
    const [rows] = await pool.execute('SELECT * FROM leistung WHERE id = ?', [id])
    return rows[0]
}