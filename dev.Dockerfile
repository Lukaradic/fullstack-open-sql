FROM node:24
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . . 
CMD ["npm", "run", "dev"]