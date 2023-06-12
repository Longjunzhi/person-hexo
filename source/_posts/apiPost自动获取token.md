---
title: apiPost自动获取token
date: 2023-06-08 19:50:47
tags:
 - apiPost
---
 
提高生产力和效率，往往是把基础的东西做好，搭建好。

学习永远是官方文档优先

[ApiPost文档](https://v7-wiki.apipost.cn/docs/2)

环境的切换 
* 本地
* 测试 
* 正式


变量的使用
{{变量名}}

目录公共模块预执行脚本

```angular2html

    await $.ajax({
    "url": apt.environment.getPreUrl() + "/admin/login/account",
    "method": "POST",
    "content-type": "appication/json",
    "data": JSON.stringify({
    "type": "account",
    "password": "admin",
    "username": "admin"
    }),
    "success": function (response) {
    response = typeof response == "object" ? response : JSON.parse(response);
    console.log(response);
    apt.variables.set("bearerToken", response.token);
    }
    });

```

利用请求参数&响应值可快速生成api文档
