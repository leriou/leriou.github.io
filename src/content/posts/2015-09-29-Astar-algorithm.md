---
title: "学习A*寻路算法"
published: 2015-09-29
category: "计算机编程"
tags: ["A*算法"]
description: "我们日常生活中的很多决策问题都可以转化为对应的路径规划问题,如何从复杂的路径中寻找两个或者多个点之间的最短距离就是一个很值得研究的东西"
---

# `A*`寻路

## 背景介绍

我们日常生活中的很多决策问题都可以转化为对应的路径规划问题,如何从复杂的路径中寻找两个或者多个点之间的最短距离就是一个很值得研究的东西

`A*`算法是一种寻路算法,解决的是路径规划问题的一种

目的是:

>找出某地图中两点之间的最短路径

## 寻路过程

先来看个地图

    s:起点   e:终点  #:障碍
    | | | | | | | |          
    | | | |#| | | |
    | |s| |#| |e| |
    | | | |#| | | |
    | | | | | | | |

现在有这样的需求,我们需要找出s->e的最短路径 ，但是,s和e之间有一堵'墙',就是"#"啦。这样怎么才能找出最短路径呢?  

第一种做法(Dijkstra算法):

    s:起点   e:终点  *:检索路径 #:障碍
    |*|*|*| | | | |
    |*|*|*|#| | | |
    |*|s|*|#| |e| |
    |*|*|*|#|*|*| |
    |*|*|*|*|*| | |

或者我们可以这样做(A*):

    s:起点   e:终点 *:检索路径 #:障碍
    | | | | | | | |       
    |*|*|*|#| | | |
    |*|s|*|#| |e| |
    |*|*|*|#|*| | |
    | | |*|*|*| | |

很明显,第二种做法比第一种做法检索的路径要少很多,当然,速度上就要快一些,对一些更复杂的地图,`A*`要比普通广度优先的算法快上许多

例如:

    s:起点  e:终点  *:检索路径  #:障碍
    | | | | | | | | | | | | | |    
    | | | | | | | | |e| | | | |    
    | | | |#|#|#|#|#|#|#| | | |    
    | | |#| | | | | | | |#| | |    
    | | |#| | | | | | | |#| | |    
    | | |#| | | | | | | |#| | |    
    | | |#| | | | | | | |#| | |    
    | | | | | | | | | | | | | |
    | | | | | | |s| | | | | | |
    | | | | | | | | | | | | | |
    | | | | | | | | | | | | | |


这个地图中从s到e,如果使用普通寻路可能是这样的

    s:起点  e:终点  *:最终路径  #:障碍
    | | | | | | | | | | | | | |    
    | | | | | | | | |e|*|*| | |    
    | | | |#|#|#|#|#|#|#|*|*| |    
    | | |#| | | |*|*|*|*|#|*| |    
    | | |#| | | |*| | |*|#|*| |    
    | | |#| | | |*| | |*|#|*| |    
    | | |#| | | |*| | |*|#|*| |    
    | | | | | | |*| | | |*|*| |
    | | | | | | |s| | | | | | |
    | | | | | | | | | | | | | |
    | | | | | | | | | | | | | |

很明显,寻路过程中出现了较多的无用步数,寻路进入了布袋口里面,我们期望的是寻路尽量快速,寻找最短路径,`A*`的做法就比较符合我们的期望

`A*`寻路:

    s:起点  e:终点  *:最终路径 #:障碍
    | | | | | | | | | | | | | |    
    | | | | | | | | |e|*|*| | |    
    | | | |#|#|#|#|#|#|#|*|*| |    
    | | |#| | | | | | | |#|*| |    
    | | |#| | | | | | | |#|*| |    
    | | |#| | | | | | | |#|*| |    
    | | |#| | | | | | | |#|*| |    
    | | | | | | |*|*|*|*|*|*| |
    | | | | | | |s| | | | | | |
    | | | | | | | | | | | | | |
    | | | | | | | | | | | | | |

## `A*`寻路的主要过程

**`A*`寻路的精髓**

核心公式：$$F = G + H$$

F:用来评价点距起点距离的值

G:实际已耗费的路径

H:未来还需要耗费的路径

### 具体过程

1. 将起点S加入到开放列表(开放列表中的点都是可用的)
2. 寻找起点S周围所有可到达的点,并计算F值(最终衡量路径距离的值),设置这些点的父节点为起点,将这些点加入到一个开放列表
3. 将起点从开放列表中删除,并添加到关闭列表,从开放列表中选取F值最小的点M(如果有多个最小F值,随机取其一)
4. 将M从开放列表中删除,并添加到关闭列表,计算M周围可到达的点,重新计算F值,将周围这些点都存入开放列表,设置他们的父节点为M
5. 如果M周围某个点已经在开放列表中,重新计算F值和G值(已消耗路径),选取新旧G值中最小的点
6. 最后如果发现终点在开放列表中,终止程序

### 实质

`A*`算法的实质是通过维护一个`待检测点的列表(open list)`和一个`已检测点的列表(closed list)`来记录寻路过程,从图形上来看，OPEN集是已访问区域的边界，CLOSED集是已访问区域的内部。每个节点还包含一个指向父节点的指针，以确定追踪关系。

算法有一个主循环,重复地从OPEN集中取最优节点n(即f值最小的节点)来检测.如果n是目标节点,那么算法结束; 
否则,将节点n从OPEN集删除,并添加到CLOSED集中,然后查看n的所有邻节点n',如果邻节点在CLOSED集,它已被检测过,则无需再检测; 
如果邻节点在OPEN集,它将会被检测,则无需此时检测; 
否则,将该邻节点加入OPEN集,设置其父节点为n,到n'的路径开销`F(n') = G(n) + H(n,n')`


## `A*`的变种

`A*`算法可以通过`动态加权`,`跳跃点搜索`,`双向搜索`,`迭代深化`等进行性能和功能的优化

此外还有`动态A*`与`终身规划A*`等变化,这些变化其实都是基于基本的`A*`理论来进行优化

## 寻路算法的应用

比较常见的是寻路算法在游戏中的应用,因为很多游戏中会有地图的概念,涉及到地图就很容易有寻路规划的需要

比如:许多RPG游戏中会有去寻找某个NPC接任务或者去某个地方打败某个BOSS

寻路算法在生活中也有应用,比如 探索和侦查,道路建设,地形分析,城市规划等

总之,深入研究寻路算法是非常有意义的

## 推荐阅读

如果有希望深入了解`A*`的读者,强烈推荐一篇文章,作者写的非常用心,讲的也特别细

地址:[http://theory.stanford.edu/~amitp/GameProgramming/index.html](http://theory.stanford.edu/~amitp/GameProgramming/index.html)

## 代码演示

下面是一个Python实现的`A*寻路`的代码:

```python

class Node_Elem:
    #开放列表和关闭列表的元素类型，parent用来在成功的时候回溯路径
    def __init__(self, parent, x, y, dist):
        self.parent = parent
        self.x = x
        self.y = y
        self.dist = dist

```

主要程序

```python

class A_Star:

    #A星算法实现类
    #注意w,h两个参数，如果你修改了地图，需要传入一个正确值或者修改这里的默认参数
    def __init__(self, s_x, s_y, e_x, e_y, w=60, h=30):
        self.s_x = s_x
        self.s_y = s_y
        self.e_x = e_x
        self.e_y = e_y

        self.width = w
        self.height = h

        self.open = []
        self.close = []
        self.path = []

    #查找路径的入口函数
    def find_path(self):
        #构建开始节点
        p = Node_Elem(None, self.s_x, self.s_y, 0.0)
        while True:
            #扩展F值最小的节点
            self.extend_round(p)
            #如果开放列表为空，则不存在路径，返回
            if not self.open:
                return
            #获取F值最小的节点
            idx, p = self.get_best()
            #找到路径，生成路径，返回
            if self.is_target(p):
                self.make_path(p)
                return
            #把此节点压入关闭列表，并从开放列表里删除
            self.close.append(p)
            del self.open[idx]

    def make_path(self,p):
        #从结束点回溯到开始点，开始点的parent == None
        while p:
            self.path.append((p.x, p.y))
            p = p.parent

    def is_target(self, i):
        return i.x == self.e_x and i.y == self.e_y

    def get_best(self):
        best = None
        #开放列表中最好的值
        bv = self.width*self.height*10000 #这个值应该大于地图的最大格子数量
        #开放列表中最好的键
        bi = -1
        for idx, i in enumerate(self.open):
            value = self.get_dist(i)#获取F值
            if value < bv:#比以前的更好，即F值更小
                best = i
                bv = value
                bi = idx
        return bi, best

    def get_dist(self, i):
        # F = G + H
        # G 为已经走过的路径长度， H为估计还要走多远
        # 这个公式就是A*算法的精华了。
        return i.dist + math.sqrt((self.e_x-i.x)*(self.e_x-i.x)+ (self.e_y-i.y)*(self.e_y-i.y))*1.4#这里的1.4为优化数字，可选范围[1.0-1.4],

    def extend_round(self, p):
        #可以从8个方向走
        xs = (-1, 0, 1, -1, 1, -1, 0, 1)
        ys = (-1,-1,-1,  0, 0,  1, 1, 1)
        #只能走上下左右四个方向
        #xs = (0, -1, 1, 0)
        #ys = (-1, 0, 0, 1)
        for x, y in zip(xs, ys):
            new_x, new_y = x + p.x, y + p.y
            #无效或者不可行走区域，则勿略
            if not self.is_valid_coord(new_x, new_y):
                continue
            #构造新的节点
            node = Node_Elem(p, new_x, new_y, p.dist+self.get_cost(p.x, p.y, new_x, new_y))
            #新节点在关闭列表，则忽略
            if self.node_in_close(node):
                continue
            i = self.node_in_open(node)
            if i != -1:
                #新节点在开放列表
                if self.open[i].dist > node.dist:
                    #现在的路径到比以前到这个节点的路径更好~
                    #则使用现在的路径
                    self.open[i].parent = p
                    self.open[i].dist = node.dist
                continue
            self.open.append(node)

    def get_cost(self, x1, y1, x2, y2):

        #上下左右直走，代价为1.0，斜走，代价为1.4

        if x1 == x2 or y1 == y2:
            return 1.0
        return 1.4

    def node_in_close(self, node):
        for i in self.close:
            if node.x == i.x and node.y == i.y:
                return True
        return False

    def node_in_open(self, node):
        for i, n in enumerate(self.open):
            if node.x == n.x and node.y == n.y:
                return i
        return -1

    def is_valid_coord(self, x, y):
        if x < 0 or x >= self.width or y < 0 or y >= self.height:
            return False
        return test_map[y][x] != '#'

    def get_searched(self):
        l = []
        for i in self.open:
            l.append((i.x, i.y))
        for i in self.close:
            l.append((i.x, i.y))
        return l

```
