FROM node:20

WORKDIR /usr/app

COPY . .

COPY package.json ./
COPY tsconfig*.json ./

RUN npm install
RUN npx prisma generate
# RUN npm run build

ENV NODE_ENV=production
EXPOSE 8081

# CMD ["node", "-r", "tsconfig-paths/register", "dist/src/index.js"]
CMD ["npm", "run", "dev"]
