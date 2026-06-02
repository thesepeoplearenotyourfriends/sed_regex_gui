# Sed Regex GUI

A dependency-free browser workbench for learning and testing small text-processing ideas in a single local HTML file.

## What it is

Sed Regex GUI is a local, single-file app that runs entirely in the browser. It currently has two modes:

- **sed mode** — a live sed-ish command analyzer and transformer for common `p`, `d`, and `s/pattern/replacement/flags` workflows.
- **bash mode** — a Bash-ism analyzer/demonstrator for selected Bash syntax and expansions.

The project intentionally stays small and portable: no npm, no CDN assets, no external dependencies, no WASM shell, and no bundled fake Linux environment.

## Installation / running

Open `index.html` directly in a browser from a local checkout or copied folder.

You can also use the GitHub Pages build at:

https://thesepeoplearenotyourfriends.github.io/sed_regex_gui/

## Modes

### sed mode

Sed mode explains the anatomy of supported sed-style commands, previews matching text, and applies the supported transformation to the victim text pane. It focuses on common command shapes such as:

- substitutions like `s/[0-9]\+/NUM/g`
- print/delete commands with simple addresses
- regex fragments and replacement-side backreferences in the Pattern Trainer

Sed mode is still a browser simulator for the supported subset, not a replacement for every sed implementation or flag.

### bash mode

Bash mode is intentionally **not a terminal**. It explains and demonstrates common Bash syntax, special parameters, quoting, arrays, functions, conditionals, builtins, and shell options without pretending to be a full shell.

The Bash View keeps one compact caveat visible: selected expansions only; not a full shell. Live demonstrations use small JavaScript transforms for cases the app can honestly model, such as positional parameters, quoted `"$@"`, unquoted `$@` hazards, `"$*"`, simple `set --`, simple `shift`, and simple literal array expansion.

## Bash limits

Bash mode does **not**:

- execute arbitrary Bash
- launch external Unix tools
- provide a browser terminal or fake Linux environment
- use a WASM shell
- inspect or mutate the real filesystem, process table, job table, shell options, or environment

Reference and partial cards are still useful: they document Bash syntax and point out when a real Bash shell is required for exact behavior.

## Trainer

The trainer changes with the active mode.

- **Pattern Trainer** in sed mode includes command recipes, regex fragments, substitutions, cleanup examples, and portability notes.
- **Bash Ism Trainer** in bash mode includes special parameters, quoting, parameter expansion, variables, arrays, functions, conditionals, loops, builtins, shell options, and redirection/reference syntax.
- Entries can be bookmarked/pinned with the heart/bookmark control.
- Filters cover category, type, and support level. Bash defaults to showing all support levels so reference and partial Bash cards remain discoverable.

Support levels are intentionally explicit:

- **live** — the app has a useful live demonstration.
- **partial** — the app can explain the syntax or part of the behavior, but not fully execute it.
- **reference-only** — informational syntax card for behavior that requires a real shell.
- **external** — behavior depends on real external shell/OS state such as files, processes, jobs, or terminals.

## Ordered Changelog

### PR #1 — Build a single-file sed regex GUI

- Added the initial dependency-free `index.html` browser app.
- Added a sed command input, victim text pane, output pane, and command anatomy view.
- Implemented the first supported sed substitution workflow.

### PR #2 — Improve sed workbench ergonomics

- Improved layout, controls, and command feedback.
- Added stronger examples and clearer labels around victim text and output.
- Kept the app runnable as a copied local HTML file.

### PR #3 — Add command history and quality-of-life behavior

- Added local browser persistence for recent commands and workbench state.
- Improved reset/default behavior.
- Tightened supported-command messaging.

### PR #4 — Add Pattern Trainer

- Added a trainer panel for discovering sed commands, recipes, and regex fragments.
- Added searching, filtering, and insertion actions for trainer entries.
- Added support-level metadata so live, partial, external, and reference examples can be represented honestly.

### PR #5 — Expand sed recipes and reference cards

- Added more sed trainer entries for substitutions, cleanup, addresses, and real-world sed usage that the browser simulator does not execute directly.
- Improved scoring and filtering so live/partial examples are prioritized while advanced reference entries remain discoverable.
- Added placeholder metadata to make reusable recipe variables such as patterns, replacements, and filenames easier to identify.

### PR #6 — Upgrade sed regex explanations

- Added semantic explanation rules that translate common sed regex patterns into plain-English meanings.
- Improved pattern and replacement explanations for anchors, digit classes, whitespace, capture groups, escaped literals, wildcards, and backreferences.
- Added command-level summaries so users can understand what the full sed expression is intended to do, not just each token.

### PR #7 — Improve semantic sed explanations

- Expanded semantic rules for common substitutions, deletions, selections, comments, blank lines, repeated words, and line-cleanup patterns.
- Made command summaries more specific by combining address, command, pattern, replacement, and flag context.
- Reduced generic explanations in favor of intent-focused language.

### PR #8 — Refactor around a dialect registry

- Refactored parsing, execution, summaries, defaults, storage keys, and trainer entries through a dialect registry.
- Kept sed as the first registered dialect while preparing the frontend for additional analyzers.
- Scoped trainer entries and UI labels to the active dialect.

### PR #9 — Add dialect-switching frontend

- Added a visible sed/bash dialect switch in the toolbar.
- Added dialect-specific labels, defaults, storage, trainer titles, and empty states.
- Preserved sed behavior while allowing new analyzer modes to share the same single-file workbench shell.

### PR #10 — Add Bash analyzer/demonstrator mode

- Added Bash mode as an analyzer/demonstrator rather than a shell REPL.
- Added the first Bash parser/anatomy pass and selected live demonstrations for positional parameters, quoting, simple shifts, `set --`, and arrays.
- Added the first Bash Ism Trainer entries with honest live/partial/reference support labels.

### PR #11 — Polish Bash analyzer UX, expand Bash isms, and document current state

- Removed repeated global red Bash caveats from the Anatomy pane.
- Kept one compact Bash analyzer caveat in the Bash View while preserving specific warnings such as unquoted `$@` hazards.
- Expanded the Bash Ism Trainer substantially across special parameters, quoting, parameter expansion, variables, arrays, functions, conditionals, loops, builtins, shell options, and redirection/reference syntax.
- Defaulted Bash trainer support filtering to all support levels so useful partial/reference cards are easy to discover.
- Updated this README to describe sed mode, Bash mode, local usage, Bash limits, trainer behavior, and the current changelog.
