---
layout: categories
title: go 环境的安装
date: 2022-06-23 00:30:28
tags: 
- go
categories:
- go
---

安装golang

1.下载地址
https://golang.google.cn/dl/

2.添加环境变量
Go\bin 添加到Path环境变量
设置 go GOPROXY
```
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
```

3.配置GOROOT和GOPATH

GOROOT: 配置go的sdk目录
GOPATH: 配置go项目都要放置到这个目录之下

