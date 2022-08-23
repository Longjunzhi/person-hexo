---
title: js replaceAll方法有兼容性问题(记录下坑)
date: 2022-08-23 19:11:22
tags: js
---

旧版本游览器不支持该写法,可以转化成

replace方法

```
var str = "wordwordwordword";
var strNew = str.replace(/word/g,"Excel")
strNew = replaceAll(str);
```
