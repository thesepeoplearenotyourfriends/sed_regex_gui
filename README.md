<img width="733" height="564" alt="image" src="https://github.com/user-attachments/assets/596b8a93-f405-4bb2-b5fb-3cecfa087476" />
<img width="1054" height="616" alt="image" src="https://github.com/user-attachments/assets/6a19b2ab-2aca-4418-b32b-3c23e32d5859" />

----

**"Installation"**

just copy index.html to a local dir and open it in your browser!

----

## Ordered Changelog

### PR #1 — Build a single-file sed regex workbench

- Created the first self-contained `index.html` app so the workbench can run locally in any browser with no build step or dependencies.
- Added a live sed command input, victim-text editor, and output preview for experimenting with common sed patterns.
- Implemented parsing and explanation cards for quiet mode, line and regex addresses, address ranges, print/delete commands, and substitution commands.
- Added colored command-anatomy chunks that synchronize with explanation cards on hover.
- Persisted the current sed command and victim text in local storage so practice sessions survive reloads.

### PR #2 — Revise the app into a resizable workbench

- Reworked the interface into a full-height workbench with separate toolbar, anatomy strip, input/output panes, and reference pane.
- Added draggable row and column resizers so the command anatomy/reference area and input/output split can be adjusted while learning.
- Introduced light, dark, and auto theme behavior with persisted preferences.
- Improved responsive behavior so the workbench remains usable on smaller screens.
- Refined pane labels, focus states, and hover affordances for a clearer learning flow.

### PR #3 — Add the searchable Pattern Trainer

- Added a Pattern Trainer dialog for discovering sed commands, regex fragments, and plain-English intent examples.
- Seeded the trainer with a searchable collection of practical recipes and snippets.
- Added category/type filtering, support-level labeling, and result counts to make the pattern library easier to browse.
- Implemented snippet insertion and replacement actions so selected examples can be applied directly to the command input.
- Added pinned-pattern support with a bookmarks menu for quickly revisiting favorite recipes.

### PR #4 — Expand and improve Pattern Trainer recipes

- Expanded the trainer library with many more examples covering deletion, replacement, ranges, extraction, cleanup, validation, and text-shaping workflows.
- Added richer metadata, tags, aliases, and placeholders so searches can match both syntax and user intent.
- Improved snippet actions for inserting fragments at the cursor or replacing the whole command when appropriate.
- Clarified support notes for examples that are live, partially simulated, shell-oriented, or reference-only.
- Improved empty-state guidance to suggest useful searches when no trainer results match.

### PR #5 — Grow the Pattern Trainer reference set

- Increased the Pattern Trainer reference library toward a larger 150+ entry catalog.
- Broadened coverage across sed addresses, substitutions, regex fragments, capture groups, anchors, character classes, and common maintenance tasks.
- Added more external and reference-only entries for real-world sed usage that the browser simulator does not execute directly.
- Improved scoring and filtering so live/partial examples are prioritized while advanced reference entries remain discoverable.
- Added placeholder metadata to make reusable recipe variables such as patterns, replacements, and filenames easier to identify.

### PR #6 — Upgrade sed regex explanations

- Added semantic explanation rules that translate common sed regex patterns into plain-English meanings.
- Improved pattern and replacement explanations for anchors, digit classes, whitespace, capture groups, escaped literals, wildcards, and backreferences.
- Added command-level summaries so users can understand what the full sed expression is intended to do, not just each token.
- Strengthened parser feedback for malformed or unsupported sed syntax.
- Connected trainer snippets to the explanation engine so recipe cards can display clearer meaning hints.

### PR #7 — Improve semantic sed explanations

- Expanded the semantic rules for common substitutions, deletions, selections, comments, blank lines, repeated words, and line-cleanup patterns.
- Made command summaries more specific by combining address, command, pattern, replacement, and flag context.
- Improved explanation text for global replacements, print/delete behavior, quiet mode, and address-scoped commands.
- Added more robust wording for regular-expression fragments that appear inside trainer entries and anatomy cards.
- Reduced generic explanations in favor of intent-focused language that better answers “what will this command do?”

### PR #8 — Refactor around a dialect registry

- Refactored the workbench to route parsing, execution, summaries, defaults, storage keys, and trainer entries through a dialect registry.
- Established sed as the active registered dialect while making the architecture ready for additional command or regex dialects.
- Moved sed-specific behavior behind dialect capabilities, labels, default text, default expression, parser, executor, and trainer hooks.
- Updated trainer entry filtering so entries can be scoped to the active dialect.
- Renamed generic workbench storage and UI plumbing so future dialects can coexist without colliding with sed-specific state.
