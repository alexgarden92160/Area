#!/bin/sh

while ! nc -z localhost 3306 ; do
    echo "Waiting for the MySQL Server"
    sleep 3
done

npm start