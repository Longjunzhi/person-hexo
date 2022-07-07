---
title: laravel route缓存坑
date: 2022-07-05 10:46:26
tags:
 - laravel
---

本地访问没有问题,到测试服务器,一直访问不了,路由错误.
查看route文件路由没问题

---
最终发现是laravel路由缓存问题
顺便说一下,路由缓存可以大大提高路由注册的速度.
引用Laravel社区Wiki:
路由缓存会大大减少注册所有路由所需的时间。在某些情况下，路由注册的速度甚至能快上 100 倍。
要生成路由缓存，只需执行 artisan 命令

生成路由缓存命令:
php artisan route:cache
清除路由缓存命令:
php artisan route:clear