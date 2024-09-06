---
title: php-fpm内存跑满
date: 2024-09-06 11:05:27
tags: php
---

参考文档
https://blog.csdn.net/weixin_45526912/article/details/135149425
https://blog.csdn.net/guo_qiangqiang/article/details/89532660
https://zhuanlan.zhihu.com/p/405981279
https://www.cnblogs.com/zoutong/p/13523945.html


pm.max_children = 80

## 问题
1. php-fpm内存跑满
2. laravel的afterResponse
3. 接口处理耗时任务
4. 导致进程没有释放
5. 服务器内存不够，直接跑满所有内存。
request_terminate_timeout
优化方案
1、耗时任务放到队列里
2、合适的max_children，避免进程过多，结合服务器内存
3、使用opcache缓存，workman swoole 等