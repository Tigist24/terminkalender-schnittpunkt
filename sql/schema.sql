DROP DATABASE IF EXISTS schnittpunkt;
CREATE DATABASE schnittpunkt
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE schnittpunkt;


CREATE TABLE kunde(
    id  INT NOT NULL AUTO_INCREMENT,
    name VARCHAR (100) NOT NULL, 
    telefon VARCHAR (100) NOT NULL,
    email VARCHAR (100) NOT NULL,
    erstellt_am DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_email UNIQUE (email)
);

CREATE TABLE mitarbeiter (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR (100) NOT NULL,
    aktiv BOOLEAN not null default true, 
    PRIMARY KEY (id),
    CONSTRAINT uq_mitarbeiter_name UNIQUE (name)
);
CREATE TABLE leistung (
    id INT not null AUTO_INCREMENT,
    name VARCHAR(100) not null,
    dauer_minuten INT NOT NULL, 
    preis DECIMAL (6,2) not null,
    aktiv BOOLEAN not null default true,
    primary key (id), 
    CONSTRAINT uq_leistung_name UNIQUE (name),
    CONSTRAINT chk_leistung_dauer CHECK (dauer_minuten >= 15),
    CONSTRAINT chk_leistung_preis check (preis >= 0)

);
CREATE TABLE mitarbeiter_leistung(
    mitarbeiter_id INT NOT NULL, 
    leistung_id INt NOT NULL, 
    primary key (mitarbeiter_id, leistung_id),
    CONSTRAINT fk_ml_mitarbeiter foreign key (mitarbeiter_id) REFERENCES mitarbeiter (id),
    CONSTRAINT fk_ml_leistung foreign key (leistung_id) REFERENCES leistung (id)
);
CREATE TABLE termin (
    id INT not null AUTO_INCREMENT, 
    kunde_id int not null, 
    mitarbeiter_id int not null, 
    leistung_id int not null, 
    beginn DATETIME not null,
    ende DATETIME not null, 
    preis DECIMAL (6,2) not null,
    status ENUM("gebucht", "erledigt", "storniert") not null default "gebucht",
    storno_code VARCHAR(100) not null,
    erstellt_am datetime not null default CURRENT_TIMESTAMP,
    primary key (id),
    CONSTRAINT uq_storno_code_termin unique (storno_code),
    CONSTRAINT chk_termin_zeitraum CHECK (ende > beginn),
    CONSTRAINT chk_termin_preis CHECK (preis > 0),
    CONSTRAINT fk_termin_kunde FOREIGN KEY (kunde_id) REFERENCES kunde (id),
    CONSTRAINT fk_termin_mitarbeiter FOREIGN KEY (mitarbeiter_id) REFERENCES mitarbeiter (id),
    CONSTRAINT fk_termin_leistung FOREIGN KEY (leistung_id) REFERENCES leistung (id)

);

-- ---------generierte beispeldaten-----------------------------------------

-- Leistungen laut Protokoll (D-01), Preise in Cent
INSERT INTO leistung (id, name, dauer_minuten, preis) VALUES
  (1, 'Herrenschnitt',       30, 28.00),
  (2, 'Damenschnitt',        45, 42.00),
  (3, 'Waschen und Föhnen',  30, 22.00),
  (4, 'Kinderschnitt',       20, 16.00),
  (5, 'Bartpflege',          15, 12.00),
  (6, 'Färben',              90, 75.00);

-- Team laut Protokoll (D-02)
INSERT INTO mitarbeiter (id, name) VALUES
  (1, 'Sabine'),
  (2, 'Mara'),
  (3, 'Jonas');

-- Wer macht was (F-15, R-05):
-- Sabine und Mara: alles, Jonas: Herren, Waschen/Föhnen, Kinder, Bart
INSERT INTO mitarbeiter_leistung (mitarbeiter_id, leistung_id) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
  (2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
  (3, 1), (3, 3), (3, 4), (3, 5);

INSERT INTO kunde (id, name, telefon, email) VALUES
  (1, 'Anna Roth',     '0151 1112223', 'anna.roth@example.com'),
  (2, 'Ben Krüger',    '0160 2223334', 'ben.krueger@example.com'),
  (3, 'Clara Weiß',    '0171 3334445', 'clara.weiss@example.com'),
  (4, 'David Yilmaz',  '0152 4445556', 'david.yilmaz@example.com'),
  (5, 'Eva Schmidt',   '0176 5556667', 'eva.schmidt@example.com');

-- Termine: Ende = Beginn + Dauer, Preis = Preis der Leistung,
-- keine Überschneidungen pro Person, alles in Öffnungszeit und 15-Min-Raster.
-- Stornocodes sind zum Testen bewusst leicht lesbar.
INSERT INTO termin
  (kunde_id, mitarbeiter_id, leistung_id, beginn, ende, preis, status, storno_code) VALUES
  -- Sa 14.11. (Vergangenheit)
  (2, 2, 1, '2026-11-14 10:00', '2026-11-14 10:30', 28.00, 'erledigt',  '00000000-0000-4000-8000-000000000001'),
  (4, 3, 5, '2026-11-14 11:00', '2026-11-14 11:15', 12.00, 'storniert', '00000000-0000-4000-8000-000000000002'),
  -- Di 17.11.
  (1, 1, 6, '2026-11-17 09:00', '2026-11-17 10:30', 75.00, 'gebucht',   '00000000-0000-4000-8000-000000000003'),
  (2, 3, 1, '2026-11-17 09:30', '2026-11-17 10:00', 28.00, 'gebucht',   '00000000-0000-4000-8000-000000000004'),
  (3, 2, 2, '2026-11-17 10:00', '2026-11-17 10:45', 42.00, 'gebucht',   '00000000-0000-4000-8000-000000000005'),
  (5, 3, 4, '2026-11-17 10:15', '2026-11-17 10:35', 16.00, 'gebucht',   '00000000-0000-4000-8000-000000000006'),
  -- Sa 21.11. (Grenzfall: endet genau um 14:00)
  (3, 2, 2, '2026-11-21 13:15', '2026-11-21 14:00', 42.00, 'gebucht',   '00000000-0000-4000-8000-000000000007'),
  -- Di 24.11. (voller Tag zum Testen der Tagesübersicht)
  (3, 1, 3, '2026-11-24 09:00', '2026-11-24 09:30', 22.00, 'gebucht',   '00000000-0000-4000-8000-000000000008'),
  (5, 1, 2, '2026-11-24 10:00', '2026-11-24 10:45', 42.00, 'gebucht',   '00000000-0000-4000-8000-000000000009'),
  (1, 2, 6, '2026-11-24 09:00', '2026-11-24 10:30', 75.00, 'gebucht',   '00000000-0000-4000-8000-000000000010'),
  (4, 2, 1, '2026-11-24 11:00', '2026-11-24 11:30', 28.00, 'gebucht',   '00000000-0000-4000-8000-000000000011'),
  (2, 3, 5, '2026-11-24 09:00', '2026-11-24 09:15', 12.00, 'gebucht',   '00000000-0000-4000-8000-000000000012'),
  (4, 3, 4, '2026-11-24 09:15', '2026-11-24 09:35', 16.00, 'gebucht',   '00000000-0000-4000-8000-000000000013'),
  (5, 3, 3, '2026-11-24 14:00', '2026-11-24 14:30', 22.00, 'gebucht',   '00000000-0000-4000-8000-000000000014'),
  (2, 1, 1, '2026-11-24 17:30', '2026-11-24 18:00', 28.00, 'gebucht',   '00000000-0000-4000-8000-000000000015');