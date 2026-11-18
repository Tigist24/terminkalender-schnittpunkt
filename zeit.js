
// regeln aus dem gespräch
export const oeffnungszeiten = [
    null, 
    null, 
    {von:'09:00', bis: '18:00'},
    {von:'09:00', bis: '18:00'},
    {von:'09:00', bis: '18:00'},
    {von:'09:00', bis: '18:00'},
    {von:'09:00', bis: '14:00'}
]

export const minuten_takt = 15
export const stunden_vorlauf = 2
export const monate_voraus = 3
export const stunden_storno_frist = 24


//hilfsfunktionen für die buchung
export function uhrzeitZuMinuten(uhrzeit){
    const teile = uhrzeit.split(':')
    const stunden = Number(teile[0])
    const minuten = Number(teile[1])
    return(stunden *60 + minuten)
}

function zweistellig(){
     if(zahl < 10){
         return '0' + zahl
    }
 return String(zahl)
}


export function minutenZuUhrzeit(gesamtMinuten){
    const stunden = Math.floor(gesamtMinuten/60)
    const minuten = gesamtMinuten %60
    return zweistellig(stunden) + ':' + zweistellig(minuten)
}


export function datetimeZuDate(datetime){
    return new Date(datetime.replace(' ', 'T'))
}


export function wochentag(datum){
    return new Date(datum).getDay()
}

//um 1 verschoben
export function datumZuText(datum){
    return datum.getFullYear() + '-' + zweistellig(datum.getMonth())+ '-' + zweistellig(datum.getDate())
}

export function istUhrzeit(text){
    const regex=/^(?:[01]?[0-9]|2[0-3]):[0-5]\d$/ 
   return regex.test(text)
      
}

export function heute(){
    return datumZuText(new Date())
}
///////////////////////////////////////////////////////////////////
// überschneidung zweier zeiträume
function overlaps(startA, endA, startB, endB) {
    return startA < endB && endA > startB
}///////////////////////////////////////////////////////////
// console.log(datetimeZuMinuten('2026-11-17 09:15:00'))
console.log(wochentag(new Date()))
console.log(istUhrzeit('13:45'))
console.log(zweistellig())

