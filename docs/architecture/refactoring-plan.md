# Refactoring Plan – MyUS University Portal

> **Date:** 2026-07-29
> **Branch:** refactor/repository-architecture

---

## Overview

This plan divides the architecture improvement into **8 phases**, ordered by risk (lowest first). Each phase is independently committable and verifiable.

---

## Phase 0 — Baseline Validation

**Objective:** Confirm the project builds and tests pass before any changes.

**Actions:**
1. Checkout `refactor/repository-architecture`.
2. Verify backend compiles.
3. Verify frontend builds.
4. Run all tests.

**Risk:** None. Read-only.

**Validation:**
```bash
cd src/backend && ./mvnw compile test
cd src/frontend && npm install && npm test && npm run build
```

---

## Phase 1 — Repository Hygiene

**Objective:** Add essential repository configuration files.

**Files affected:**
- `.gitignore` (new)
- `.editorconfig` (new)
- `src/backend/.env.example` (new)

**Expected improvement:** Prevents committing system files, build artifacts, and secrets. Standardizes editor settings.

**Risk:** Low. Only adds new files; doesn't modify source code.

**Validation:** `git status` shows only intended new files.

---

## Phase 2 — Documentation and Conventions

**Objective:** Standardize project documentation.

**Files affected:**
- `README_FILE.md` → `README.md` (renamed + rewritten)
- `CONTRIBUTING.md` (new)

**Expected improvement:** GitHub renders README on repo home page. New contributors have clear onboarding.

**Risk:** Low. Documentation only.

**Validation:** Visual inspection of markdown rendering.

---

## Phase 3 — Architecture Documentation

**Objective:** Document current architecture, proposed improvements, and refactoring plan.

**Files affected:**
- `docs/architecture/current-state.md` (new)
- `docs/architecture/proposed-architecture.md` (new)
- `docs/architecture/refactoring-plan.md` (new)

**Expected improvement:** Technical documentation for future maintainers. Clear record of architectural decisions.

**Risk:** None. Documentation only.

---

## Phase 4 — Safe Directory Restructuring

**Objective:** Move misplaced directories without changing code.

**Actions:**
1. Move `src/SpecKit/` → `SpecKit/` (it's tooling, not app source code).
2. Move `src/tests/` → `tests/` (it's currently empty with only `.gitkeep`).
3. Remove empty `src/backend/src/main/java/com/myus/util/package-info.java` if util remains unused.

**Files affected:**
- `src/SpecKit/` → `SpecKit/`
- `src/tests/.gitkeep` → `tests/.gitkeep`

**Expected improvement:** `src/` contains only application source code. Tooling and docs live alongside.

**Risk:** Medium. References to SpecKit tool paths (if any CLI scripts reference `src/SpecKit`) may break.

**Validation:** git diff shows only moved files. No import changes needed.

---

## Phase 5 — Frontend Code Quality

**Objective:** Eliminate duplicate files and unused dependencies.

**Actions:**
1. Remove `src/frontend/src/hooks/useAuth.tsx` (duplicate of `auth/useAuth.tsx`).
2. Remove `src/frontend/src/services/authService.ts` (duplicate of `auth/authService.ts`).
3. Update `src/frontend/src/auth/useAuth.tsx` to import from `../services/authService` (or update the import chain).
4. Remove unused deps from `package.json`: zustand, react-query, react-table (to be verified first).
5. Update `ProtectedRoute` import in `App.tsx` — verify it uses `auth/` path already.

**Files affected:**
- `src/frontend/src/hooks/useAuth.tsx` (delete)
- `src/frontend/src/services/authService.ts` (delete)
- `src/frontend/src/auth/useAuth.tsx` (update imports)
- `src/frontend/package.json` (remove unused deps)

**Expected improvement:** Single source of truth for auth logic. Cleaner dependency list.

**Risk:** Low-Medium. Must verify all imports resolve before deleting.

**Validation:**
```bash
cd src/frontend && npm run build && npm test
```

---

## Phase 6 — Backend Code Quality

**Objective:** Fix architecturally problematic areas.

**Actions:**
1. **Fix `ProfileController`:** Remove direct `StudentRepository` injection. Delegate `getProfile()` entirely to `ProfileService`.
2. **Fix `ProfileService`:** Add `getProfile(String username)` method.
3. **Extract DTO mapping:** Move `mapToResponse` from controller into service (already exists in `ProfileServiceImpl`).
4. **Remove MapStruct from pom.xml** (unused dependency).

**Files affected:**
- `ProfileController.java` (remove repository field, delegate to service)
- `ProfileService.java` (add getProfile method)
- `ProfileServiceImpl.java` (implement getProfile)
- `pom.xml` (remove mapstruct if confirmed unused)

**Expected improvement:** Clean separation of concerns. Controller no longer bypasses service layer.

**Risk:** Medium. Profile endpoint behavior must remain identical.

**Validation:**
```bash
cd src/backend && ./mvnw compile test
```

---

## Phase 7 — Testing Improvements

**Objective:** Improve test coverage and quality.

**Actions:**
1. Add unit tests for `ProfileServiceImpl`.
2. Add unit tests for `GradeServiceImpl`.
3. Add unit tests for `CourseServiceImpl` (mocked repository queries).
4. Add unit tests for `EnrollmentServiceImpl`.
5. Verify frontend tests still pass.

**Files affected:**
- `src/backend/src/test/` (new test files)
- `src/frontend/src/tests/` (existing, verify)

**Expected improvement:** Better coverage for business logic. Easier future refactoring.

**Risk:** Low. Tests are additive and isolated.

---

## Phase 8 — CI and Quality Automation

**Objective:** Add automated quality checks.

**Actions:**
1. Create `.github/workflows/ci.yml` with jobs for:
   - Backend: compile + test
   - Frontend: install + lint + test + build

**Files affected:**
- `.github/workflows/ci.yml` (new)

**Expected improvement:** Automated quality gates on push/PR.

**Risk:** Low. CI runs in parallel with local development.

---

## Risk Summary

| Phase | Risk | Mitigation |
|-------|------|-----------|
| 0 | None | Read-only |
| 1 | Low | New files only |
| 2 | Low | Documentation only |
| 3 | None | Documentation only |
| 4 | Medium | Git tracks moves; verify no hardcoded paths |
| 5 | Low-Med | Verify imports via build |
| 6 | Medium | Behavioral equivalence via tests |
| 7 | Low | Additive; isolated tests |
| 8 | Low | CI runs in parallel |
