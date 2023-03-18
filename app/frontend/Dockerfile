FROM node:16.14-alpine

WORKDIR /app-frontend

# ADD node_modules .

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
