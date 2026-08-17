---
title: "学习分布式计算框架-MapReduce"
published: 2018-02-08
category: "分布式计算"
tags: ["MapReduce"]
description: "Google搜索背后的索引计算工作是搜索引擎的核心之一， Google现有的搜索引擎是基于Caffeine的增量索引系统构建的(Caffeine相关论文极少)。由于谷歌的网页索引和计算数据量巨大，Go…"
---

Google搜索背后的索引计算工作是搜索引擎的核心之一， Google现有的搜索引擎是基于Caffeine的增量索引系统构建的(Caffeine相关论文极少)。由于谷歌的网页索引和计算数据量巨大，Google发布了一种适用于超大规模数据的分布式计算模型，就是map-reduce，Google后续的一系列大数据计算引擎都是基于MapReduce的思想构建出来的

# MapReduce

在2004年Google发布了一篇论文, 描述了Google内部针对大数据处理的一种通用模式:MapReduce(简称MR)

MapReduce是一种编程模型,主要用来对大量的数据进行分布式处理和计算,MR的本质是对大量通用计算过程的抽象，经过谷歌工程师长期的计算经验总结，发现很多常见的数据处理任务都可以被拆分为Map和Reduce两个计算过程。MR描述的就是如何使用这两个计算过程实现常用的数据计算工作

论文地址:[MapReduce论文](https://static.googleusercontent.com/media/research.google.com/zh-CN//archive/mapreduce-osdi04.pdf)

## 从简单例子说起

我们用一个实际的问题来描述MapReduce的思想

假设我们有一个文档集合`C`,里面包含`M`个文档,我们要对文档集合中的文档进行单词次数统计,统计在所有文档中的每个单词出现的次数

我们自然的想法就是 先统计每个文档里面的单词和出现次数， 在统计一个集合里面的所有文档的单词和出现次数，最后统计所有文档的单词和出现次数。

没错，这种直觉的解决方案就可以用以下MR过程描述:

```python
"""
1. 拿到文档 -> map -> (文档 , [("word":1)])
这一步需要编写一个map函数， 该函数接受一个文档名和文档内容， 返回 文档内的关键词频次序列

2. 拿到 [(文档，关键词统计)] -> 通过集合内的文档名 group by ->  (集合 -》 [(word, 1)])
这一步需要编写一个reduce函数，可以对[("name",value)]类型的数据按照name进行累加
""" 

def map(key: string, values: string) -> List[(string, int)]:  
  	"""
  	key: document name
    return 该函数返回一个[("to",1),("yours",12)]这样的列表数据
    """
    ans = []
    content = get_doc(key)
    for word in content:
      ans.append((word,1))
    return ans
    
def reduce(key: string, values: List) -> List[(string, int)]: 
    """
    key: a word eg: "t1"
    values: a list of counts 示例: [1,2,3]
    return 该函数同样返回一个[("to",1),("yours",12)]的数据
    """
    int result = 0;
    for v in values:
      result += ParseInt(v);
    Emit(result)
```

## Map

Map是一个将问题分解成多个小问题为后续的分发提供基础的技术

Map的过程用函数来表示就是:

```python
def map(k,v) -> (k1,List<v1>):
  # map函数接收一对k,v键值对,返回一个(k1,v1<list>)
  pass
```

map函数的目的是为了将任务分割方便后续的任务合成，之所以要传入文档名字是为了在磁盘上对返回结果进行标记，标记出调用方是谁。现代化的基于内存的MR基本不需要传文档标记参数了

## Reduce

Reduce是将多个k-v pair按照相同的k进行合并的过程

```python
def reduce(k,list[v2]) -> (list[v3]>):
  # reduce函数接收一个k,v1<list>, 返回一个v2<list>
  pass
```

>ps:大多数情况下map的返回结果不能直接用于reduce函数,需要特殊处理一下

## 过程图

以下是一个很详细的对MongoDB中的MapReduce过程的解读图

![map-reduce.png](https://i.loli.net/2020/05/09/4lu5Ek2yZDi7doF.png)

我们可以看到map函数的输入是多个被查询过滤过的文档集合,返回值是一个map对应的值列表,我们可以认为map函数式对所有符合条件的数据进行一次简单的处理

reduce则是将这个值列表按照key进行处理,即对map的结果进行最终结果合并操作

## 代码(单机版)

以下是使用mapreduce进行文档词频统计的示例代码

其中的主要代码简单解释一下

### MapReduce类

`MapReduce`类是一个通用的MapReduce框架,理论上任意MapReduce任务都可以套用这个框架

要处理不同的问题我们只需要修改对应的map和reduce函数即可

MapReduce类接收3个参数

```shell
i:       要处理的数据源,格式是一个普通的字典; 
mapper:  映射函数,该函接收一个kv键值对,根据需要对每个v值进行处理,返回一个(k,v<list>),此处的k值并不一定是传入的k值; 
reducer: 压缩函数,接收一个(k,v<list>),根据需求对数据进行压缩合并;
```

### map函数

其中`get_most_common_from_text`使用了结巴分词插件

参数:

```shell
k:"a"
v:"The quick brown fox jumped over the lazy grey dogs."
```

返回:

```python
[
  ("the",1),
  ("quick",1),
  ("fox",1)
]
```

### reduce函数

参数:

```python
k:"the"
v<list>:[1,1,1]
```
返回: 
```python
[("the",3),("quick":1)...]
```
完整代码如下
```python
import itertools
import jieba
from collections import Counter

class MapReduce:
    __doc__ = '''提供map_reduce功能'''

    @staticmethod
    def map_reduce(i, mapper, reducer):
        """
        map_reduce方法
        :param i: 需要MapReduce的集合
        :param mapper: 自定义mapper方法
        :param reducer: 自定义reducer方法
        :return: 以自定义reducer方法的返回值为元素的一个列表
        """
        intermediate = []  # 存放所有的(intermediate_key, intermediate_value)
        for (key, value) in i.items():
            intermediate.extend(mapper(key,value))

        # sorted返回一个排序好的list，因为list中的元素是一个个的tuple，key设定按照tuple中第几个元素排序
        # groupby把迭代器中相邻的重复元素挑出来放在一起,key设定按照tuple中第几个元素为关键字来挑选重复元素
        # 下面的循环中groupby返回的key是intermediate_key，而group是个list，是1个或多个
        # 有着相同intermediate_key的(intermediate_key, intermediate_value)
        groups = {}
        for key, group in itertools.groupby(sorted(intermediate, key=lambda im: im[0]), key=lambda x: x[0]):
            groups[key] = [y for x, y in group]
        # groups是一个字典，其key为上面说到的intermediate_key，value为所有对应intermediate_key的intermediate_value
        # 组成的一个列表
        # print(groups)
        return [reducer(intermediate_key, groups[intermediate_key]) for intermediate_key in groups]


class test:

    def get_most_common_from_text(self,text,n = 100):
        word_list = [x for x in jieba.cut(text) if len(x) >= 2]
        return Counter(word_list).most_common(n)

    def map(self,k,v): # k:文档名, v:文档内容
        return self.get_most_common_from_text(v,10000)

    def reducer(self,k,v): # k:词  v:词出现的次数
         return k, sum(v)
    
    def run(self):
        
        i = {
            "a":"The quick brown fox jumped over the lazy grey dogs.",
            "b":"That's one small step for a man, one giant leap for mankind.",
            "c":"　　Mary had a little lamb,Its fleece was white as snow;And everywhere that Mary went,The lamb was sure to go",
            "d":"I pledge to honor and defend you and yours above all others",
            "e":"To share in blessings and burdens, to be your advocate, your champion"
        }
        
        t = MapReduce.map_reduce(i,self.map,self.reducer)
        print(t)


m = test()
m.run()

```


# 总结

MapReduce其实就是我们常说的分而治之的思想，统一了数据模型规范, 使之能适用于更广泛的数据计算

不过这个过程中借助了中间存储，早些年因为内存价格昂贵，所以谷歌选择采用磁盘作为中间存储，后来随着技术发展，出现了spark等利用内存做数据中转的新型MR工具，但是本质还是MR的思想

本文提到的MR只是一个为了学习制作的简单的单机模型，真正的用MR处理大规模数据的难点往往不在map和reduce函数的编写，而在分布式集群调度和任务执行上面 

