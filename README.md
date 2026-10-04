# project-lead

[Deutsche Version](README.de.md)

A skill that makes Claude the lead of your projects. You set the goal and the limits. Claude plans the steps, hands them to subagents, checks every result itself and keeps one `PROJECT.md` per project. Several projects can run side by side, and with a schedule they keep moving while you are away. You get pulled in when a decision is yours.

It is built for work without code: customer events, offers and tenders, market research, campaigns, board decks, hiring rounds. Software projects work too.

## Checking results

The most important part is the checking. A worker's "done" is where the checking starts. Claude opens the deck, recalculates the offer, clicks the links, finds the quote in the cited source. A step is closed when every check has passed, and anything Claude could not check stays visible as unchecked.

## Features

- Kickoff with goal, a finished-list you can tick off, deadline, budget and approvals
- Steps that each end in something you can open and judge
- Written briefs to subagents, with independent steps running in parallel
- Checks by type of result: deck, research, offer, event plan, campaign, spreadsheet, text, software
- Failed checks go back to the worker with exact findings; after the third failed round on the same point, you decide
- One PROJECT.md per project, so a later session picks up where the last one stopped
- A board across all projects, built by a small script
- Scheduled runs that continue the work and send you at most one short message each
- Sending, booking, spending, publishing and deleting only after your OK

## Install

**Claude Code**

```bash
git clone https://github.com/jonasmuc1000/project-lead ~/.claude/skills/project-lead
```

For a single project, clone into `.claude/skills/project-lead` inside that project instead.

**Claude apps (Claude.ai, Cowork)**

Download the repository as ZIP and upload it in the Skills section of your Claude settings.

## Usage

Start with what you want and let Claude ask the rest:

> Lead this: customer evening in Munich on 19 Nov, about 60 guests, budget 9,000 EUR.

> Where do my projects stand?

> Keep the market scan going every weekday at 9 and only ping me for decisions.

## PROJECT.md and the board

Each project lives in its own folder with a `PROJECT.md`: goal, finished-list, limits, a steps table, open questions and a dated log. The template is at the end of [SKILL.md](SKILL.md), two filled-in examples are in [examples](examples).

The board script reads all of them and prints one line per project:

```bash
npx tsx scripts/board.ts examples
```

```
| Project | Status | Checked | Current step | Due | Questions | Last log |
| --- | --- | --- | --- | --- | --- | --- |
| Market scan: AI quality inspection vendors DACH | waiting | 2/4 | #3 Price research (blocked) | 2026-10-10 | 1 | 2026-10-04: Step 3 blocked after three rounds. Options sent to owner. |
| Customer evening Munich | active | 2/6 | #3 Draft invitation email and registration page text (review) | 2026-11-19 | 2 | 2026-10-04: Steps 3 and 4 sent out. Waiting on the booking decision. |
```

Below the table it lists every open question. Add `--json` for the raw data. Needs Node 20 or newer, no dependencies.

## Files

```
SKILL.md                      the skill
scripts/board.ts              portfolio board from PROJECT.md files
examples/customer-event/      event project, mid-way
examples/market-scan/         research project, waiting on a decision
```

## License

MIT
