import 'dotenv/config'
import express from 'express'


import leistungRouter  from './src/router/leistung.router.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(express.static('public'))

app.use('/api/leistungen', leistungRouter)

app.use('/api', (_req, res)=> {
    res.status(404).json({error: "keine route gefunden"})
})

app.listen(PORT, () => { console.log(`Server läuft auf http://localhost:${PORT}`)})