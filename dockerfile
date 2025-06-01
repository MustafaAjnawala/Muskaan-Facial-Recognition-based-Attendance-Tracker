#using official Node.js image
FROM node:18

#Setting up the working directory
WORKDIR /app

#copying dependencies
COPY package*.json ./

RUN npm install

#copy the rest of your code
COPY . .

EXPOSE 5000

CMD ["npm", "start"]