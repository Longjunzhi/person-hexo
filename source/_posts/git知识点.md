---
title: git知识点
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

```angular2html
* git reset --soft HEAD^ # 取消commit,保留修改的文件
* git reset --hard HEAD^ # 取消commit,不保留修改的文件
* git checkout -b shen-dev(本地分支名) origin/release_dev(远程分支名) #切换远程分支
* git checkout . #恢复工作树文件
* ssh-keygen -t rsa -C "your_email@example.com" #生成新的ssh key
* git stash #git储藏
* git stash list # 储藏列表
* git stash pop # 恢复最近并删除
* git stash drop #移除stash
* git stash show #跟着stash名字
* git stash clear #删除所有缓存的stash
* git stash save #跟着stash名字
```

3. git的知识点

4. 基于git的几大平台
- github gitlab gitee

5. 解决问题的命令
---
git拉取github超时
```angular2html
git config --global --unset http.proxy
git config --global --unset https.proxy
git config http.sslVerify "false"
```

6. commit规范

type用于说明 commit 的类别。

feat：新增功能
fix：bug 修复
docs：文档更新
style：不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
refactor：重构代码(既没有新增功能，也没有修复 bug)
perf：性能, 体验优化
test：新增测试用例或是更新现有测试
build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
chore：不属于以上类型的其他类，比如构建流程, 依赖管理
revert：回滚某个更早之前的提交

相关的资料链接

[git官网](https://git-scm.com/)

[git官方中文文档](https://git-scm.com/book/zh/v2)

官网下载速度慢,可以使用阿里云镜像.

[阿里云git镜像](https://registry.npmmirror.com/binary.html?path=git-for-windows/)