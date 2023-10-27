---
title: docker安装mysql8远程访问
date: 2023-06-08 18:04:29
tags:
 - mysql
 - mysql8
 - docker 
category:
 - docker


---
花生壳 内网穿透
用来作为自已的测试数据库

基本配置复制出来
```
docker run -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql
sudo docker cp mysql:/etc/mysql /home/pang/soft/mysql/mysql8

```

运行
mysql.sh

```shell
#!/bin/sh
sudo docker run -it -d --name mysql -p 3306:3306 \
--privileged=true \
--restart unless-stopped \
-e MYSQL_ROOT_PASSWORD=123456 \
-v /home/pang/soft/mysql/mysql8:/etc/mysql \
-v /home/pang/soft/mysql/mysql8/logs:/logs \
-v /home/pang/soft/mysql/mysql8/data:/var/lib/mysql \
-v /etc/localtime:/etc/localtime mysql

```

远程访问
```markdown
登录mysql

mysql -uroot -p
输入密码

授权远程访问
grant all privileges on *.* to 'root'@'%';

~~修改密码
ALTER user 'root'@'%' IDENTIFIED BY '密码';
刷新数据库权限

flush privileges;

```


[引用文章](https://blog.csdn.net/u014576291/article/details/1058~~90286)