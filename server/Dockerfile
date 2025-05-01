FROM node:22.15-alpine

WORKDIR /app/server

COPY package*.json ./
# COPY prisma ./prisma

# RUN npm ci --omit=dev
RUN npm install

COPY ./dist ./

# RUN npx prisma generate

CMD ["npm", "run", "start:prod"]