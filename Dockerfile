FROM ubuntu:18.04

RUN apt-get update 
RUN apt-get install -y nginx uwsgi python3 python3-pip wget locales redis supervisor
RUN apt-get install -y uwsgi-plugin-python3
RUN apt-get install -y libmysqlclient-dev
RUN apt-get install -y libssl1.0-dev nodejs-dev node-gyp nodejs npm
RUN apt-get install -y libffi-dev
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
