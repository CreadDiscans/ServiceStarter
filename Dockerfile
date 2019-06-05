FROM ubuntu:18.04

RUN apt-get update && apt-get install -y nginx uwsgi python3 python3-pip libmysqlclient-dev uwsgi-plugin-python3 nodejs npm
RUN rm /etc/nginx/sites-enabled/default
RUN mkdir /app

COPY ./requirements.txt /app

WORKDIR /app
RUN python3 -m pip install -r requirements.txt