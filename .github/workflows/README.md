# LaunchPad CI Workflow

This directory contains GitHub Actions workflows for the Hatchloom repository.

## launchpad-ci.yml

Workflow file: [launchpad-ci.yml](launchpad-ci.yml)

### Trigger conditions

- Push to `main` when files under `launchpad/**` change
- Pull request to `main` when files under `launchpad/**` change

### Jobs

1. `test`
- Starts a PostgreSQL 16 service container
- Runs `./mvnw test` in the `launchpad` service directory
- Uploads Surefire reports as artifacts (always)

2. `build-docker`
- Runs only on push to `main` after `test` passes
- Builds `launchpad/Dockerfile`
- Pushes image tags to GHCR:
  - `ghcr.io/<owner>/hatchloom-launchpad:latest`
  - `ghcr.io/<owner>/hatchloom-launchpad:<commit-sha>`

### Notes

- The workflow is intentionally scoped to LaunchPad paths to avoid running for unrelated service changes.
- Auth service is not started in CI: LaunchPad tests run with an explicit issuer URI value in workflow environment variables.
