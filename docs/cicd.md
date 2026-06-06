# NihonGO CI/CD

## Backend Docker Image

Backend Docker image is automatically built and pushed to GitHub Container Registry when files under `backend/**` are changed on the `main` branch.

## Image Registry

- Registry: GHCR
- Image: `ghcr.io/hj1235/nihongo-backend`
- Tags:
  - `latest`
  - Git commit short SHA, for example `a1b2c3d`

## Authentication

GitHub Actions uses the built-in `GITHUB_TOKEN`.

No real secret values are committed to the repository.

## Current Kubernetes Image

```yaml
image: ghcr.io/hj1235/nihongo-backend:latest