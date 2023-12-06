---
title: mysql相关知识
date: 2022-07-11 09:50:07
tags:
 - mysql
category:
 - 数据库
---

### mysql优化
    - 目前主要是索引的优化
    - 给查询的字段添加索引,主键索引,外键索引,唯一索引.
    - 数据量不是特别大的时候,足够了
    - explain 来查是否命中索引
    - 分库分表

mysql基础语句


mysql索引


mysql锁


mysql备份


mysql分表

```
create table newTable as select * oldTable where 1=0; 仅复制表结构

create table newTable as select * oldTable;复制表结构和数据

create table newTable as select * oldTable where a=*** and b=***;复制表结构和部分数据


```

