## Node Verions
  `>=18`

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

# Testing Real-Time Flows
Driver & Dashboard Test Scripts
This repo includes ready-to-use Socket.IO test scripts to help you simulate drivers and dashboard clients for real-time flows.

# How to Run
Driver Test Script
Simulates a driver connecting, authenticating, and sending location updates every 5 seconds.


```
  npm run test:driver-ws
```
Before running:
Update the token variable in test/driver-ws-test.ts with a valid JWT token (get it from the /login endpoint).

# Dashboard Test Script
Simulates a dashboard client subscribing to a driver’s location feed and printing live updates and offline events.

```
  npm run test:dashboard-ws
```

### What They Do

- **Driver test script:**
  - Connects to the `/driver` WebSocket namespace.
  - Authenticates using a JWT.
  - Periodically emits `location_update` events.

- **Dashboard test script:**
  - Connects to the `/dashboard` WebSocket namespace.
  - Subscribes to a specific driver’s location events using `subscribe_driver`.
  - Prints every `location` and `OFFLINE_DRIVER` event it receives.

---

### How to Customize

- To test different drivers, change the `username` in the dashboard test script and re-run.
