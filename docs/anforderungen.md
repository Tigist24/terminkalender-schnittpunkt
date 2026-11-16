# Anforderungsliste – Online-Terminbuchung Salon Schnittpunkt

Arten: F = Funktion, R = Regel, N = nicht-funktional, D = Daten, W = Wunsch

## Funktionen

| ID |Anforderung |Prio |Prüfung |
|---|---|---|---|
| F-01 | Kundinnen und Kunden buchen online selbst einen Termin. |Muss | Buchung über die Startseite ohne Salon-Login möglich |
| F-02 | Bei der Buchung wählt man Leistung, Person oder „egal“, Datum und Uhrzeit. |Muss | Alle vier Auswahlen sind im Formular vorhanden |
| F-03 | Bei „egal“ wird automatisch eine freie Person zugewiesen, die die Leistung ausführen kann. | Muss | Färben mit „egal“ wird nie Jonas zugewiesen |
| F-04 | Kunden geben Name, Telefonnummer und E-Mail an, ein Konto ist nicht nötig. |Muss | Buchung ohne Registrierung; fehlt ein Feld, erscheint eine Meldung |
| F-05 | Bekannte Kunden werden an der E-Mail wiedererkannt, ihre Daten bleiben gespeichert. |Muss | Zweite Buchung mit gleicher E-Mail legt keinen neuen Kunden an |
| F-06 | Kunden können ohne Login stornieren, aber nur ihre eigenen Termine. |Muss | Storno nur mit gültigem Stornocode |
| F-07 | Der Salon kann jeden Termin jederzeit stornieren. | Muss | Storno im Salon-Bereich auch 1 Stunde vor Beginn möglich |
| F-08 | Stornierte Termine bleiben gespeichert und tragen einen Status. | Muss | Nach Storno steht der Termin mit Status „storniert“ in der Datenbank |
| F-09 | Der Salon markiert einen Termin als erledigt. |Muss | Button „Erledigt“ setzt den Status |
| F-10 | Der Salon sieht eine Tagesübersicht mit Zeit, Leistung, Kunde und Telefonnummer, eine Spalte pro Person. |Muss | Übersicht zeigt drei Spalten mit allen Angaben |
| F-11 | Der Salon ändert Preise von Leistungen. |Muss | Preisänderung im Salon-Bereich ist sofort auf der Buchungsseite sichtbar |
| F-12 | Die Buchungsseite bietet nur freie Startzeiten an. |Muss | Belegte Zeiten erscheinen nicht in der Auswahl |
| F-13 | Nach der Buchung erhält der Kunde eine Bestätigung mit Stornocode. |Muss | Bestätigung zeigt Termin und Code |
| F-14 | Der Salon legt neue Leistungen an. |Muss | Neue Leistung ist danach buchbar |
| F-15 | Die Anwendung speichert, welche Person welche Leistung ausführt. |Muss | Tabelle mitarbeiter_leistung ist befüllt |
| F-16 | Der Salon blättert in der Tagesübersicht zwischen den Tagen. |Muss | Buttons „vorheriger/nächster Tag“ laden die Übersicht neu |

## Regeln
| ID | Anforderung |Prio | Prüfung |
|---|---|---|---|
| R-01 | Eine Person hat zur selben Zeit höchstens einen Termin, Doppelbuchungen sind ausgeschlossen. |Muss | Zweite Buchung in überlappender Zeit → Ablehnung (409) |
| R-02 | Die Dauer der Leistung bestimmt, wie lange die Person belegt ist. |Muss | Ende = Beginn + Dauer |
| R-03 | Termine beginnen im 15-Minuten-Raster. |Muss | 10:07 wird abgelehnt |
| R-04 | Ein Termin liegt komplett in den Öffnungszeiten (Di–Fr 9–18 Uhr, Sa 9–14 Uhr, So und Mo geschlossen). |Muss | Färben um 17:45 und montags nicht buchbar |
| R-05 | Nur Personen, die die Leistung anbieten, sind wählbar. | Muss | Jonas fehlt in der Auswahl bei Färben |
| R-06 | Buchbar ist nichts in der Vergangenheit, mit mindestens 2 Stunden Vorlauf und höchstens 3 Monate im Voraus. | Muss | Buchung in 1 h und in 4 Monaten wird abgelehnt |
| R-07 | Kunden stornieren bis 24 Stunden vor Beginn selbst, danach nur der Salon. | Muss | Storno per Code 23 h vorher → Ablehnung (403) |

## Nicht-funktionale Anforderungen
| ID | Anforderung | Prio | Prüfung |
|---|---|---|---|
| N-01 | Der Salon-Bereich ist durch ein gemeinsames Passwort geschützt. |Muss | Salon-Routen ohne Login → 401 |
| N-02 | Die Buchungsseite zeigt keine Daten anderer Kunden, nur frei oder belegt. |Muss | Öffentliche API-Antworten enthalten keine Kundendaten |
| N-03 | Die Buchung ist jederzeit möglich, auch abends. |Muss | Buchung um 22 Uhr für einen späteren Tag funktioniert |
| N-04 | Kundendaten sieht nur das Salon-Team. |Muss | Telefon und E-Mail nur über Salon-Routen abrufbar |
| N-05 | Gleichzeitige Buchungen derselben Zeit dürfen nicht beide gespeichert werden. |Muss | Zwei parallele Anfragen → genau eine 201, eine 409 |
| N-06 | Passwort und Datenbankzugang liegen in einer .env-Datei, nicht im Code. (Selbst entschieden) |Muss | Kein Passwort im Repository |

## Daten
| ID | Anforderung |Prio | Prüfung |
|---|---|---|---|
| D-01 | Startdaten: Herrenschnitt 30 min/28 €, Damenschnitt 45 min/42 €, Waschen und Föhnen 30 min/22 €, Kinderschnitt 20 min/16 €, Bartpflege 15 min/12 €, Färben 90 min/75 €. |Muss | schema.sql enthält alle 6 Leistungen |
| D-02 | Team: Sabine, Mara und Jonas. Sabine und Mara bieten alle Leistungen an, Jonas Herrenschnitt, Kinderschnitt, Bartpflege sowie Waschen und Föhnen. |Muss | Zuordnungen in schema.sql |

## Wünsche
| ID | Anforderung |Prio | Prüfung |
|---|---|---|---|
| W-01 | Bestätigungs-E-Mail nach der Buchung (Konsolenausgabe genügt). |Kann | Nach Buchung erscheint die Mail in der Konsole |
| W-02 | Mehrere Leistungen in einem Termin, zum Beispiel Schnitt und Bart. |Kann | – (nicht umgesetzt) |
| W-03 | Freie Tage pro Person. |Kann | An freien Tagen wird die Person nicht angeboten |

## Nicht übernommen
- Instagram-Link („den könnte man verlinken“): Randbemerkung ohne Auftrag
- Kaffeemaschine: hat nichts mit der Anwendung zu tun
- Lena: fängt erst im Januar an, ist daher nicht in den Beispieldaten



(Die Anforderungsliste wurde mit KI überarbeitet)
