# wareflow-frontend

**wareflow-frontend** ist das Frontend des Warenwirtschaftssystems (WWS) **wareflow**, das speziell für kleinere Boutiquen entwickelt wurde. Gemeinsam mit dem **wareflow-backend** (siehe eigenes Repository/Projekt) bildet es das Herzstück einer schlanken, übersichtlichen und leicht zu bedienenden Lösung. Dieses Projekt entstand als Teil der Bachelorarbeit von Aysenur Yoleri.

---

## Überblick

**wareflow-frontend** dient als grafische Benutzeroberfläche, um die Funktionen des **wareflow-backends** intuitiv abzubilden.  
Zielgruppe sind **kleinere Boutiquen**, die ihren Lagerbestand, Bestellungen, Retouren und Verkaufsprozesse effizient managen möchten.  
Durch eine einfache **UI/UX**-Konzeption können Mitarbeiter\*innen ohne großen Schulungsaufwand direkt durchstarten.

---

## Features

-   **Übersichtliches UI**: Anzeige und Verwaltung von Produkten, Bestellungen, Beschwerden, Retouren etc.
-   **Anbindung an Backend**: Kommuniziert über REST-APIs mit dem **wareflow-backend**.
-   **Benutzerverwaltung**: Login und Authentifizierung (JWT-basiert) sowie Verwaltung von Benutzern und Berechtigungen.
-   **Responsives Design**: Damit auch auf Tablets oder Smartphones eine gute Bedienbarkeit gewährleistet ist.
-   **Einfache Navigation**: Übersichtliche Menüführung für kurze Einarbeitungszeit.

---

## Voraussetzungen

-   **Node.js** (empfohlen Version 14 oder höher)
-   **npm** oder **yarn** (für das Dependency Management)
-   **Zugriff auf das wareflow-backend**
    -   Stelle sicher, dass das Backend korrekt läuft (z. B. `http://localhost:3000/`).

> **Tipp**: Richte das Backend zuerst ein und verifiziere, dass es ordnungsgemäß erreichbar ist.

---

## Installation & Setup

1. **Repository klonen**

    ```bash
    git clone <URL_zum_Repository>
    cd wareflow.frontend
    ```

2. **Abhängigkeiten installieren**

    ```bash
    npm install
    ```

    oder

    ```bash
    yarn install
    ```

3. **Starten im Entwicklungsmodus**

    ```bash
    npm start
    ```

    oder

    ```bash
    yarn start
    ```

    Die Anwendung wird in der Regel auf `http://localhost:3000/` oder `http://localhost:3001/` (abhängig von deiner Konfiguration) erreichbar sein.

---

## Konfiguration

Je nachdem, wie du dein Frontend konfigurierst, kann es erforderlich sein, den **API-Endpunkt** des Backends festzulegen.  
Falls du eine `.env`-Datei verwendest, könntest du dort etwa Folgendes eintragen:

```bash
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

> **Wichtig**: Achte darauf, den tatsächlichen Host und Port deines Backends anzugeben (z. B. Production-/Staging-URL).

---

## Integration mit dem Backend

-   **API-Aufrufe**: In den `services/`-Dateien werden die Endpunkte des Backends (z. B. `/api/login`, `/api/product`, `/api/sales`) aufgerufen.
-   **JWT-Handling**:
    -   Bei erfolgreichem Login erhältst du einen **JWT** (JSON Web Token).
    -   Dieser sollte in lokalem Speicher (z. B. `localStorage`, `sessionStorage`) oder einem globalen State verwaltet werden, um ihn bei Bedarf im `Authorization`-Header (`Bearer <TOKEN>`) mitzusenden.

---

## Routing & Screens

Üblicherweise arbeitet man im Frontend mit einem **Router** (z. B. `react-router-dom` bei React). Folgende Screens könnten exemplarisch vorhanden sein:

1. **Login**
    - Formular für E-Mail/Passwort, Kommunikation mit `/api/login`.
2. **Dashboard**
    - Zeigt eine Kurzübersicht über Lagerbestände, neue Bestellungen etc.
3. **Produkte**
    - Liste aller Produkte, Filter/Suche, Detailansicht für ein Produkt.
4. **Bestellungen (Purchase Orders)**
    - Auflistung von getätigten Bestellungen, Detailansicht und Status.
5. **Wareneingänge (Goods Receipts)**
    - Verwaltung und Erfassung von Wareneingängen.
6. **Verkäufe (Sales Orders)**
    - Übersicht über Verkaufsaufträge.
7. **Complaints / Returns**
    - Verwaltung von Beschwerden und Retouren.

---

## Lizenz

Dieses Projekt ist Teil der Bachelorarbeit von Aysenur Yoleri. Genaue Lizenzbedingungen sind derzeit nicht festgelegt. Für eventuelle Wieder- oder Weiterverwendung wende dich bitte an die Projektverantwortlichen.
