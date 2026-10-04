# ai-project-leader

[English version](README.md) · **Website:** [jonasmuc1000.github.io/ai-project-leader](https://jonasmuc1000.github.io/ai-project-leader/)

Ein Skill, mit dem Claude deine Projekte leitet. Du gibst Ziel und Rahmen vor. Claude plant die Schritte, gibt sie an Subagenten, prüft jedes Ergebnis selbst und führt pro Projekt eine `PROJECT.md`. Mehrere Projekte laufen parallel, und mit einem Zeitplan geht die Arbeit weiter, während du anderes zu tun hast. Gefragt wirst du, wenn eine Entscheidung bei dir liegt.

Gedacht ist der Skill vor allem für Projekte ohne Code: Kundenevents, Angebote und Ausschreibungen, Marktrecherchen, Kampagnen, Vorstandspräsentationen, Recruiting. Softwareprojekte funktionieren genauso.

## Prüfung der Ergebnisse

Der wichtigste Teil ist die Prüfung. Meldet ein Worker „fertig“, fängt die Prüfung erst an. Claude öffnet das Deck, rechnet das Angebot nach, klickt die Links durch und sucht das Zitat in der angegebenen Quelle. Ein Schritt ist abgeschlossen, wenn alle Prüfpunkte bestanden sind. Was Claude nicht prüfen konnte, bleibt als ungeprüft sichtbar.

## Funktionen

- Kickoff mit Ziel, abhakbarer Fertig-Liste, Termin, Budget und Freigaben
- Schritte, die jeweils in etwas enden, das man öffnen und beurteilen kann
- Schriftliche Briefings an Subagenten; unabhängige Schritte laufen parallel
- Prüfung je nach Ergebnis: Deck, Recherche, Angebot, Eventplan, Kampagne, Tabelle, Text, Software
- Bei Mängeln geht der Schritt mit genauen Befunden zurück an den Worker; scheitert derselbe Punkt dreimal, entscheidest du
- Eine PROJECT.md pro Projekt, damit eine spätere Session dort weitermacht, wo die letzte aufgehört hat
- Ein Statusboard über alle Projekte, erzeugt von einem kleinen Skript
- Geplante Läufe, die weiterarbeiten und dir pro Lauf höchstens eine kurze Nachricht schicken
- Verschicken, Buchen, Bezahlen, Veröffentlichen und Löschen nur nach deiner Freigabe

## Installation

**Claude Code**

```bash
git clone https://github.com/jonasmuc1000/ai-project-leader ~/.claude/skills/ai-project-leader
```

Für ein einzelnes Projekt stattdessen nach `.claude/skills/ai-project-leader` im Projektordner klonen.

**Claude-Apps (Claude.ai, Cowork)**

Repository als ZIP herunterladen und im Bereich Skills der Claude-Einstellungen hochladen.

## Benutzung

Am besten mit dem Ziel anfangen und Claude den Rest erfragen lassen:

> Leite das: Kundenabend in München am 19.11., rund 60 Gäste, Budget 9.000 EUR.

> Wie stehen meine Projekte?

> Treib die Marktrecherche werktags um 9 Uhr weiter und melde dich nur bei Entscheidungen.

Die Skill-Anweisungen sind auf Englisch, Claude antwortet trotzdem in deiner Sprache.

## PROJECT.md und Statusboard

Jedes Projekt hat einen eigenen Ordner mit einer `PROJECT.md`: Ziel, Fertig-Liste, Rahmen, Schritttabelle, offene Fragen und ein datiertes Log. Die Vorlage steht am Ende der [SKILL.md](SKILL.md), zwei ausgefüllte Beispiele liegen unter [examples](examples).

Das Board-Skript liest alle Dateien ein und gibt pro Projekt eine Zeile aus, darunter alle offenen Fragen:

```bash
npx tsx scripts/board.ts examples
```

Mit `--json` kommen die Rohdaten. Voraussetzung ist Node 20 oder neuer, weitere Abhängigkeiten gibt es nicht.

## Lizenz

MIT
