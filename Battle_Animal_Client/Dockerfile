FROM node:20

WORKDIR /app

COPY . .

COPY package.json ./
COPY tsconfig*.json ./

RUN npm install

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "dev"]
