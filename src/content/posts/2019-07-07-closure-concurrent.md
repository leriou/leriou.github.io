---
title: "闭包代码如何控制高并发的正确"
published: 2019-07-07
category: "计算机编程"
tags: 
  - "编程语言"
  - "闭包"
description: "闭包(closure)的概念在很多语言中都有。闭包通常在函数式编程语言或者具有函数式特性的编程语言中会单独列出来，作为一个语言特性。以展示这个语言的强大。"
---

## 关于处理闭包的并发问题

闭包(closure)的概念在很多语言中都有。闭包通常在函数式编程语言或者具有函数式特性的编程语言中会单独列出来，作为一个语言特性。以展示这个语言的强大。

**什么是闭包**    我们通常对闭包的解释是`带有运行环境上下文变量的函数`

给一个闭包的代码示例(Go)

```go
a := func() func() {
  i := 0
  return func() {
    i++
    fmt.Println(i)
  }
}()
```

上面的这个函数就实现了闭包， 每调用一次，内部的变量i就增加1。而且这个变量从外部访问不到

简单的闭包我们都能写，问题是我们如果处理高并发场景下的闭包问题呢，例如下面这段代码

```go
// 原子计数器
ato := int32(0)
// 闭包
a := func() func() {
  i := 0
  return func() {
    atomic.AddInt32(&ato, 1)
    i++
    if ato == 1000 {
      fmt.Println("i -> ", i, "ato -> ", ato)
    }
  }
}()
// 记录调用了多少次协程执行
for n := 0; n < 1000; n++ {
  go a()
}
// 等待所有协程执行完毕
for ato < int32(1000) {
  time.Sleep(1000000)
}
fmt.Println("done")
```

 我们期望的输出值是1000， 但是i的实际的输出值有可能不到1000。

原因也很简单，因为i++并不是原子性的。由于协程运行的乱序执行，导致有可能会出现两次以3 为基数的自增，这个时候，两次自增的结果都是4就有一次自增相当于无效化

所以我们处理的方法也可以从i++的原子性来考虑

## 方法一

### 使用原子操作

```go
ch := make(chan int32, j)
a := func() func() {
  i := int32(0)
  ch <- i
  return func() {
    atomic.AddInt32(&i, 1) // 原子操作
    fmt.Println(i)
  }
}()
```

这种情况下， i的值的更新都变成了原子操作，即便乱序执行，结果也是一致的

### 原子类的局限

如果我们要锁定的不是一个变量的变化， 而是一系列的代码操作，这个时候原子类就无用武之地了

这种时候要么用锁，要么用下面的处理办法

## 方法二

使用csp机制来控制并发。csp是基于消息的常用并发模型的一种（另一种是ActorModel）。

### csp传递值变量

go语言中有一个csp并发模型，我们可以把要更新的值放到channel中， 使用的时候取出来更新完在放回去， 由于channel的阻塞性，自然就实现了一致性保证。我们用go来写个代码测试一下

```go
a := func() func() {
    i := 0
    ch := make(chan int, 1)
    ch <- i
    return func() {
        t := <-ch
        t++
        fmt.Printf(" i %d, j %d\n", t, j)
        ch <- t
    }
}()
```

### channel传递函数指针

或者更激进一点， 把整个函数指针放到channel中， 这样就能对整个闭包函数中的代码加锁了。

```go
a := func() func() {
  i := 0
  j := 0
  return func() {
    i++
    j++
    fmt.Println("i ->", i, " j ->", j)
  }
}()

fc := make(chan func(), 1)
fc <- a // 先预置一个用于启动
for p := 0; p < j; p++ {
  t := <-fc
  t()
  fc <- a
}
m := <-fc // 检查最终的结果
m()
```

这种方法对语言有要求，需要语言对函数支持比较好，像java这种oop语言就没法使用

### rust的channel实现

rust里面也可以跟go一样使用channel 传递函数指针来实现闭包函数的并发控制

```rust
use std::sync::mpsc::channel;

fn c() -> Box<dyn FnMut() -> i32> {
    let mut a = 1;
    Box::new(move || {
        a += 1;
        println!("a -> {}", a);
        a
    })
}
fn main() {
    let mut t = c();
    t();
    t();
    let (s, r) = channel::<Box<dyn FnMut() -> i32>>();
    if let (Ok(_), Ok(mut n)) = (s.send(t), r.recv()) {
        n();
    }
}
```

