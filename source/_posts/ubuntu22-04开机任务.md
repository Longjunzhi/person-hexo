---
title: ubuntu22.04开机任务
date: 2023-11-11 00:42:47
tags:
---
在目录/etc/init.d/目录新建脚本#
sudo vim /etc/init.d/startup.sh

Copy
#!/bin/bash
# Only for test
touch /root/1.txt
添加执行权限#
sudo chmod +x /etc/init.d/startup.sh

添加启动脚本#
sudo update-rc.d startup.sh defaults 90

查看服务列表#
sudo service --status-all

测试是否生效#
Copy
sudo service startup.sh start

sudo service startup.sh stop
或者直接重启验证

删除任务#
sudo update-rc.d -f startup.sh remove

Tips：此方法只在ubuntu22.04测试可用，其他版本未验证。

来源：https://www.cnblogs.com/ALice1024/p/17302426.html
