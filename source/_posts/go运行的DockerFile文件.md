---
title: go运行的DockerFile文件
date: 2022-09-07 12:02:11
tags:
 - docker
 - go
 - dockerFile
category:
- go
---

go的dockerFile文件

    1. /src/pxj/courseSystem 目录要修改成自已的项目目录
    2. ENTRYPOINT ["./courseSystem"] 要修改成自已的目录

```angular2html
FROM golang:latest

ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOPROXY=https://goproxy.cn,direct \
    ENV=prod


WORKDIR $GOPATH/src/pxj/courseSystem
COPY . $GOPATH/src/pxj/courseSystem
RUN go build .

EXPOSE 8087
ENTRYPOINT ["./courseSystem"]
```
