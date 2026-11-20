import { pool } from "../util/db.js"

// überschneidung: der alte termin beginnt bevor der neue endet + endet nachdem der neue beginnt
export async function hatUeberschneidung(pool,mitarbeiterId, beginn, ende) {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS anzahl
        FROM termin
        WHERE mitarbeiter_id = ? AND status <> 'storniert'
          AND beginn < ? AND ende > ?
    `, [mitarbeiterId, ende, beginn])
    return rows[0].anzahl > 0
}


export async function terminErstellen(conn, termin){
    const [result]= await conn.execute(`INSERT INTO termin(kunde_id, 
        mitarbeiter_id, leistung_id, beginn,
        ende, preis, storno_code) VAlUES (?,?,?,?,?,?,?)`, 
        [termin.kunde_id, termin.mitarbeiter_id,termin.leistung_id, 
        termin.beginn,termin.ende, termin.preis, termin.storno_code])
    return result.insertId}

export async function sperrePerson(conn, mitarbeiter_id){
    const [result]=await conn.execute(
    `SELECT * FROM mitarbeiter WHERE id = ? FOR UPDATE;`, [mitarbeiter_id]
)}

// termin über stornocode finden
export async function findByCode(code) {
    const [rows] = await pool.execute(
        `SELECT termin.id, termin.ende, termin.status, termin.beginn, termin.preis,
               leistung.name as leistung, mitarbeiter.name as mitarbeiter
        FROM termin
        JOIN leistung ON termin.leistung_id = leistung.id
        JOIN mitarbeiter ON termin.mitarbeiter_id = mitarbeiter.id
        WHERE termin.storno_code = ?`
        , [code])
    return rows[0]
}

// status ändern auf storniert, statt löschen
export async function statusAendern(id, status){
    await pool.execute('UPDATE termin SET status = ? WHERE id = ?', [status, id])
}


