# Bug Report

*Performed by: Hồ Thị Như Ngọc | Reviewed by: Lê Thị Như Ý | Edited by: Hồ Thị Như Ngọc*

## 1. Bug Summary

This product bug log contains only application defects that were directly confirmed in runtime behavior.

| Bug ID | Description | Severity | Status |
|---|---|---|---|
| BUG-TEST-001 | `useAuth` threw when tests rendered components outside `AuthProvider` | Major | Resolved |

## 2. Detailed Bug Entries

### BUG-TEST-001
- Description: The app pages and components access authentication state through `useAuth()`, but isolated component tests were rendering without the provider.
- Steps to reproduce:
  1. Render a page component in Jest without an `AuthProvider`.
  2. The component calls `useAuth()`.
  3. The hook throws because no context exists.
- Expected vs actual result:
  - Expected: The component should either receive a valid auth context or gracefully operate in guest mode.
  - Actual: The app threw `Error: useAuth must be used within an <AuthProvider>` and the test crashed.
- Root cause and fix detail:
  - Root cause: the hook threw whenever `AuthContext` was missing.
  - Fix: [src/frontend/src/auth/useAuth.tsx](../../src/frontend/src/auth/useAuth.tsx) now returns a safe guest fallback with `user = null` and `isLoggedIn = false` when no provider is mounted.
  - Verification: the Jest suite completed without the runtime auth crash; the evidence is recorded in [TestCaseExecutionDetails.md](TestCaseExecutionDetails.md).
- Severity: Major
- Status: Resolved

## 3. Traceability to Execution

The runtime issue was confirmed in the earlier execution evidence and was fixed in [src/frontend/src/auth/useAuth.tsx](../../src/frontend/src/auth/useAuth.tsx). The final suite evidence is captured in [TestCaseExecutionDetails.md](TestCaseExecutionDetails.md), [src/frontend/testResults.json](../../src/frontend/testResults.json), and the generated Surefire reports in [src/backend/target/surefire-reports](../../src/backend/target/surefire-reports).

## 4. Notes

- No current runtime auth failure remains in the executable suite. The remaining non-passing items are explicit manual-pending or deferred cases, not active product defects.
