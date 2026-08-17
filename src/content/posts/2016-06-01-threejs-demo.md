---
title: "The First Three.js Project"
published: 2016-06-01
category: "计算机编程"
tags: 
  - "three.js"
  - "计算机图形学"
description: "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/three.js/r70/three.min.js\" ></script>"
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r70/three.min.js" ></script>

# `Three.js`简单演示

`Three.js`是基于`WebGl`封装的一个现成图形库,更新速度非常快,这里简单列出一些three.js的简单例子和演示

## 准备

要使用`three.js`首先要引入库文件
首先,到[http://threejs.org/](http://threejs.org/)下载`three.js`类库
也可以使用cdn服务,例如[http://cdn.bootcss.com/three.js/r83/three.js](http://cdn.bootcss.com/three.js/)

然后这里讲解一下`Three.js`主要用到的知识(这些也是所有3D绘图要用到的基础知识)

## 基础

- **场景**
  场景就是你要绘制的图形所放置的容器,是所有几何体发生交互和展示的所在,几何体对象必须放到场景中才可以显现出来

- **渲染器**
  渲染器可以把你所绘制的图形通过像素画出来,比如颜色,材质,纹理,反射效果啥的

- **照相机**
  相当于人的眼睛,就是你所观看的视角的方向

以下部分可以酌情使用:

- **光源**
    光源是`WebGL`中必须的部分,如果没有光源,即便渲染出了东西,也是没有办法在屏幕上看到的(没有光当然就是黑漆漆的一片啦)
    光源还分好多种,常用的有环境光,聚光灯,和点光源等

- **几何体**
    几何体是我们平常生活中最容易遇到的东西,`WebGL`中提供了几种常用的几何体类
    每种几何体使用的时候都是这么几个步骤

    1. 实例化类对象
    2. 设置材质
    3. 用栅格把几何体对象和材质编织起来,得到3D对象
    4. 设置3D对象的属性(位置,阴影之类)

    一个复杂的物体可以拆分成几个简单的几何体

## 透视和投影

透视和投影是3D图形中非常重要和基础的概念

这里主要跟`three.js`中的照相机类有关系,照相机代表模拟人眼的观察方向

透视在`three.js`中只有是用线框模型才能很好的表现

投影主要分为正交投影和透视投影

### 正交投影

![28210109_oXpx.jpg](https://i.loli.net/2020/05/09/UjivxQIND2FwgXu.png)

正交投影一般用于平面制图,建模,游戏中的小地图也使用正交投影,正交投影不会改变物体的比例

正交投影相机函数如下

`THREE.OrthographicCamera(left, right, top, bottom, near, far)`

传入`视景体`的(左,右,上,下,前边界,后边界),即可完成一个正交投影相机的设定

* example

设置照相机,照相机位置为(0,0,5)

```javascript
var camera = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 1, 10);
camera.position.set(0, 0, 5);
scene.add(camera);
```
在原点处创建一个边长为1的正方体，为了和透视效果做对比，这里我们使用`wireframe(线框模型)`而不是实心的材质，以便看到正方体后方的边：

```javascript
var cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    })
);
```
效果如下:

<div id="Orthographic1" style="margin:0;text-align: center;"></div>

但是由于角度问题,我们现在只能看到正方体的正面,现在我们调整相机位置
`camera.position.set(4, -3, 5);`
调整视角方向(看向原点),这样我们就能看到整个正方体的线框了
`camera.lookAt(new THREE.Vector3(0, 0, 0));`
<div id="Orthographic2" style="margin:0;text-align: center;"></div>

<script>
Orthographic1();
Orthographic2();
function Orthographic2(){
    // renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(600,400);
    document.getElementById("Orthographic2").appendChild(renderer.domElement);
    renderer.setClearColor(new THREE.Color(0X000000,0.5)); // black
    // scene
    var scene = new THREE.Scene();
    //camara
    var camera = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 1, 10);
    camera.position.set(4, -3, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    //cube
    var cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        })
    );
    scene.add(cube);
    // render
    renderer.render(scene, camera)
}
function Orthographic1(){
    // renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(600,400);
    document.getElementById("Orthographic1").appendChild(renderer.domElement);
    renderer.setClearColor(new THREE.Color(0X000000,0.5)); // black
    // scene
    var scene = new THREE.Scene();
    //camara
    var camera = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 1, 10);
    camera.position.set(0,0,5);
    // camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    //cube
    var cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        })
    );
    scene.add(cube);
    // render
    renderer.render(scene, camera)
}

</script>

### 透视投影

![28210109_n5sg.jpg](https://i.loli.net/2020/05/09/OMT2v7BDgYNmpXS.jpg)

透视投影类似人眼看到的效果,大多数游戏,应用等都使用透视投影,透视投影会使看到的物体产生形变,产生"远小近大"的效果

透视投影相机函数如下

`THREE.PerspectiveCamera(fov, aspect, near, far)`

透视相机需要传入(俯仰角,画面比,近边界,远边界)来完成透视相机的参数设置

* example

设置透视投影照相机，这里Canvas长600px，宽400px，所以aspect设为600 / 400：

```javascript
var camera = new THREE.PerspectiveCamera(45, 600 / 400, 1, 10);
camera.position.set(0, 0, 5);
scene.add(camera);
```

设置一个在原点处的边长为1的正方体:

```javascript
var cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    })
);
scene.add(cube);
```

效果如下:

<div id="Perspective" style="margin:0;text-align: center;"></div>

<script>
Perspective();
function Perspective() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(600,400);
    document.getElementById("Perspective").appendChild(renderer.domElement);
    renderer.setClearColor(new THREE.Color(0X000000,0.5)); // black
    // scene
    var scene = new THREE.Scene();
    //camara
    var camera = new THREE.PerspectiveCamera(45, 600 / 400, 1, 10);
    camera.position.set(0, 0, 5);
    scene.add(camera);
    //cube
    var cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        })
    );
    scene.add(cube);
    // render
    renderer.render(scene, camera)
}
</script>

## 材质

材质有大量共有属性,这些属性可以设置材质的纹理,颜色,雾化等许多效果,这里挑选几种常用材质进行简单说明

### 基础材质

基础材质不受灯光影响,多用于实现简单展示

构造函数:`THREE.MeshBasicMaterial( parameters )`

### Phong材质

Phong材质= 环境光 + 漫反射 + 镜面反射

该材质具有极高的真实感,可产生高光效果,可以模拟金属等物体

构造函数:`THREE.MeshPhongMaterial( parameters )`

### lambert材质

lambert材质可以模拟一些无需高光反射的哑光效果,例如:皮纹

构造函数:`THREE.MeshLambertMaterial( parameters )`

### 法向量材质

根据表面法向量方向产生不同颜色,多用于调试

构造函数:`THREE.MeshNormalMaterial( parameters )`

## 光源

光源可谓是3D绘图中极其重要的部分,光源分为很多种,除了环境光,点光源这几种常见的之外,还有面光源等特殊光源

所有光源都具有一部分共同属性,在`three.js`中这些属性为缺省值,不填则会有默认值,例如:color

### 环境光

环境光是模拟自然环境中无处不在的被多次反射的光线,环境光的特点

* 无法产生阴影
* 从四周所有方向照射

环境光构造函数  `THREE.AmbientLight(hex)`

hex:十六进制的颜色值,例如:0xff0000

添加一个环境光源

```javascript
var light = new THREE.AmbientLight({0xffffff});
scene.add(light);
```

但是只添加环境光而没有物体是无法看出来效果的
所以再添加两个长方体

```javascript
var greenCube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshLambertMaterial({color: 0x00ff00}));
greenCube.position.x = 3;
scene.add(greenCube);
var whiteCube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshLambertMaterial({color: 0xffffff}));
whiteCube.position.x = -3;
scene.add(whiteCube);
```

<div id="Ambient" style="margin:0;text-align: center;"></div>

<script>
Ambient();
function Ambient() {
    var renderer = new THREE.WebGLRenderer();
    var width = 600;
    var height = 400;
    document.getElementById("Ambient").appendChild(renderer.domElement);
    renderer.setClearColor(new THREE.Color(0x000000,0.5));
    renderer.setSize(width,height);
    // scene
    var scene = new THREE.Scene();
    //camara
    var camera = new THREE.PerspectiveCamera(45, width / height, 1, 10);
    camera.position.set(0, 3, 10);
    camera.lookAt(new THREE.Vector3(0,0,0));
    scene.add(camera);
    var light = new THREE.AmbientLight( 0x880000); // soft white light
    scene.add(light);
    //cube
    var greenCube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshLambertMaterial({color: 0x00ff00}));
    greenCube.position.x = 2;
    scene.add(greenCube);
    var whiteCube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2),
            new THREE.MeshLambertMaterial({color: 0xff0000}));
    whiteCube.position.x = -2;
    scene.add(whiteCube);
    // render
    renderer.render(scene, camera)
}
</script>

### 仿射变换

仿射变换是指计算机图形学中表示物体运动和变化的一系列动作

主要有 平移,旋转,缩放和切变

图形学中一般使用一个四维矩阵来表示仿射变换

具体如下:

    [ 缩放/旋转矩阵(3x3矩阵),0]
    [ 平移矩阵,1]

原因:

    [2,3]
    [4,5] 

这样的一个矩阵我们可以看成是两个二元方程组, 在图形上表示一个二维平面图形

同样的表示三维平面图形我们用三元方程组

表示为矩阵就是

    [2,5,6]
    [6,2,1]
    [-1,3,4]

对三维图形做变换其实就是对矩阵进行操作

### 聚光灯

聚光灯模拟的是舞台上的聚光灯,手电筒等光源效果,特点有

* 可以产生阴影
* 从一点沿某一方向射出,具有明显边界,影响范围一般呈锥体形状

聚光灯构造函数

`THREE.SpotLight(hex, intensity, distance, angle, penumbra,decay)`

hex: 十六进制颜色值
indensity: 光强度
distance: 光照有效距离
angle: 角度
penumbra: 半影
decay: 衰减度

### 点光源

点光源模拟的类似于生活中的灯泡,蜡烛等由一点  

点光源构造函数:
`THREE.PointLight(hex, intensity, distance)`

例如:

```javascript
var light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(0, 1.5, 2);
scene.add(light);
```

<div id="PointLight" style="margin:0;text-align: center;"></div>

<script>
PointLight();
function PointLight() {
    var renderer = new THREE.WebGLRenderer();
    var width = 600;
    var height = 400;
    document.getElementById("PointLight").appendChild(renderer.domElement);
    renderer.setClearColor(new THREE.Color(0x000000,0.5));
    renderer.setSize(width,height);
    // scene
    var scene = new THREE.Scene();
    //camara
    var camera = new THREE.PerspectiveCamera(45, width / height, 1, 10);
    camera.position.set(0, 5, 5);
    camera.lookAt(new THREE.Vector3(0,0,0));
    scene.add(camera);
    var light = new THREE.PointLight(0xffffff, 2, 100);
    light.position.set(0, 1.5, 2);
    scene.add(light);
    //cube
    var greenCube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshLambertMaterial({color: 0x00ff00}));
    greenCube.position.x = 2;
    scene.add(greenCube);
    var whiteCube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2),
            new THREE.MeshLambertMaterial({color: 0xff0000}));
    whiteCube.position.x = -2;
    scene.add(whiteCube);
    // render
    renderer.render(scene, camera)
}
</script>


### 平行光

一般距离极远的点光源表现为平行光,例如:太阳

平行光可以产生阴影

`THREE.DirectionalLight(hex, intensity)`

```javascript
var light = new THREE.DirectionalLight();
light.position.set(2, 5, 3);
scene.add(light);
```

## 在线演示

好啦,了解以上知识,再稍微熟悉一下基础`three.js`类就能做一个简单的东西了
比如:

```javascript
var scene = new THREE.Scene();
var width = 700;
var height = 330;
var camera = new THREE.PerspectiveCamera(45,width/height,0.1,1000);
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x000000,0.5));
renderer.setSize(width, height);
camera.position.set(-30,50,50);
camera.lookAt(new THREE.Vector3(10,10,10));
document.getElementById("scene").appendChild(renderer.domElement);
var groundGeom = new THREE.PlaneGeometry(100,100);
var groundMesh = new THREE.Mesh(groundGeom,new THREE.MeshBasicMaterial({color:0xffee00}));
groundMesh.rotation.x = -Math.PI/2-0.08;
scene.add(groundMesh);
var geomCube = new THREE.BoxGeometry(16,32,16);
var cube = new THREE.Mesh(geomCube,new THREE.MeshNormalMaterial({color:0x7777ff}));
scene.add(cube);
var ambientLight = new THREE.AmbientLight({color:0xff0000});
scene.add(ambientLight);
scene.fog = new THREE.Fog(0x0000ff,0.03,100);
var spotLight = new THREE.SpotLight(0x00ff00);
spotLight.position.set(40,20,10);
spotLight.castShadow = true;
scene.add(spotLight);
render();
function render(){
    cube.rotation.y += 0.01;
    requestAnimationFrame(render);
    renderer.render(scene,camera);
}

```
测试区域(代码复制到下边文本框运行即可):
<textarea id="test" style="width:600px;height:400px; border:1px solid #ccc;border-radius:5px;"></textarea>

<button class="btn btn-info" onclick="eval(document.getElementById('test').value)">运行测试代码</button>
<div id="scene" style="margin:0;text-align: center;">
</div>

## So Sad

由于Three.js更新太快了,所以我打算暂时不更新了,等版本稳定再继续更新...
