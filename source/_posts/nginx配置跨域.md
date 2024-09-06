---
title: nginx配置跨域
date: 2024-09-06 11:01:48
tags: nginx
---

不走代码配置跨域
使用nginx配置跨域

配置示例

```shell
server {
        listen        80;
        server_name  demo.pangxuejun.cn;
        root   "~/public";
        add_header 'Access-Control-Allow-Origin' "*" always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With,authtoken' always;
}

```