---
title: 【Ubuntu 22.04 LTS】设置笔记本合并盖子不休眠
date: 2023-09-05 00:43:26
tags:
  - ubuntu
---
配置文件
```angular2html
/etc/systemd/logind.conf
```

配置说明
* HandlePowerKey: 按下电源键后的行为，默认power off 
* HandleSleepKey: 按下挂起键后的行为，默认suspend 
* HandleHibernateKey: 按下休眠键后的行为，默认hibernate 
* HandleLidSwitch: 合上笔记本盖后的行为，默认suspend

只监视带有 “power-switch” 标签的 输入设备的 key(按下按钮)/lid(合上盖子) 事件。

如果主机插入了一个扩展坞(docking station) 或者连接了多个显示器， 那么"合上盖子"将执行 HandleLidSwitchDocked= 动作；

如果主机使用外部电源， 并且 HandleLidSwitchExternalPower= 不是默认值(“ignore”)， 那么"合上盖子"将执行 HandleLidSwitchExternalPower= 动作； 否则将执行 HandleLidSwitch= 动作。

参数说明:
```angular2html
ignore(无操作),
poweroff(关闭系统并切断电源),
reboot(重新启动),
halt(关闭系统但不切断电源),
kexec(调用内核"kexec"函数),
suspend(休眠到内存),
hibernate(休眠到硬盘),
hybrid-sleep(同时休眠到内存与硬盘),
suspend-then-hibernate(先休眠到内存超时后再休眠到硬盘),
lock(锁屏)
```

```angular2html
HandleLidSwitch=ignore
HandleLidSwitch=lock
service systemd-logind restart
```


引用：https://blog.csdn.net/qq_31635851/article/details/124627990