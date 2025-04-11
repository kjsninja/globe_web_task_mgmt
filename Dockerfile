
FROM node:22 AS base
WORKDIR /web
COPY ./public ./public
COPY ./src ./src
COPY ./package.json .
COPY ./*.js .
COPY ./*.ts .
COPY ./*.mjs .
COPY ./.env .
COPY ./tsconfig.json .
COPY ./components.json .
RUN npm install

FROM base AS production
WORKDIR /web
ENV NODE_ENV=production
RUN npm run build
CMD npm run start

FROM base AS dev
ENV NODE_ENV=development
CMD npm run dev