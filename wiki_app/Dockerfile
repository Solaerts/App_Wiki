FROM node:lts AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base AS dev
EXPOSE 3000
CMD sh -c '[ -f "./db/schema.ts" ] && npx drizzle-kit push; npm run dev'

FROM base AS prod
RUN npm run build
EXPOSE 3000
CMD sh -c '[ -f "./db/schema.ts" ] && npx drizzle-kit push; npm run start'