---
title: "多git账号配置"
published: 2017-06-01
category: "编程工具"
tags: ["git"]
description: "我们有时候可能会遇到这样的情况，公司部署了一个gitlab服务器，我们自己也有在github上面使用仓库。"
---

## 多Git账号场景

我们有时候可能会遇到这样的情况，公司部署了一个gitlab服务器，我们自己也有在github上面使用仓库。

但是这两个服务器上面的账号是不一样的，我们需要在公司的项目中使用公司的git账号,私人项目使用私人的git账号，这时候就需要在同一台电脑上面同时使用多个git账号

## 生成两个ssh-key

现在大家普遍使用ssh-key来作为授权验证的工具.

大多数的git服务器也使用这样的方式

那我们就需要生成两个对应的ssh-key, 一个用于私人项目,一个用于公司项目

## 获取服务器项目权限

首先我们要拥有对应服务器(github/gitlab/coding等)的权限

一般取得权限的方法是

1. 注册github/gitlab/coding账号

2. 生成ssh-key，`ssh-keygen -t rsa -C "youremail@example.com"` 生成ssh-key

3. 将生成的ssh-key中的xxx.pub公钥添加到github或者gitlab的ssh-key授权中

此时我们的电脑实际上已经获得了往对应的平台中的账户下面的仓库中推送代码的权利, git推送代码是只认机器不认人,但是服务器还无法针对不同的服务使用不同的ssh-key设置

## 在ssh中增加config文件

可以通过配置.ssh文件夹下的config文件,通知ssh对不同的服务器使用不同的ssh-key

例如,config内容:

```bash

# github
Host github.com    # 指定主机地址
    HostName github.com   # 主机名, 选填
    User 111@qq.com      # 用户名
    PreferredAuthentications publickey  # 授权方式
    IdentityFile ~/.ssh/id1_rsa     # 该服务器上使用的ssh-key

# gitlab
Host gitlab.com
    HostName gitlab.com
    User 222@qq.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id2_rsa

```

以上内容就是 对github.com 使用 id1_rsa这份公钥,对gitlab.com使用 id2_rsa公钥,配置好了以后ssh就可以的对不同的服务器使用不同的公钥了

>ps: 没有域名host可以直接设置为服务器ip

但是此时我们可能推送代码的用户标识可能不正确

例如:  你的私人用户名叫A ,公司账号叫B, 此时你推送代码到公司账户但是却显示推送者是A

## 在目标项目中使用git config设置用户

git中的配置分为全局配置和项目配置,默认使用全局配置,如果要在特定项目中使用特定的用户名,需要在项目的git配置中进行指定

可以在项目目录中执行以下命令,指定需要使用的用户名和邮箱

`git config user.email "aaa@qq.com"`: 设置项目用户邮箱

`git config user.name "aaa"`: 设置项目用户名

也可以手动修改`项目名/.git/config`文件中的user标签下的内容

## ssh-T 测试

使用如下命令可以测试配置结果,需要测试@ 后面的服务器地址可以自己修改

`ssh -T git@github.com`
