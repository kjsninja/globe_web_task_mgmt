# Task Management Web App

Task management made easy for you.

## Demo
<img src='./_docs/demo.gif'/>

## Prerequisite

- You need node version `v22.13.0` or above
- (***Optional***) If you want to run docker setup, you need to have docker `version 28.0.1` or above

## Setup

1. Install dependencies

```
npm install
```

2. Configure your `.env`

```
cp sample.env .env
```

3. Supply the necessary configs

```
APP_NAME=TASK_MGMT_WEB

# URL of the api
API_URL=http://localhost:3001

# If you run the application via docker
# make sure to change the host to host.docker.internal
# API_URL=http://host.docker.internal:3001

SESSION_SECRET=YOUR_SESION_SECRET
COOKIE_NAME=YOUR_COOKIE_NAME

# This should be equal to the backend secret
# to verify the JWT properly
TOKEN_SECRET=YOUR_TOKEN_SECRET_SAME_WITH_BACKEND
```

4. Run the development environment

```
npm run dev
```

5. Run in prod environment

```
# build the files
npm run build

# run the app
npm run start
```

6. (***Optional***) Run using docker

```
# safe to always build the docker image
# before running the app
npm run docker:build

# run the application
npm run docker:up

# turn off the application
npm run docker:down

```