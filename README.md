# ELT Full Stack Technical Test

## Overview

### Structure

You are given an NX monorepo project which consists of the following apps/libs:

- **calendar-backend** - NestJS backend project
- **calendar-frontend** - React frontend project
- **calendar-domain** - Domain layer for the calendar-backend
- **calendar-backend-e2e** - API (Axios) e2e tests for calendar-backend
- **calendar-frontend-e2e** - Cypress e2e tests for calendar-frontend

### App description

When run, React web app will render a calendar and fetch calendar events from the backend to display.

There is an option on the page to add a random event, which will create a random event, submit it to the backend which in turn will persist it in the database.

There is also an option to show/hide ids for each event.

## Running the project

Ensure you are running **Node v20+**.

Install dependencies

```sh
npm install
```

There is a docker-compose file which start a MySQL database, backend and frontend projects. You'd first need to build a base Docker image by running

```
docker buildx build --platform linux/arm64 . --tag nx-cli-local
```

Note: Change `arm64` to `amd64` if you are not on MacOS (with Apple silicone).

You can then start all the projects up using `docker compose up -d`.

If you experience issues with Docker, try running `nx reset`.

If you are on a Mac and experiencing issues, then you might need to run `npm rebuild --arch=arm64 --platform=linux` as well before starting backend/frontend projects in Docker.

Worst case scenario, you can run the backend and the frontend outside of Docker. You might need to create `.env.local` files with environment variables which are currently configured in `docker-compose.yml`.

You can navigate to the webapp by going to http://localhost:4200 in your browser.
