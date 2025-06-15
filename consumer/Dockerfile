FROM node:20.11.1-alpine3.18

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i

COPY ./ ./

CMD ["npm", "start"]