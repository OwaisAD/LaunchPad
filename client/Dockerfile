FROM node:22.15-alpine

WORKDIR /app/client

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]

# FROM node:18-alpine

# WORKDIR /app

# COPY package.json .

# RUN npm install

# RUN npm i -g serve

# COPY . .

# RUN npm run build

# EXPOSE 3000

# CMD [ "serve", "-s", "dist" ]