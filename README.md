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

#

## Tasks to complete

Below is a list of tasks which need to be completed. You are allowed to use any libraries you want.

#### 1. Implement drag-and-drop `DONE`

There is already a drag-and-drop functionality in the calendar but nothing happens on drop. You would need to create a necessary API endpoint on the backend and make a request to it from the frontend so that the changes requested by the drag-and-drop are persisted.

#### 2. Implement event resize `DONE`

There is already an event resize functionality in the calendar but same as DnD it's not implemented on the backend. You will need to fix it so the changes are persisted.

#### 3. Add event modal with a form which takes name, start and end times for an event to be created `DONE`

Currently, the Add button just creates a random event. Instead, it needs to prompt the user to input the details of the event they want to create.

#### 4. Edit event modal `DONE`

Currently, there is an Edit button on the screen but it does nothing. Edit button should allow the user to edit the name, start and/or end time of an existing event.

#### 5. Add backend validation to event create/edit APIs `DONE`

If user tries to create/edit an event so that it would conflict with another event in the system, the API should return a 400 response with an error. This should also be displayed in the web UI.

#### 6. (Optional) Refactor showIds and selectedEvent params `DONE`

Currently, these params are passed through multiple components. Refactor those so they are stored in a context/state.

#### 7. (Optional) Restyle the event `DONE`

Change the style of the event so it matches this design: https://t.ly/YZhyY. The font is Georgia and the colour palette is available here: https://colorhunt.co/palette/001f3f3a6d8c6a9ab0ead8b1

#

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
