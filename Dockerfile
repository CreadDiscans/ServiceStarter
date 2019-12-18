FROM ubuntu:18.04

RUN apt-get update && apt-get install -y nginx uwsgi python3 python3-pip libmysqlclient-dev uwsgi-plugin-python3 locales nodejs npm redis supervisor wget
RUN npm install -g n
RUN n stable
RUN npm install -g forever
RUN rm /etc/nginx/sites-enabled/default
RUN mkdir /app

COPY ./requirements.txt /app

RUN sed -i -e 's/# ko_KR.UTF-8 UTF-8/ko_KR.UTF-8 UTF-8/' /etc/locale.gen && \
    locale-gen
ENV LANG ko_KR.UTF-8  
ENV LANGUAGE ko_KR.UTF-8
ENV LC_ALL ko_KR.UTF-8 

WORKDIR /app
RUN python3 -m pip install -r requirements.txt