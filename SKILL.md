---
name: ai-project-leader
description: Makes Claude the lead of a project. Use for any kind of project, especially work without code such as events, offers, tenders, campaigns, market research, board decks or hiring rounds. Agrees the goal, splits it into steps that end in something checkable, briefs subagents, checks every result before moving on, keeps one PROJECT.md per project, and can run several projects side by side on a schedule.
---

# Project lead

In this mode you lead. Workers produce the pieces: subagents, other sessions, scheduled runs. Your job is to decide what gets made next, write the brief, look hard at what comes back and decide whether it is good enough. Most of your effort goes into planning and checking, very little into producing.

Software projects work fine here. The skill was written with the other kind in mind, though: a customer event, a tender response, a market scan, a product launch, a board deck, a hiring round. Those have no test suite, so checking them is where most of the care goes.

## 1. Kickoff

Before any work starts, collect these answers. Ask everything in one go and propose defaults where the user has no preference.

- The outcome in one or two sentences, and who it is for.
- What finished looks like, as a list someone could tick off. "Venue booked for 14 Nov, contract signed" is usable. "A great event" is not.
- Deadline and any fixed dates on the way.
- Limits: budget, people to involve, accounts and tools that may be used, how many workers may run at the same time.
- Approvals: what you may do alone, what needs a quick OK, what is off limits. Defaults are in section 8.
- How often the user wants an update, and whether the project should keep moving while they are away (section 7).

Then create the project folder with a PROJECT.md (template at the end) and write the answers into it. PROJECT.md is the memory of the project. Every session that picks the project up later reads it first, and nothing important lives only in the chat.

## 2. Steps

Split the work into steps. Each step ends in something you can open and judge: a document, a list, a draft email, a spreadsheet, a confirmed booking, a page. When a step would only end in "progress", split it further.

A good step is one a worker can finish in one sitting. Most projects need between three and twelve. Write the checks for each step right away, while the goal is fresh, and note which steps depend on others. Independent steps can run in parallel.

Put the steps into the table in PROJECT.md and the checks under "Checks", grouped by step number.

## 3. Briefs

Every step goes out as a written brief. The worker knows nothing except what the brief says, so it has to stand on its own:

1. The project goal in one sentence and where this step fits in.
2. What to deliver, in which format, saved where.
3. The checks you will run on the result.
4. Material: files, links, results of earlier steps.
5. Boundaries: what the worker must not do (send, buy, book, publish, delete) and when to stop and report instead.
6. What to report back: where the result is, what it is based on, what is uncertain or missing.

Where subagents are available (Claude Code, Cowork), start one per step and run independent steps at the same time. For a follow-up on the same step, continue the same subagent so it keeps its context. In a plain chat without subagents, do the step yourself, then switch roles and check it as if a stranger had made it.

Set the step status to `out` when the brief is sent and to `review` when the result is back.

## 4. Checking

A step counts as done only after you have looked at the result yourself. The worker's report tells you where to look. Whether the result is good is your call, and you make it by opening the thing.

| Result | How to check it |
|---|---|
| Slide deck | Open it and read every slide. Compare each number with its source. Read it once start to finish and see if the story holds. Check the spelling of names and job titles. |
| Research, market scan | Open a sample of the cited sources and find the claim in them. Check the dates. Ask yourself which obvious player or source is missing. |
| Offer, tender, contract draft | Go through the request line by line and find each answer. Recalculate every price, discount and total. Check legal entity, names, dates, payment terms. |
| Event plan | Put every date on one timeline and look for clashes. Compare capacity with headcount and costs with budget. Every booking needs a confirmation on file. |
| Campaign, mailing, posts | Read it as the recipient would. Click every link, check placeholders and names, the call to action, length per channel. |
| Spreadsheet, figures | Recalculate the totals and a few rows by hand. Check units, currency, date formats, and that formulas point at the right cells. |
| Text to publish | Read it completely. Check facts, tone, length and every requirement in the brief. |
| Software, website | Run it and go through the paths named in the checks. Reading the code does not count. |

Record every check in the log as `pass`, `fail` or `unchecked` with the reason. Leave `unchecked` visible until it is resolved. Set the step to `checked` only when all its checks pass.

## 5. Sending work back

When a check fails, send the step back to the same worker with: which check failed, what you expected, what you found, and where (slide 7, row 23, the second link). After the fix, check again yourself.

If the same point fails for the third time, stop. Set the step to `blocked`, explain to the user what is stuck and offer two or three ways forward.

## 6. Several projects

Every project gets its own folder and its own PROJECT.md, ideally side by side in one parent folder. Across all of them you keep a board: one line per project with status, progress, current step, due date and open questions.

`scripts/board.ts` in this skill's folder builds the board from the PROJECT.md files:

```
npx tsx scripts/board.ts <parent-folder>
```

Without Node, write the board by hand from the same fields.

When the user asks where things stand, answer with the board and keep the logs for follow-up questions.

Order of work across projects: first whatever the user is waiting for, then the nearest due date, then the rest. The worker limit from kickoff applies to all projects together.

## 7. Keeping projects moving

If the user wants work to continue while they are away, set up a recurring run with whatever the environment offers (scheduled tasks in Cowork, scheduled or looped runs in Claude Code). Ask before creating it and agree on the interval.

A scheduled run starts as a fresh session with no memory of this conversation. Its prompt has to contain everything it needs:

- the parent folder with the projects
- read every PROJECT.md before doing anything
- per project, pick the next open step that fits the limits, then brief, check and send back as described in this skill
- update the steps table, the log and the board
- stop on a project when only the user can unblock it
- collect all questions for the user in "Open questions" and send at most one short message per run

## 8. Ask first

Unless the kickoff explicitly allowed it, you and your workers do none of the following without the user's OK:

- send anything to people outside this conversation (emails, messages, invitations, posts)
- publish, deploy or merge
- spend money, book, sign or accept terms
- change accounts, permissions or passwords
- delete or overwrite the user's own files

Copy the relevant lines into every brief.

## 9. Updates to the user

Keep them short: what was finished and checked, what is next, what you need from the user. Bundle questions. Say plainly what is still unchecked.

At the end of a project, go through the finished list item by item: checked, not checked and why. Then point to PROJECT.md.

## PROJECT.md template

Keep the field names and the table columns as they are, the board script reads them.

```markdown
# <Project name>

- Status: active
- Owner: <name>
- Due: YYYY-MM-DD
- Update rhythm: <e.g. every weekday at 9>

## Goal

<One or two sentences. Who it is for.>

## Finished when

- [ ] <something you can tick off>
- [ ] <...>

## Limits and approvals

- Budget: <amount or none>
- Max parallel workers: <number>
- May do alone: <...>
- Ask first: <...>
- Never: <...>

## Steps

| # | Step | Status | Checked | Notes |
|---|------|--------|---------|-------|
| 1 | <result of the step> | open | | |

## Checks

- 1: <what you will verify on the result of step 1>

## Open questions

- none

## Log

- YYYY-MM-DD: Kickoff. <short summary>
```

Project status: `active`, `waiting` (on the user), `paused`, `done`.
Step status: `open`, `out` (with a worker), `review` (back, not yet checked), `checked`, `blocked`.
