---
name: task-json-driver
description: Drive repo work from Task.json. Use this skill whenever you are working inside this project and the conversation is about continuing, fixing, refactoring, auditing, or closing a turn after code changes. Before ending the turn, always inspect Task.json for any task whose isDone is true; if any remain, continue with the next task instead of stopping.
---

# Task JSON Driver

This skill makes `Task.json` the execution queue for this repository.

`Task.md` is documentation only.
If `Task.md` and `Task.json` disagree, always trust `Task.json`.

## Trigger

Use this skill whenever:

- the user says `继续`、`继续修复`、`按顺序做`、`开始下一个任务`
- you are already working on queued engineering tasks in this repo
- you are about to end the current turn after implementing or reviewing code

## Queue rule

Follow the repository convention exactly:

- `isDone: true` means the task is still pending and should continue to be executed
- `isDone: false` means the task has been completed

Do not “correct” this naming. The queue semantics are intentionally inverted for this project.

## Required loop

Before you end any turn in this repository, run this loop:

1. Read `Task.json`.
2. Find tasks whose `isDone` is `true`.
3. If none exist, stop and end the turn normally.
4. If at least one exists, pick the first pending task in file order unless the user explicitly changed priority.
5. Execute that task.
6. After the task is fully completed and verified, update that task’s `isDone` to `false`.
7. Re-read `Task.json`.
8. If more pending tasks remain and the user did not pause or redirect, continue with the next one.

## Execution policy

- Treat `Task.json` as the source of truth for task order.
- Never use `Task.md` as the live status source.
- If a task is too large, split the work internally, but do not rewrite task semantics unless the user asks.
- If you hit a blocker, keep the task as `isDone: true` and explain the blocker clearly.
- If you partially finish a task, keep `isDone: true`.
- Only flip a task to `false` after implementation and the relevant verification are complete.

## Verification rule

When finishing a task, verify with the smallest relevant checks first:

- targeted read-back of touched files
- `pnpm exec tsc --noEmit` when TS behavior changed
- `pnpm build` when routing, bundling, or shared runtime behavior changed
- focused audits or tests when available

Do not mark the task complete before verification.

## File update rule

When you change `Task.json`:

- edit only the affected task entries
- preserve task order unless the user explicitly reprioritizes
- keep the note explaining the project’s `isDone` semantics

## End-of-turn behavior

Never end with “done” just because one patch landed.

At the end of the turn:

- first check whether any `isDone: true` task remains
- if tasks remain, continue with the next one
- if no tasks remain, summarize what was completed and stop
