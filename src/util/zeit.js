


//hilfsfunktionen für die buchung
export function uhrzeitZuMinuten(uhrzeit){
    const teile = uhrzeit.split(':')
    const stunden = Number(teile[0])
    const minuten = Number(teile[1])
    return(stunden *60 + minuten)
}

function zweistellig(zahl){
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

export const wochentage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

export function wochentagName(datum) {
    return wochentage[wochentag(datum)]
}

export function istDatum(text) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        return false
    }
    return datumZuText(new Date(text)) == text
}

export function datumZuText(datum){
    return datum.getFullYear() + '-' + zweistellig(datum.getMonth()+1)+ '-' + zweistellig(datum.getDate())
}

export function istUhrzeit(text){
    const regex=/^([01]\d|2[0-3]):[0-5]\d$/ 
   return regex.test(text)
      
}

export function heute(){
    return datumZuText(new Date())
}

export function zuDatetime(datum, minuten){
    return datum+' '+minutenZuUhrzeit(minuten)+ ':00'
}
// ///////////////////////////////////////////////////////////////////
// // überschneidung zweier zeiträume
// function overlaps(startA, endA, startB, endB) {
//     return startA < endB && endA > startB
// }///////////////////////////////////////////////////////////
// // console.log(datetimeZuMinuten('2026-11-17 09:15:00'))
// console.log(wochentag(new Date()))
// console.log(istUhrzeit('13:45'))
// console.log(zweistellig(9))

// console.log(heute())                    // soll das heutige datum sein: 2026-11-18
// console.log(wochentag('2026-11-24'))    // soll 2 sein (dienstag)