
export async function speichern(conn,kunde){
    const[result] = await conn.execute(`
        INSERT INTO kunde (name, telefon, email) VALUES (?,?,?) ON DUPLICATE KEY UPDATE name = VALUES(name),
         telefon = VALUES(telefon), id = LAST_INSERT_ID(id)
        `, [kunde.name, kunde.telefon, kunde.email])
        return result.insertId
}