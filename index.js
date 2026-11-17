import 'dotenv/config'
import express from 'express'
import path from 'node:path'


import leistungenRouter  from './src/routes/leistungen.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(express.static(path.join(import.meta.dirname, 'public')))

app.use('/api/leistungen', leistungenRouter)

app.use('/api', (req, res)=> {
    res.status(404).json({error: "keine route gefunden"})
})

app.listen(PORT, () => { console.log(`Server läuft auf http://localhost:${PORT}`)})