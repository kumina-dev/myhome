# AGENTS.md

## Purpose

This repository is an Android application for shared daily life management between trusted users such as families, partners, close friends, flatmates, and other small private groups.

The product must feel like a real polished app, not a prototype, throwaway demo, or test build. All work should support a clean, production-minded result with minimal unnecessary complexity.

## Core working rules

- Do not edit files directly.
- Do not apply patches automatically.
- Do not modify the workspace.
- Do not write changes into the codebase yourself.
- Always return proposed changes for manual application by the developer.

## Required output format

When asked to plan, implement, refactor, or add features, return only:

1. A short implementation plan
2. A list of files to create, change, move, or remove
3. Unified diffs for changed files
4. Full file contents for any new files

Additional rules:
- Do not return vague summaries instead of concrete edits.
- Do not silently skip required file changes.
- Do not perform workspace mutations.
- Do not return placeholder code unless explicitly requested.
- Do not mix planning output with unrelated explanation.
- Do not claim something is implemented unless the exact file-level changes are shown.

## Product constraints

- Platform: Android only
- Language: TypeScript is required
- Expo must not be used
- Avoid large or unnecessary dependencies
- Prefer small, practical, maintainable solutions
- Prefer custom-branded UI over generic template-like UI
- Build for a private, trusted group, not a public social product
- Preserve a polished, serious, product-like feel in architecture and UI decisions

## Code organization rules

- Keep files short and focused.
- Prefer splitting code into small, purpose-specific files instead of large multi-responsibility files.
- Avoid files that mix screen logic, business logic, data mapping, navigation setup, UI components, and styling unless there is a strong reason.
- Avoid oversized screen files.
- Extract duplicated logic when duplication appears across screens, features, or components.
- Prefer shared helpers, hooks, mappers, constants, formatting utilities, and UI primitives over copy-paste reuse.
- Do not create abstractions preemptively; only extract when reuse or clarity is real.
- Prefer feature-local organization first, then shared modules only when multiple features truly need them.
- Keep closely related code together when splitting would reduce clarity.
- Do not leave React Native template files, placeholder files, dead scaffolding, or starter-app leftovers in the repository.
- Every file in the repository should clearly correspond to the actual app.

## UI and styling rules

- The UI must feel custom, polished, and visually distinctive.
- Avoid generic default mobile UI, default React Native starter styling, and common dark-theme or light-theme blue gradient template aesthetics.
- Do not fall back to the typical generic dark app with a bluish accent and minimal effort styling.
- The visual direction should feel deliberate, memorable, premium, and product-like.
- Prefer strong contrast, intentional accent colors, clear hierarchy, refined typography, disciplined spacing, and memorable surfaces.
- The app may use dark or light foundations, but the result must not feel like a stock template.
- Use a shared global theme and shared design tokens for colors, spacing, typography, radius, border treatments, elevation, and motion values.
- Keep screen-specific styles close to the screen unless those styles are reused.
- Shared styles, tokens, and theme logic should live in dedicated global styling files.
- Reusable UI components should own their own local styles when appropriate.
- If a style pattern repeats, extract it instead of duplicating it.
- Prefer a cohesive style system over ad hoc one-off styling.
- Prefer visually strong but controlled design over noisy, gimmicky, or overdesigned UI.

## Internationalization rules

- Do not hard-code user-facing strings in components or screens.
- Use a proper internationalization structure for all user-facing text.
- Existing locale support must not remain Finland-only.
- Dates, numbers, currencies, labels, actions, validation text, empty states, and system messages must be prepared for localization.
- Prefer translation keys organized by feature or domain.
- Keep locale-sensitive formatting separate from presentation where possible.
- Do not assume Finnish-only copy, Finnish-only locale defaults, or Finland-only data assumptions unless explicitly required by the feature.

## Asset readiness rules

- Keep the app ready for custom branded assets such as app icon, splash assets, tab icons, action icons, onboarding illustrations, empty-state illustrations, and other feature-relevant assets.
- When assets are missing and a screen clearly benefits from them, explicitly recommend the required asset files and their intended usage.
- For each recommended asset, provide:
  - a clear filename suggestion
  - where it is used
  - its purpose
  - preferred aspect ratio or size guidance when relevant
  - whether it is required now or can be deferred
- When recommending assets, also provide ChatGPT-ready image prompts that can be used to generate them.
- Do not invent unnecessary assets for screens that do not benefit from them.
- Prefer assets that materially improve UX, clarity, onboarding, navigation, or product identity.

## Onboarding and UX rules

- Do not keep onboarding flows that add no real value.
- If onboarding only redirects users to auth choices that can be handled inside auth, prefer simplifying or removing it.
- Keep entry flows intentional, minimal, and product-like.
- If onboarding is kept, it must provide actual user value such as setup guidance, invite/group explanation, feature framing, or branded first-run experience.

## Product vision

The app is a shared life management app for:
- families
- partners
- flatmates
- close friends
- other small trusted groups

The product combines shared coordination and personal tracking in one cohesive experience.

The product may include features such as the following.

### 1. Shared expense tracking

Users can log purchases with:
- who bought it
- what was bought
- how much it cost
- when it was purchased
- optional category
- optional notes

The app should support monthly spending visibility, including:
- totals by category
- totals by user
- totals by time period
- clear understanding of where money goes

### 2. Shared notes

- Fast and practical shared notes
- Useful for daily planning and communication
- Pinned or important notes are desirable

### 3. Shared calendar

- Shared calendar with color-coded events
- Supports schedules, plans, reminders, and important dates
- Useful for everyday coordination
- Import and export support may be desirable when relevant

### 4. Chore / todo / task system

The task system should support both:
- shared tasks for the group
- individual tasks for a specific user

Examples:
- Shared: taking out trash, cleaning shared spaces, buying essentials
- Individual: brushing teeth, exercising, personal routines

Task system rules:
- The system may be used for chores, recurring routines, reminders, or normal todos
- Points are optional depending on the task type and feature scope
- Due dates are optional depending on the task type and feature scope
- The product should not force every task into a deadline-driven or gamified model
- Completing tasks may award points to create light competition when that behavior is enabled
- If scoring is enabled, the scoring cycle may reset depending on product settings such as 7, 14, or 28 days
- History must be preserved for past cycles when scoring is used

### 5. Notifications

Notifications are a core feature, not a side extra.

Support useful alerts such as:
- upcoming calendar events
- completed or overdue chores or tasks
- new notes
- personal task reminders
- shared task updates
- important expense-related activity

### 6. Deep settings

Settings must be meaningful and fairly extensive, not a placeholder screen.

Settings should cover:
- notification behavior
- theme and appearance
- category management
- checklist and score cycle rules
- task behavior for shared and personal items
- default views
- user preferences
- group-related behavior
- other real customization options that improve product quality

## Engineering principles

- Keep architecture extensible without overengineering.
- Prefer clarity over cleverness.
- Prefer explicit structures over magic abstraction.
- Avoid unnecessary framework worship.
- Avoid dependency bloat.
- Avoid demo-app shortcuts that make later growth painful.
- Prefer feature-local changes over broad rewrites when possible.
- Build a strong MVP before expanding scope.
- Prefer concrete implementations over architecture theater.

## Scope discipline

When proposing implementation:
- separate must-have from nice-to-have
- do not bundle too many features into one change unless explicitly requested
- keep feature boundaries clear
- prefer incremental progress over speculative rewrites
- do not expand scope beyond the requested task
- if a task can be completed without introducing new architecture, do not introduce it

## Decision rules

When multiple valid implementation options exist:
- choose the one with the least unnecessary complexity
- choose the one that preserves future maintainability
- choose the one that fits Android-only + TypeScript + no Expo constraints
- keep assumptions minimal
- state assumptions briefly when necessary
- do not invent requirements that were not requested
- do not be vague when concrete implementation choices are possible and justified

## Implementation boundaries

- Do not introduce backend requirements unless the requested feature clearly needs them.
- Do not add authentication, sync, analytics, cloud features, or background systems unless explicitly requested or functionally required.
- Do not replace existing libraries or patterns without a concrete reason.
- Do not introduce architectural layers only for style or theory.
- Do not refactor unrelated code.
- Do not rewrite working code without a concrete reason.
- Do not add libraries when built-in or existing project solutions are enough.
- Do not leave implementation details hand-wavy when the task requires specific file-level changes.

## Behavior rules for agents

- Read the existing codebase before proposing changes.
- Respect the current project structure unless a structural change is necessary to support the requested feature.
- Preserve existing conventions when they are reasonable.
- Keep proposed changes reviewable and easy to apply manually.
- Prefer concrete implementation over abstract planning when code changes are requested.
- Prefer complete, directly usable diffs over conceptual pseudo-solutions.
- If recommending style changes, describe the intended visual system clearly rather than using vague adjectives only.
- If recommending assets, provide explicit asset recommendations and ChatGPT-ready prompts for generating them.

## What to optimize for

Optimize for:
- correctness
- maintainability
- practical UX
- feature clarity
- production-minded structure
- manual reviewability of all proposed changes
- concrete implementation guidance
- distinctive but controlled visual quality

Do not optimize for:
- hype
- novelty
- unnecessary abstraction
- dependency-heavy convenience
- fake scalability theater
- architectural churn
- generic starter-app aesthetics

## Default task flow

For feature work, use this order:

1. Understand the requested feature
2. Identify minimal assumptions
3. Propose a concise implementation plan
4. List affected files
5. Provide unified diffs for existing files
6. Provide full contents for new files

## Final instruction

You are not here to behave like an autonomous intern with write access.

You are here to inspect the codebase, reason carefully, and propose precise, concrete, reviewable changes that the developer will apply manually.