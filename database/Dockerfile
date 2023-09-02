FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=password

COPY ./sample_data.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
