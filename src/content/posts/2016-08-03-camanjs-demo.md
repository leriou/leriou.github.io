---
title: "Caman.js的图片处理演示"
published: 2016-01-05
category: "计算机编程"
tags: 
  - "CamanJS"
  - "计算机图形学"
description: "<script src=\"http://libs.baidu.com/jquery/2.0.0/jquery.min.js\"></script> <script crossorigin=\"anonym…"
---

<script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
<script crossorigin="anonymous" integrity="sha384-P75AfVrDnfsoUfx7dDfQM9ivlDhxgE+g4kqO/U7lyXtJwJdpZozbt8L5ywD2PDA0" src="https://lib.baomitu.com/vue/2.5.21/vue.min.js"></script>
<script src="https://cdn.bootcss.com/camanjs/4.1.2/caman.full.min.js"></script>

# CamanJS图形处理库

之前我曾想过自己做一个简单的图片处理库自己用,后来做了几个基本效果以后发现了成本太高

然后就放弃了,去找了个现成的图形库:CamanJS

发现用起来也不错,也就没有再做下去

## 简介

[CamanJS](http://camanjs.com/)是一个图片处理类库,能十分方便的处理图片，本身已经提供了许多效果和操作，使用起来也十分方便

项目地址：https://github.com/meltingice/CamanJS/

## 简单使用

在头文件中引入文件[//cdn.bootcss.com/camanjs/4.1.2/caman.full.min.js](//cdn.bootcss.com/camanjs/4.1.2/caman.full.min.js)

然后就可以直接使用内置的函数和效果了

例如：

```javascript
Caman("#image",function(){
    this.stackBlur(5).render()  //模糊处理，模糊半径5像素
})
```

## 测试工具

<button class="btn btn-info" id="reset">RESET</button>(尽量使用chrome浏览器,请等待网页加载完毕)
<div>
    <div id="stage">
        <img id="image" src="https://i.loli.net/2020/05/09/1LzfsPa7U6D3oWx.png" style="float: auto">
    </div>
</div>


# 预置效果

`Caman`内置了一批现成的图片效果，使用起来非常简单
`this.revert()`用来重置图片效果,保证各个效果不互相影响
`this.lomo()`将lomo效果用到图片上
`this.render()`渲染图片
```javascript
Caman("#image",function(){
    this.revert();
    this.lomo();
    this.render();
})
```
执行`love`效果: <button class="btn btn-info" onclick="javascript:love_render()">RUN LOVE</button>

其他预置效果还有

`lomo`,`vintage`,`clarity`,`sinCity`,`sunrise`,`crossProcess`,`orangePeel`,`grungy`,`jarques`,
`pinhole`,`oldBoot`,`glowingSun`,`hazyDays`,`herMajesty`,`nostalgia`,`hemingway`,`concentrate`
等

将以上方法替换文本框中的`lomo`,例如 `this.hazyDays();`,然后点 RUN 就行了

## Camanjs缺点

不适合用来做粒度极细的像素级操作,虽然提供了方法
<script type="text/javascript">
    function love_render(){
        Caman("#image",function(){
        this.revert();
        this.love();
        this.render();
        })
    }
    function init() {
        var list = [{
            "name": "brightness",
        }, {
            "name": "contrast",
        }, {
            "name": "vibrance",
        }, {
            "name": "saturation",
        }, {
            "name": "exposure"
        }, {
            "name": "hue",
            "value": 100
        }, {
            "name": "clip",
            "value": 100
        }, {
            "name": "sepia",
            "value": 100
        }, {
            "name": "gamma",
            "value": 10
        }, {
            "name": "noise",
            "value": 100
        }, {
            "name": "sharpen",
            "value": 100
        }, {
            "name": "stackBlur",
            "value": 30
        }];
        var table = document.createElement("table");
        for (var i = 0; i < list.length; i++) {
            if (i % 2 == 0) {
                var tr = document.createElement("tr");
                $(tr).attr("id", "tr" + i);
            }
            var td1 = document.createElement("td");
            var td2 = document.createElement("td");
            var td3 = document.createElement("td");
            $(td1).attr("width","15%");
            $(td2).attr("width","20%");
            $(td3).attr("width","5%");
            $(td1).append(list[i].name);
            if (list[i].value > 0) {
                $(td2).append("<input id=" + list[i].name + "_i value=0 type='range' min=0 max=" + list[i].value + " step=1 data-filter=" + list[i].name + ">")
            } else {
                $(td2).append("<input id=" + list[i].name + "_i value=0 type='range' min=-100 max=100 step=1 data-filter=" + list[i].name + ">");
            }
            $(td3).append(0);
            $(tr).append(td1).append(td2).append(td3);
            $(table).append(tr);
        }
        $(table).css("border", "1px solid #ccc");
        $("#stage").append(table);
    }
    init();
    $("input[type=range]").change(function() {
        var stackBlur_v = $("#stackBlur_i").val();
        var brightness_v = $("#brightness_i").val();
        var contrast_v = $("#contrast_i").val();
        var vibrance_v = $("#vibrance_i").val();
        var saturation_v = $("#saturation_i").val();
        var exposure_v = $("#exposure_i").val()
        var hue_v = $("#hue_i").val()
        var clip_v = $("#clip_i").val()
        var sepia_v = $("#sepia_i").val()
        var gamma_v = $("#gamma_i").val()
        var sharpen_v = $("#sharpen_i").val()
        var noise_v = $("#noise_i").val()
        $(this).parent().next().text($(this).val());
        Caman("#image", function() {
            this.revert();
            if (stackBlur_v > 0) this.stackBlur(stackBlur_v);
            if (brightness_v > 0) this.brightness(brightness_v);
            if (contrast_v > 0) this.contrast(contrast_v);
            if (vibrance_v > 0) this.vibrance(vibrance_v);
            if (saturation_v > 0) this.saturation(saturation_v);
            if (exposure_v > 0) this.exposure(exposure_v);
            if (hue_v > 0) this.hue(hue_v);
            if (clip_v > 0) this.clip(clip_v);
            if (sepia_v > 0) this.sepia(sepia_v);
            if (gamma_v > 0) this.gamma(gamma_v);
            if (sharpen_v > 0) this.sharpen(sharpen_v);
            if (noise_v > 0) this.noise(noise_v);
            this.render();
        })
        $("#reset").click(function(){
            Caman("#image",function(){
                this.revert();
                this.render();
            })
        })
    });
</script>
