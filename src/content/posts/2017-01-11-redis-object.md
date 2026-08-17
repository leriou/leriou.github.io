---
title: "redis中的数据对象"
published: 2017-01-11
category: "编程工具"
tags: 
  - "NoSQL"
  - "redis"
description: "redis中有五种常用对象"
---

# redis对象

redis中有五种常用对象

我们所说的对象的类型大多是值的类型,键的类型大多是字符串对象,值得类型大概有以下几种,但是无论哪种都是基于redisObject实现的

redisObject的结构如下

```c
typedef struct redisObject {
    unsigned type:4; //类型 有五种,分别对应五种常见的值类型
    unsigned encoding:4; // 编码,标明底层数据结构的类型
    unsigned lru:LRU_BITS; /* LRU time (relative to global lru_clock) or
                            * LFU data (least significant 8 bits frequency
                            * and most significant 16 bits decreas time). */
    int refcount; //  引用计数
    void *ptr;    //  存储结构指针
} robj;
```

type的可选值有五种.分别是

```c
    REDIS_STRING,
    REDIS_LIST,
    REDIS_SET,
    REDIS_ZSET ,
    REDIS_HASH
```

encoding的可选值有八种(redis3.2版本新加入了quicklist)

|REDIS_ENCODING_INT|long型的整数|
|:-|:-|
|REDIS_ENCODING_EMBSTR|embstr编码的简单动态字符串|
|REDIS_ENCODING_ROW|简单动态字符串|
|REDIS_ENCODING_LINKEDLIST|双端链表|
|OBJ_ENCODING_QUICKLIST|快速链表|
|REDIS_ENCODING_HH|字典|
|REDIS_ENCODING_ZIPLIST|压缩列表|
|REDIS_ENCODING_INTSET|整数集合|
|REDIS_ENCODING_SKIPLIST|跳跃表|


新的redis3.2以后的源码中更改了底层的数据结构,新的的定义如下,在`server.h`文件中有定义

其中linkedlist是旧的list的底层实现,现已被quicklist代替

```c

/* Objects encoding. Some kind of objects like Strings and Hashes can be
 * internally represented in multiple ways. The 'encoding' field of the object
 * is set to one of this fields for this object. */
#define OBJ_ENCODING_RAW 0     /* Raw representation */
#define OBJ_ENCODING_INT 1     /* Encoded as integer */
#define OBJ_ENCODING_HT 2      /* Encoded as hash table */
#define OBJ_ENCODING_ZIPMAP 3  /* Encoded as zipmap */
#define OBJ_ENCODING_LINKEDLIST 4 /* No longer used: old list encoding. */
#define OBJ_ENCODING_ZIPLIST 5 /* Encoded as ziplist */
#define OBJ_ENCODING_INTSET 6  /* Encoded as intset */
#define OBJ_ENCODING_SKIPLIST 7  /* Encoded as skiplist */
#define OBJ_ENCODING_EMBSTR 8  /* Embedded sds string encoding */
#define OBJ_ENCODING_QUICKLIST 9 /* Encoded as linked list of ziplists */
```

type和encoding共同决定了数值对象的底层结构和存储

## 字符串对象

字符串对象的编码可以是int,embstr和row

redis中的字符串对象是最常用的数据对象之一,redis中的许多键都是采用的字符串对象

字符串类型在redis中根据情况不同有3中情况

1. 对于元素都是纯数字类型的, 例如,'1','2'这种会使用int类型存储,redis默认初始化了10000个数字对象
2. 对于长度小于32的字符串类型,例如'hello',redis会使用embstr类型存储数据
3. 对于长度超过32的使用row存储原字符

>ps: embstr类型的字符串在修改后总会变成row编码类型(redis3.2之后该机制已失效)

## 列表

### redis3.2之前

在redis3.2之前, 列表的编码可以是linkedlist或者ziplist

1. 当列表对象保存的所有字符串长度小于64字节
2. 当列表对象保存的元素数量小于512个的时候

这个时候会使用,ziplist来作为列表对象的编码, 当不满足这两个条件的时候使用linkedlist

>ps:这两个值是更改的,list-max-ziplist-value 和 list-max-ziplist-entries

### redis3.2之后

列表的实现在3.2之后改为quicklist实现

quicklist可以看做一个类似链表的结构, 但是每个节点都是一个ziplist,所以每个ziplist内部可以包含多个数据

>ps: 理念上有点类似于Java中的concurrenthashmap

## 哈希对象

哈希对象的编码可以是ziplist或者hashtable

字典的每一个键和值都是一个字符串对象

1. 哈希对象保存的所有键和值的长度都小于64字节
2. 哈希对象保存的键值对数量小于512个的时候

满足以上两个条件,使用ziplist存储,否则采用hashtable存储

>ps:这两个值是更改的,hash-max-ziplist-value 和 hash-max-ziplist-entries

## 集合

集合对象的编码可以是intset或者hashtable

当集合对象满足以下两个条件的时候采用intset

1. 集合对象保存的元素都是整数
2. 集合对象保存的元素数量不超过512个

不满足以上两个条件都是用hashtable存储

>ps: 该数值可以使用set-max-intset-entries设置

## 有序集合

有序集合对象的编码可以是ziplist或者skiplist

有序集合对象跟前面的几个对象不大一样

```c
typedef struct zset{
    zskiplist *zsl;
    dict *dict;
} zset;
```
zsl中保存一个跳跃表,表节点的对象即是键,score即是分值,该结构主要为 zrange,zrank等函数服务同时还保存一个dict,dict中也保存有键和对应的分值,获取某键的函数zscore使用这个结构,同时持有字典和跳跃表是为了性能考虑，当有序集合满足一下两个条件时候,使用ziplist编码

1. 有序集合元素数量小于128
2. 有序集合元素长度小于64

不能满足以上两个条件的使用skiplist


## 总结

数据对象的实现之所以有这种情况,其实是适应2个不同场景, 节省内存和常规场景,具体表格如下

|对象|省内存|常规|
|:-|:-|:-|
|str|int/embstr| row |
|list|ziplist|linkedlist(quicklist)|
|hash|ziplist|hashtable|
|set|intset|hashtable|
|zset|ziplist|skiplist|

## 回收

redis的对象资源垃圾回收是基于引用计数

当一个对象被使用一次,引用计数增加1，当一个引用被销毁,对象的引用计数会减1，当一个对象的引用计数为0,会被销毁。


## 对象共享

redis默认创建了0到9999的数字对象1万个，其他用到这些对象的时候可以不用创建新对象,直接使用已有的对象
