# LaunchPad Service

Sub-Pack Q2 | Team Quebec | Hatchloom Inc.

LaunchPad is the student entrepreneurship workspace microservice for Hatchloom.
It owns Sandboxes, SideHustles, Business Model Canvases, Teams, and Positions.
It exposes one public endpoint (Position Status Interface) consumed by ConnectHub.

## Prerequisites

- Java 21 (JDK)
- Apache Maven (or use the included `./mvnw` wrapper)
- Docker and Docker Compose (for containerised runs)
- A running Auth service at `http://localhost:8081` for JWT validation (protected endpoints only)

## Run locally (native)

Requires a local PostgreSQL instance. Spring Boot Docker Compose integration
will auto-start the `compose.yaml` Postgres service when you run:

```bash
./mvnw spring-boot:run
```

The service starts on port **8082** (mapped from container port 8080).

## Run with Docker

Builds the image and starts Postgres + LaunchPad together:

```bash
docker compose up --build
```

The service will be available at `http://localhost:8082`.

> Note: JWT-protected endpoints require the Auth service to be reachable at
> `http://auth:8081` inside Docker. The public Position Status Interface
> (`GET /launchpad/positions/{id}/status`) works without Auth.

## Run tests

Unit tests only (no database required):

```bash
./mvnw test
```

Integration tests (requires a running Postgres):

```bash
./mvnw test -Dgroups=integration \
  -DSPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/launchpad_db \
  -DSPRING_DATASOURCE_USERNAME=launchpad_user \
  -DSPRING_DATASOURCE_PASSWORD=launchpad_pass
```

## Environment variables

| Variable | Default (local) | Docker value |
| --- | --- | --- |
| `SPRING_DATASOURCE_URL` | (Spring Docker Compose) | `jdbc:postgresql://postgres:5432/launchpad_db` |
| `SPRING_DATASOURCE_USERNAME` | `launchpad_user` | `launchpad_user` |
| `SPRING_DATASOURCE_PASSWORD` | `launchpad_pass` | `launchpad_pass` |
| `SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI` | `http://localhost:8081` | `http://auth:8081` |
| `SERVER_PORT` | `8080` | `8080` (host-mapped to `8082`) |

## Cross-service dependencies

| Dependency | Direction | Details |
| --- | --- | --- |
| Auth service | LaunchPad validates JWTs | `issuer-uri` must point to the Auth service OIDC discovery endpoint. LaunchPad does NOT issue tokens. |
| ConnectHub | ConnectHub calls LaunchPad | `GET /launchpad/positions/{positionId}/status` - public, no token required. Returns `"OPEN"`, `"FILLED"`, or `"CLOSED"`. |

## API documentation

- Static docs: [API_DOCS.md](API_DOCS.md)
- Interactive (Swagger UI, requires running service): `http://localhost:8082/swagger-ui.html`

## Known issues

- The Auth service is owned by Sub-Pack Q1 and is not included in this `compose.yaml`.
  When running `docker compose up` from this directory, JWT validation for protected
  endpoints will fail because `http://auth:8081` is unreachable. The full-platform
  Docker Compose (integration sprint deliverable) must add the Auth service.
- LaunchPad performs JWT issuer discovery on startup. If Auth is unreachable at startup
  time inside Docker, LaunchPad may fail to start. Mitigation: add `depends_on: auth`
  in the full-platform compose file once Auth is available.
