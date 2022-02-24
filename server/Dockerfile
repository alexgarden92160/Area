FROM node:slim
COPY . /app
WORKDIR /app
EXPOSE 3000
RUN npm install
# CMD ["npm", "start"]
RUN apt-get -y update
RUN apt-get -y install netcat
CMD ["sh", "wait.sh"]