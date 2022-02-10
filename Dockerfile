FROM node:slim
COPY . /app
WORKDIR /app
EXPOSE 8081
RUN npm install
CMD ["npm", "start"]
