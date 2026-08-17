---
title: "纯小白向-5分钟搭建个人博客"
published: 2020-02-01
tags: ["wordpress"]
description: "这是一个面向不懂计算机的纯小白的搭建个人网站的教程，需要的东西如下"
---

# 五分钟搭建一个博客网站（mac os）

这是一个面向**不懂计算机的纯小白**的搭建个人网站的教程，需要的东西如下

1. 一台能联网的电脑
2. 一个知道什么是文件以及会创建文件夹的人

## 第一步：必备软件和文件下载

我们的网站的运行需要一个软件的支持，这个软件就是docker，使用doker能让我们的安装过程非常方便 

### 1. 下载docker软件

目标：这一步的目的是下载必备的软件docker并安装启动docker

下载地址： [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

![docker-1.png](https://i.loli.net/2020/11/13/eTVfZkXJwyIj4BH.png)

### 2. 获取搭建网站需要的文件

目标：这一步的目的用一个文件告诉docker我们要搭建一个网站，这个文件名字必须叫 `docker-compose.yml`

文件我已经提前准备好了，直接下载就行了

地址：[https://raw.githubusercontent.com/leriou/docker-env/master/docker-compose/wordpress/docker-compose.yml](https://raw.githubusercontent.com/leriou/docker-env/master/docker-compose/wordpress/docker-compose.yml) 

可以直接使用迅雷啥的下载，也可以使用以下命令直接下载

打开 终端软件(Terminal)，

![docker-2.png](https://i.loli.net/2020/11/13/REnJX6AZ5r7LKIM.png)

粘贴命令：

```
wget --no-check-certificate https://raw.githubusercontent.com/leriou/docker-env/master/docker-compose/wordpress/docker-compose.yml
```

![docker-3.png](https://i.loli.net/2020/11/13/qxfZOnI1aprD4uJ.png)

并回车，等待下载文件

------

到此，我们的准备工作就结束了

总结一下，我们需要一个docker软件和一个文件docker-compose.yml在docker上搭建一个网站

## 第二步：启动网站

打开终端, 执行命令

```
ls 
```

检查列出的文件中是否有docker-compose.yml

![docker-4.png](https://i.loli.net/2020/11/13/56CnuP2qjmNgeDE.png)

执行命令 

```
docker-compose up -d
```

![docker-5.png](https://i.loli.net/2020/11/13/EMOW7JcrC2v5VPA.png)

![docker-6.png](https://i.loli.net/2020/11/13/W8OUEBsc1GzTaZi.png)

等待下载必备的东西完毕就可以使用网站了

## 第三步：管理和使用网站

### 测试网站是否成功

打开浏览器，访问 http://localhost:8077 

![docker-9.png](https://i.loli.net/2020/11/13/Ikei31hNYpXcSLW.png)



### 设置网站语言和账号密码

就可以设置网站使用的语言和账号密码

![docker-7.png](https://i.loli.net/2020/11/13/ExKfGXa24y6dPno.png)

![docker-8.png](https://i.loli.net/2020/11/13/zbft3SWr962ohVP.png)

### 设置网站的主题，变得更好看

网站是基于Wordpress制作的，所以可以直接从主题库选择喜欢的主题换上就可以了

![docker-10.png](https://i.loli.net/2020/11/13/PLS3IAJKamhvOeG.png)

