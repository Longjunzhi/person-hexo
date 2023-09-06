---
title: docker阿里云镜像加速
date: 2023-09-06 01:04:02
tags:
  - docker
category:
  - 运维
---

[阿里云镜像加速器](https://cr.console.aliyun.com/cn-shenzhen/instances/mirrors)

阿里云文档

```angular2html
配置镜像加速器
针对Docker客户端版本大于 1.10.0 的用户

您可以通过修改daemon配置文件/etc/docker/daemon.json来使用加速器

sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://cevlvoox.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```