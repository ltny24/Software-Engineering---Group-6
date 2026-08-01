# Contributing to MyUS University Portal

## Getting Started

1. Clone the repository and switch to a feature branch.
2. Install all dependencies (backend and frontend).
3. Make your changes following the coding conventions.
4. Run lint, tests, and a manual verification before committing.

## Branching Strategy

- `main` — stable, deployable code
- Feature branches: `feature/<short-description>`
- Bug fixes: `fix/<short-description>`
- Refactoring: `refactor/<short-description>`

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
chore:     tooling, dependencies, config
docs:     documentation only
feat:     new feature
fix:      bug fix
refactor: code restructuring without behavior change
test:     adding or updating tests
ci:       CI/CD changes
build:    build system changes
```

## Code Style

### Backend (Java)

- Java 17, follow standard Java conventions.
- Use Lombok to reduce boilerplate (`@Data`, `@Slf4j`).
- Controllers delegate to services; services contain business logic.
- Use constructor-based dependency injection.
- DTOs for API inputs/outputs; entities for persistence.

### Frontend (TypeScript/React)

- TypeScript strict mode enabled.
- Prettier for formatting (`npm run format`).
- ESLint for linting (`npm run lint`).
- Use path aliases: `@api/*`, `@components/*`, `@hooks/*`, `@pages/*`, `@services/*`, `@types/*`, `@utils/*`.

## Pull Request Checklist

- [ ] Code builds successfully (`./mvnw compile` / `npm run build`).
- [ ] All tests pass (`./mvnw test` / `npm test`).
- [ ] Lint passes (`npm run lint`).
- [ ] No secrets, credentials, or local paths committed.
- [ ] API changes are documented (update OpenAPI docs if applicable).
- [ ] New environment variables are added to `.env.example`.

## Project Structure Conventions

- Backend services implement interfaces (e.g., `AppealService` ← `AppealServiceImpl`).
- New features should add both unit tests and, where appropriate, integration tests.
- Keep files focused: one responsibility per class/file.
- Components follow the co-location principle: feature-specific components live with their feature page.
