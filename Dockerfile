FROM node:14.16-alpine as development
WORKDIR /acct-transaction
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run migrate-prod
RUN npm run build

FROM node:14.16-alpine as production
WORKDIR /dist
COPY package*.json ./
RUN npm install
COPY --from=development /acct-transaction/dist ./

CMD ["node", "src/index.js"]




