FROM node:22.15-alpine

WORKDIR /app/client

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
