---
title: git常用命令
date: 2022-07-04 10:09:03
tags:
 - git
---
 
总结下git版本管理

1. git常用命令
   1. git clone #克隆项目
   2. git push #推送
   3. git add #添加
   4. git commit #提交
   5. git checkout #切换分支
   6. git pull #拉取

2. 要用记不住的命令
* git reset --soft HEAD^ # 取消commit,保留修改的文件
* git reset --hard HEAD^ # 取消commit,不保留修改的文件
* git checkout -b shen-dev(本地分支名) origin/release_dev(远程分支名) #切换远程分支
* git checkout . #恢复工作树文件
* ssh-keygen -t rsa -C "your_email@example.com" #生成新的ssh key

3. git的知识点

4. 基于git的几大平台
- github gitlab gitee


相关的资料链接

[git官网](https://git-scm.com/)

[git官方中文文档](https://git-scm.com/book/zh/v2)

官网下载速度慢,可以使用阿里云镜像.

[阿里云git镜像](https://registry.npmmirror.com/binary.html?path=git-for-windows/)