---
title: "git简单使用指南"
published: 2015-06-01
category: "编程工具"
tags: ["git"]
description: "推荐一个git官方的GUI客户端:https://desktop.github.com/"
---

## git操作基础

推荐一个git官方的GUI客户端:https://desktop.github.com/

## 基本流程

![git-process.png](https://i.loli.net/2020/05/09/QMgToH8ti9CSzVw.png)

git基本命令格式

	git 命令 参数

部分名词解释:

	origin: 本地代码库  (可以自己设置)
	
	remote: 远端代码库地址
	
	head: 版本指针
	
	branch: 分支

Git的相关配置有两份一份在项目中的`.git`文件夹中，一份全局的位于用户目录下的`.git`目录中。项目配置优先于全局配置， 会覆盖掉全局中的配置，所以我们修改配置要注意一下修改的位置

## 获取项目

1. 新建仓库

* 对已存在的项目目录使用 `git init`

2. 克隆仓库

* https方式

例如: `git clone  https://git.coding.net/gongchang/gc.buyer.git`
	
该方式推送更新可能需要先设置用户名和密码

* ssh方式(推荐)

例如:`git clone git@git.coding.net:gongchang/gc.buyer.git`
	
该方式获取项目建议先生成ssh-key, 并将ssh-key添加到授权中(github/gitlab等设置中都有添加ssh-key的方法)

对应svn命令 : `svn clone XXXXXX`

### 生成ssh-key 

`ssh-keygen -t rsa -C "youremail@example.com"` 

使用ssh生成ssh-key

生成的ssh-key位于用户目录下的.ssh目录中, 一共有两个一个公钥, 一个私钥

将`xxx.pub`中的公钥copy到git服务器中,再检查用户名和密码,就可以用ssh登录git了
3. 获取更新

```bash
git pull origin master   //origin代表当前版本库,master是远端分支名,如果要更新dev分支就是 git pull origin dev 

或者简化版

git pull  //这种方式有时候默认拉下来的不是master分支,需要自己手动切换一下
```
此命令等同`git fetch`+ `git merge`, 对应svn命令:`svn update`

## 提交代码

1. 暂存区

修改完代码以后需要将修改添加到暂存区 

```bash
git add .                 //.代表当前目录
如果要添加当前目录下的 1.txt文件,相应的命令就是
git add 1.txt
```

未添加到暂存区的修改可以用`git checkout` 撤销,对应svn命令 `svn revert -R .`

```bash
git checkout .    //.代表当前目录
```

2. 提交

```bash
git commit -m "测试提交"  //"测试提交"是对本次提交的描述
```

3. 推送

```bash
git push origin master   //origin 当前版本库  master远端分支名
 
git push origin dev      //往dev分支上推送代码
```

下面三条命令 相当于 svn的一条命令  `svn commit -m "测试"`

```bash
git add .
git commit -m "测试"
git push origin master
```
## 分支操作

1.  查看当前分支, *号所在就是你当前分支
```bash
git branch
```
2.  新建分支

新建分支dev_test,假设当前在dev分支

命令:`git checkout -b dev_test`或`git branch dev_test`

对应svn命令 :`svn copy dev dev_test `

3.  切换分支

命令:

```bash
git checkout dev_test   //切换到dev_test分支
```
3.  合并dev_test到dev

当前所在分支为dev,命令:

```bash
git merge origin/dev_test
```

4. 删除分支

```bash
git branch -d dev_test
```

## 解决冲突

1. 处理冲突

下面是冲突代码的显示形式,表明两个代码库此处代码不一致,需要手动解决冲突
```php
<<<<<<< HEAD
test1
=======
test2
>>>>>>> 
```
将代码手动修改为

```bash
test2
```
然后执行 1. `git add .` 2.`git commit -m "解决冲突"`    3.`git push origin master`

## 其他

1. 查看日志   `git log` 
2. 查看状态   `git status`
3. 查看修改   `git diff`
4. `git log --pretty=oneline 文件名` 可以查看某文件的修改记录

## 高级操作

* 场景1: 如果觉得Git的提交记录太多太乱,想清理git的提交记录,变得整洁

`git rebase ` 

重新设定分支,十分少用,把当前提交定位到某次提交之后

* 场景2: 有时候部分修改已经提交,但后来发现这个功能不用上线了,你当然可以手动切换一个新分支, 但是也可以使用另一个命令将当前分支设置为之前的某一个版本

`git reset `

放弃所有未推送的提交

* 场景3: 线上某个版本上线之后出了问题,需要紧急会退到上一个正常的版本

`git revert`

版本回退,可用于撤销已推送的错误提交

*ps: `git reset HEAD` 然后`git push -f`这样也能达到撤销错误提交的作用,但是如果在你错误提交之后,有同学进行了新提交,这个新提交也会被撤销*

* 场景4: 你正在A分支上面开发新功能,此时有个紧急bug需要你处理

可以使用`git stash`暂存起来, 切换到其他分支上去开发功能, 开发完毕切换回来, 用 `git stash apply`恢复之前的修改

`git stash list`:列出储藏列表

`git stash drop`: 删除一个储藏

`git stash apply stash@{2}`: 应用储藏

`git stash pop`: 应用最新的一个储藏

`git stash clear`: 清理所有储藏

`git stash branch testchanges`: 从储藏中创建分支