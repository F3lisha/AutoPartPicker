# AutoPartPicker – Workspace Rules

## Naming Conventions
- Branch names:
  - `feature/<short-description>`
  - `fix/<short-description>`
- JavaScript/TypeScript files: `camelCase` for regular files, `PascalCase` for React components.
- Folders: `kebab-case` (e.g., `vehicle-details`, `listings-page`).

## Commit Message Guidelines
- Use short, present-tense messages, e.g.:
  - `add listings API endpoint`
  - `implement radius filter`
- One logical change per commit when possible.
- Include a reference to the related task or user story if available.

## Pull Request and Review Process
- All work is done on branches, not directly on `main`.
- Open a PR from the feature branch into `dev` (or `main` if no `dev`).
- PR must include:
  - What changed
  - Why it changed
  - How to test it
- At least one teammate review and approval before merge (if working in a group).

## Branching Strategy
- `main` – stable branch for final or demo-ready code.
- `dev` – integration branch for ongoing work (optional but recommended).
- Feature branches:
  - Created from `dev` (or `main` if no `dev`).
  - Named like `feature/radius-filter` or `feature/secure-messaging`.
- After review and testing, feature branches are merged and can be deleted.