FROM node:14.16-alpine as development
WORKDIR /lendapi
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run migrate-prod

FROM node:14.16-alpine as production
WORKDIR /dist
COPY package*.json ./
RUN npm install
COPY --from=development /src/dist ./

CMD ["node", "src/index.js"]




