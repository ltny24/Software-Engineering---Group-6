# SpecKit — Spec-Driven Development Tool

SpecKit is a specification-driven development methodology using GitHub Copilot slash commands. Specs are the source of truth — code is a derived artifact.

## Folder Structure

```
speckit/
├── .specify/
│   └── memory/
│       └── constitution       ← Project principles, tech stack, coding standards
├── specs/
│   └── portal/ ← Current feature spec
│       ├── spec.md            ← Requirements, user stories, acceptance criteria
│       ├── plan.md            ← Technical implementation plan
│       ├── tasks.md           ← Ordered task checklist (phased)
│       ├── data-model.md      ← Entity definitions and relationships
│       ├── quickstart.md      ← Dev environment setup guide
│       ├── research.md        ← Architecture decision records
│       ├── checklists/
│       │   └── requirements   ← QA quality gate checklist
│       └── contracts/
│           └── api-contracts  ← REST API endpoint definitions
└── README.md                  ← This file
```

## Workflow (7 Steps)

| Step | Command | What It Does |
|------|---------|-------------|
| 1. Constitution | `/speckit.constitution` | Define project principles, tech stack, quality rules |
| 2. Specify | `/speckit.specify` | Generate feature spec from plain-language description |
| 3. Clarify | `/speckit.clarify` | AI asks follow-up questions to resolve ambiguities |
| 4. Plan | `/speckit.plan` | Create technical implementation plan from the spec |
| 5. Tasks | `/speckit.tasks` | Break plan into ordered, actionable dev task checklists |
| 6. Analyze | `/speckit.analyze` | Cross-check consistency across all artifacts |
| 7. Implement | `/speckit.implement` | Generate actual code based on the tasks |

## Prerequisites

1. Install [uv](https://docs.astral.sh/uv/):
   ```bash
   # Windows
   winget install --id=astral-sh.uv -e

   # macOS / Linux
   brew install uv
   ```

2. Initialize in project root:
   ```bash
   uvx --from speckit init
   ```

3. Fill in the constitution:
   ```
   /speckit.constitution
   ```

## Creating a New Feature Spec

1. Create a new Git branch: `git checkout -b 002-my-feature`
2. Describe your feature in plain language
3. Run: `/speckit.specify <your feature description>`
4. Run: `/speckit.clarify` — answer AI questions
5. Run: `/speckit.plan` — generates technical plan
6. Run: `/speckit.tasks` — creates dev task checklist
7. Run: `/speckit.analyze` — validates consistency
8. Run: `/speckit.implement` — generates code

Each spec lives under `specs/<NNN-feature-name>/` on its own branch.

## Current Project Spec

**001-university-portal** — MyUS University Portal System

| Artifact | Status |
|----------|--------|
| spec.md | 14 functional requirements, 3 user stories, acceptance criteria |
| plan.md | 11 system modules, React + Spring Boot + SQL Server |
| tasks.md | 58 tasks, Phase 1-3 complete (T001-T027), Phase 4-6 pending |
| data-model.md | 13 entities (Student, Course, Appeal, Grade, etc.) |
| api-contracts | 12 REST endpoint groups with request/response shapes |
| constitution | v2.0.0, ratified 2026-06-02 |

## Key Conventions

- **Naming**: `NNN-feature-name` (e.g., `001-university-portal`)
- **Branch per spec**: Parallel development
- **Constitution first**: All PRs must reference compliance
- **Checklist gate**: Run analyze before implementing
- **No clarification placeholders**: Resolve all `[NEEDS CLARIFICATION]` before planning
