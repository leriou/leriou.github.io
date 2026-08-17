---
title: "如何计算圆周率π和自然常数e"
published: 2016-03-03
category: "数学"
tags: ["math"]
description: "<script crossorigin=\"anonymous\" integrity=\"sha384-P75AfVrDnfsoUfx7dDfQM9ivlDhxgE+g4kqO/U7lyXtJwJdpZo…"
---

<script crossorigin="anonymous" integrity="sha384-P75AfVrDnfsoUfx7dDfQM9ivlDhxgE+g4kqO/U7lyXtJwJdpZozbt8L5ywD2PDA0" src="https://lib.baomitu.com/vue/2.5.21/vue.min.js"></script>

# 如何计算π和e的值

从小学就知道 $\pi=3.14159265358979\cdots$

但是一直不知道如何计算这个值。之前听说过祖冲之使用的是割圆法，但是我不会(T_T，流下了没有技术的泪水)，也就没办法自己亲自体验一下这个计算过程，好在后来我发现了别的方法可以计算出圆周率的数值

- 数学法

后来偶尔看到数学上有一种方法

$$\pi=4\cdot(1-\cfrac{1}{3}+\cfrac{1}{5}-\cfrac{1}{7}+\cfrac{1}{9}\ldots+\cfrac{1}{n})$$

使用这种方法只要n足够大, 精度就能提高, 所以我就想用程序来尝试计算一下pi的值, 毕竟计算机比人做这种事情合适的多

- 蒙特卡洛模拟

后来又想到可以采用蒙特卡洛采样的方法也可以计算出来 π 

计算方法如下, 我们随机生成 m 个 二维坐标<x, y>, 并且满足  $0\leq x < 1, 0 \leq y < 1$。然后使用欧拉距离统计在圆内的坐标的数目 n ， 再除以生成的所有坐标的数目 $\cfrac{n}{m}$。由于我们的采样范围只覆盖了$\cfrac{1}{4}$的圆， 所以结果需要乘上4 就是圆周率的结果了，我们还可以去除随机出来的重复数字或者通过人为限定随机精度来加快计算



## 在线计算π

<div id="cal-pi">
    <p>精度:<input v-model="input" type ="number" value=""></p><button class="btn btn-info"  v-on:click="calculate">Calculate</button>
    <p>结果: <input v-model="result" readonly="true"> </p>
</div>


# 如何计算自然常数

自然常数也一直是我不理解的一个数字

之前听说过一个类比,讲的挺好的,但当时并没有去仔细考虑过计算自然常数的方法[数学常数e的含义](http://www.ruanyifeng.com/blog/2011/07/mathematical_constant_e.html)

## 自然常数的意义

> 自然常数代表单位时间内,数量翻倍增长的极限

比如: 你有1万块钱, 假如存到银行, 1年到期的复利是100%, 那你到明年最多可以拿到多少钱 , 答案是: 2.71828万

这里的关键在于如何计算利息:

如果按照每半年计息, 1年后等于 $(1+(\cfrac{100\%}{2}))\cdot(1+(\cfrac{100\%}{2}))=2.25$ 万

如果按照每3个月计息一次: $1+(\cfrac{100\%}{4})^4=2.4414$万

如果按照每1个月计算一次 $1+(\cfrac{100\%}{12})^{12}=2.6034$万

如果再往下, 每天, 每分钟, 每秒, 最终得到的就是 $\lim(1+(\cfrac{100\%}{n})^n)$的极限就是 2.71828...

## 如何计算e

后来也找到一种数学方法可以计算，计算方法如下

$$e=\cfrac{1}{1!}+\cfrac{1}{2!}+\cfrac{1}{3!}+\cfrac{1}{4!}\ldots+\cfrac{1}{n!}$$

于是一时好奇就使用程序实现了一下,如下:

```python

import math

class Calculator:

    num = 10000000
    a = 1
    res = 0

    def getPi(self):
        for n in range(1, self.num):
            m = 1 / (1 + 2 * n)
            if n % 2 == 0:
                self.a = self.a + m
            else:
                self.a = self.a - m
        print(self.a * 4)

    def getE(self):
        for n in range(0, self.num):
            self.res = self.res + 1 / math.factorial(n)
        print(self.res)


c = Calculator()
c.getPi()
c.getE()

```

## 在线演示

计算E

<div id="cal-e">
    <p>精度:<input type="number" v-model="input" value=""></p><button class="btn btn-info"  v-on:click="calculate">Calculate</button>
    <p>结果: <input v-model="result" readonly="true"> </p>   
</div>

## 计算年龄

计算你当前的年龄, 精确值, 让你清晰感受时间的流逝

<div id="cal-age">
    <p>生日:<input type="text" v-model="input" value="" placeholder="2017-01-01"></p><button class="btn btn-info" v-on:click="calculate">Calculate</button>
    <p>结果: <input v-model="result" readonly="true"> </p>
</div>

<script>
var arr = [{
    el:"#cal-e",
    data:{
        result:0,
        input:100,
        msg:"请输入一个精度值"
    },
    methods:{
        calculate:function(){
            if (!this.input) {
                alert(this.msg);
            }
            var n = this.input;
            var s = 0;
            for (var i = 0; i <= n; i++) {
                s = s + (1 / this.factorial(i));
            }
            this.result = s;
        },
        factorial: function(n) {
            if (n <= 1) return 1;
            return n * this.factorial(n - 1);
        }
    }
},{
    el:"#cal-age",
    data:{
        result:0,
        input:'2000-01-01',
        msg:"请输入一个出生日期",
        n:0
    },
    methods:{
        calculate:function(){
            if (!this.input) {
                alert(this.msg);
            }
            this.n = 0;
            this.interval = setInterval(this.setAge,100);
        },
        setAge:function (){
            this.n += 1;
            var b = this.input;
            var now = new Date().valueOf();
            var born = new Date(b).valueOf();
            var age = (now - born) / (365 * 24 * 3600 * 1000);
            this.result = age;
            this.stop()
        },
        stop:function() {
            if (this.n > 50) clearInterval(this.interval)
        }
    }
},{
    el:"#cal-pi",
    data:{
        result:0,
        input:100,
        msg:"请输入一个精度值"
    },
    methods:{
        calculate:function(){
            if (!this.input) {
                alert(this.msg);
            }
            var n = this.input * 100;
            var s = 1;
            for (var i = 1; i <= n; i++) {
                var m = 1 / (1 + 2 * i);
                if (i % 2 == 0) {
                    s += m;
                } else {
                    s -= m;
                }
            }
            this.result = s * 4;
        }
    }
}];
for (e in arr) {
    new Vue(arr[e]);
}
</script>
