---
title: docker安装mysql8远程访问
date: 2023-06-08 18:04:29
tags:
 - mysql
 - mysql8
 - docker
---

花生壳 内网穿透
用来作为自已的测试数据库

```angular2html
拉取mysql镜像

docker pull msyql:latset

运行

docker run -it -d --name mysql -p 3306:3306 \
-e MYSQL_ROOT_PASSWORD=123456 \
-v /root/mysql/config:/etc/mysql/conf.d \
-v /root/mysql/data:/var/lib/mysql \
-e TZ=Asia/Shanghai mysql

进入容器
docker exec -it mysql /bin/bash

登录mysql

mysql -uroot -p
输入密码


授权远程访问
grant all privileges on *.* to 'root'@'%';

修改密码
ALTER user 'root'@'%' IDENTIFIED BY '密码';
刷新数据库权限

flush privileges;

```


