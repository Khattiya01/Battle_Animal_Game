FROM node:18

WORKDIR /usr/app

COPY . .

COPY package.json ./
COPY tsconfig*.json ./

RUN npm install
RUN npx prisma generate
RUN npm build

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "dist/src/index.js"]