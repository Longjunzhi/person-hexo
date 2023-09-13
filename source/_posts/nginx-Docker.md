---
title: nginx Docker
date: 2023-09-13 19:08:32
tags:
---


```angular2html
sudo docker pull nginx
sudo docker run --name myBlog -p 8080:80 -itd -v /home/pang/code/github/longjunzhi.github.io:/usr/share/nginx/html nginx
```