CREATE TABLE user(
       id INT PRIMARY KEY AUTO_INCREMENT, 
       username VARCHAR(255), 
       password VARCHAR(255),
       services JSON
);

flush privileges;