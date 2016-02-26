FROM node:4.3.1

WORKDIR /app
ADD package.json /app/
RUN npm install
ADD . /app

EXPOSE 1234
CMD npm start