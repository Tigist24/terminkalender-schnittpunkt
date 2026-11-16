SET NAMES utf8mb4;
USE schnittpunkt;

SELECT t.beginn, t.ende, k.name as kunde, m.name AS mitarbeiter, k.telefon , l.name AS leistung
FROM termin t
join kunde k on k.id = t.kunde_id
join mitarbeiter m on m.id = t.mitarbeiter_id
join leistung l on l.id = t.leistung_id
where DATE(t.beginn)= '2026-11-24'
order by m.name, t.beginn;

SELECT m.id, m.name
FROM mitarbeiter m
JOIN mitarbeiter_leistung ml on ml.mitarbeiter_id = m.id
WHERE ml.leistung_id = 6 AND m.aktiv = true
ORDER BY m.name;

SELECT id, beginn, ende
FROM termin
WHERE mitarbeiter_id = 2
AND status IN ('gebucht', "erledigt")
AND beginn <'2026-11-24 10:45'
AND ende> '2026-11-24 10:00';