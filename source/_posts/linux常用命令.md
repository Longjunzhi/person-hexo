---
title: linux常用命令
date: 2023-09-06 01:07:40
tags:
---


### ubuntu

 * 防火墙ufw
    
```angular2html
sudo ufw allow ssh #配置允许 SSH 远程连接
sudo ufw allow 6061 #配置允许 端口6061（花生壳）
sudo ufw enable #启动
sudo ufw disable #禁止
sudo ufw status #状态
ufw allow port_number/protocol #例如sudo ufw allow 6061/tcp
sudo ufw allow 7100:7200/tcp # 范围端口
sudo ufw allow 7100:7200/udp
```

关联链接：https://zhuanlan.zhihu.com/p/139381645
