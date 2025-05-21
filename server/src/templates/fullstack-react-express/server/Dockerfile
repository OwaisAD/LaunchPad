FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev

COPY ./dist ./

RUN npx prisma generate

CMD ["npm", "run", "start:prod"]
