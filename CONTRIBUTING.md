# Contributing to Aegis

This repository follows a Pull Request based development workflow.

## Branching

Do not work directly on `main`.

Create a new branch for every feature, fix, or documentation task.

Branch naming examples:

```text
feature/backend-scaffold
feature/github-webhook
feature/risk-engine
feature/dashboard
fix/scanner-timeout
docs/scanner-setup
```

Avoid permanent developer-specific branches such as:

```text
chiranthan
arushi
abhishek
```

Branches should represent work, not people.

## Development Workflow

1. Update your local `main`.
2. Create a task-specific branch.
3. Implement the required change.
4. Test the change locally.
5. Commit using meaningful commit messages.
6. Push the branch to GitHub.
7. Open a Pull Request into `main`.
8. Request review from at least one teammate.
9. Resolve requested changes or merge conflicts.
10. Merge only after review and required checks pass.

## Commit Messages

Use short and meaningful commit messages.

Recommended format:

```text
<type>: <description>
```

Common types:

```text
feat: new functionality
fix: bug fix
docs: documentation change
test: tests
refactor: code restructuring
chore: repository or tooling change
```

Examples:

```text
feat: add GitHub webhook receiver
fix: handle invalid webhook signature
docs: document scanner setup
test: add finding parser tests
chore: configure repository structure
```

## Pull Requests

Pull Requests should:

* Have a clear title.
* Explain what was changed.
* Mention relevant testing performed.
* Avoid unrelated changes.
* Be reviewed by at least one teammate.
* Pass required automated checks before merging.

## Main Branch

`main` represents the stable working version of Aegis.

Direct pushes to `main` should not be used for normal development.

Changes should reach `main` through reviewed Pull Requests.

## Shared Contracts

Changes to interfaces used by multiple Aegis components must be discussed with the team before merging.

This includes changes to:

* Finding schemas
* API request and response formats
* Database schemas
* Shared environment variables
* Service communication contracts

## Definition of Done

A task is considered complete when:

* The implementation is finished.
* The change works locally.
* Existing functionality is not knowingly broken.
* No secrets or credentials are committed.
* Relevant tests pass.
* A Pull Request has been created.
* At least one teammate has reviewed the change.
* Required checks pass.
* The Pull Request is merged into `main`.
