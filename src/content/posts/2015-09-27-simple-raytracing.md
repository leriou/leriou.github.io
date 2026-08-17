---
title: "一个简单的用JS实现的光线追踪效果"
published: 2015-09-27
category: "计算机编程"
tags: 
  - "raytracing"
  - "计算机图形学"
description: "点击下方的按钮就可以渲染出一张图片哦,纯渲染出的哦(渲染很消耗性能可能会有少许的等待时间)"
---

## 一个简单的光线追踪的例子

点击下方的按钮就可以渲染出一张图片哦,纯渲染出的哦(渲染很消耗性能可能会有少许的等待时间)

## 在线测试

```
x: x轴坐标
y: y轴坐标
z: z轴坐标
反射次数： 反射效果
```

通过修改下面输入框中的数值，可以得到不同的画面效果

<div>
<div>
X:<input type="number" min="-100" max="100" step="5" value="0" id="pos_x" >&nbsp;&nbsp;
Y:<input type="number" min="-100" max="100" step="5" value="5" id="pos_y" >&nbsp;&nbsp;
Z:<input type="number" min="-100" max="100" step="5" value="15" id="pos_z" >&nbsp;&nbsp;
反射次数:&nbsp;&nbsp;<input type="number" min="0" max="30" step="1" value="5" id="reflect_times">&nbsp;&nbsp;
<button onclick="javascript:render_pic();" class="btn btn-info">RENDER</button>
</div>
<div style="text-align: center;">
    <canvas id="renderCanvas" width="512" height="512" style="display:none"></canvas>
</div>
</div>
## 代码

查看本页的源代码可以查找到源代码，核心的代码就是如下几行

```javascript
var canvas = document.getElementById('renderCanvas'); // 获取画布对象
canvas.style.display = "block";
var plane = new Plane(new Vector3(0, 1, 0), 0);   // 基本平面 该平面的法向量为(0,1,0)
var sphere1 = new Sphere(new Vector3(-10, 10, -10), 10); //球1 位置(-10,10,-10),半径 10
var sphere2 = new Sphere(new Vector3(10, 10, -10), 10);  //球2 位置(10,10,-10),半径 10
plane.material = new CheckerMaterial(0.1, 0.5);  // 国际象棋棋盘材质
sphere1.material = new PhongMaterial(Color.red, Color.white, 20, 0.25); //球1 Phong材质
sphere2.material = new PhongMaterial(Color.blue, Color.white, 20, 0.25);//球2 Phong材质
rayTraceReflection(
    canvas,
    new Union([plane, sphere1, sphere2]),
    new PerspectiveCamera(new Vector3(0, 5, 15), new Vector3(0, 0, -1), new Vector3(0, 1, 0), 90),
    5);// 渲染参数,视角位置(0,5,15),视角90度,反射5次
```
## 光线追踪

本文的例子实际上是一种光线追踪(ray tracing)的实现.
光线追踪是全局光照(Global Illumination)的其中一中实现方式,该方法原理和实现方法都很简单但需要的计算量比较大,普通游戏无法使用,多用于学习研究性质或离线渲染(offline rendering),游戏中大多用其他技术手段实现类似效果

优点:

1. 效果逼真，实现简单，可以适应各种复杂场景
2. 自带消隐(消除隐藏面)功能
3. 有阴影效果
4. 可以并行
5. 隐含透视性质

缺点:

1. 光线追踪只能模拟光线的镜面反射(specular)行为,无法很好地模拟漫反射(diffuse)
2. 容易出现图形走样现象,因为透过两个相邻像素的光线到物体表面的距离会被放大,两像素之间的细节无法表现

## 基本原理

光线追踪的基本原理比较简单,如下图

![2010032819542028.png](https://i.loli.net/2020/05/09/s9Q1ET82SHAuDgW.png)

> 假设相机就是人眼，从人眼的位置往屏幕上的每个像素发射光线,如果遇到具有反射性质的表面,继续追踪反射光线,最终根据光线返回的颜色去给像素进行着色

因而可以比较简单的表现,反射,阴影折射等效果,但缺点是计算量较大
现在也有很多其他方式可以实现全局光照的效果(例如:辐射度算法,光子映射,甚至采用光照贴图模拟)

这里的光线返回的颜色是该像素点计算得到的颜色,具体计算方法是根据光线在多个物体表面的反射得到

## 渲染深度

渲染深度通俗的讲就是根据某一点距离摄像机的距离渲染出不同的颜色,越远的点颜色越暗,近的点略亮,通过计算模拟眼睛与第一个看到的画面上的点的距离,映射到0-255的区间,进行色彩数值的处理。

## 材质

材质是渲染物体所必不可少的一项要素,材质根据自身的光学特性和物理特性决定了光线照射到物体表面某一点所呈现的颜色

Phong光照模型是一种基本的光照模型,可以较为真实的模拟物体表面的某些特性

**环境光 + 漫反射 + 镜面反射  = Phong **

实现材质效果需要一定的特征函数配合

材质往往和纹理一起配合出现

## 色彩

色彩本身是个极其庞大的学科,本文用到的色彩只是比较简单

仅仅使用增色系统的三原色(RGB)来做一些基本的颜色模拟

使用简单的三元数(R,G,B)来表示颜色的基本信息

<script>
Vector3 = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};
Vector3.prototype = {
    copy: function() {
        return new Vector3(this.x, this.y, this.z);
    },
    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    sqrLength: function() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    },
    normalize: function() {
        var inv = 1 / this.length();
        return new Vector3(this.x * inv, this.y * inv, this.z * inv);
    },
    negate: function() {
        return new Vector3(-this.x, -this.y, -this.z);
    },
    add: function(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    },
    subtract: function(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    },
    multiply: function(f) {
        return new Vector3(this.x * f, this.y * f, this.z * f);
    },
    divide: function(f) {
        var invf = 1 / f;
        return new Vector3(this.x * invf, this.y * invf, this.z * invf);
    },
    dot: function(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },
    cross: function(v) {
        return new Vector3(-this.z * v.y + this.y * v.z, this.z * v.x - this.x * v.z, -this.y * v.x + this.x * v.y);
    }
};
Vector3.zero = new Vector3(0, 0, 0);
Color = function(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b
};
Color.prototype = {
    copy: function() {
        return new Color(this.r, this.g, this.b);
    },
    add: function(c) {
        return new Color(this.r + c.r, this.g + c.g, this.b + c.b);
    },
    multiply: function(s) {
        return new Color(this.r * s, this.g * s, this.b * s);
    },
    modulate: function(c) {
        return new Color(this.r * c.r, this.g * c.g, this.b * c.b);
    },
    saturate: function() {
        this.r = Math.min(this.r, 1);
        this.g = Math.min(this.g, 1);
        this.b = Math.min(this.b, 1);
    }
};
Color.black = new Color(0, 0, 0);
Color.white = new Color(1, 1, 1);
Color.red = new Color(1, 0, 0);
Color.green = new Color(0, 1, 0);
Color.blue = new Color(0, 0, 1);
PhongMaterial = function(diffuse, specular, shininess, reflectiveness) {
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess = shininess;
    this.reflectiveness = reflectiveness;
};
PhongMaterial.prototype = {
    sample: function(ray, position, normal) {
        var NdotL = normal.dot(lightDir);
        var H = (lightDir.subtract(ray.direction)).normalize();
        var NdotH = normal.dot(H);
        var diffuseTerm = this.diffuse.multiply(Math.max(NdotL, 0));
        var specularTerm = this.specular.multiply(Math.pow(Math.max(NdotH, 0), this.shininess));
        return lightColor.modulate(diffuseTerm.add(specularTerm));
    }
};
PerspectiveCamera = function(eye, front, up, fov) {
    this.eye = eye;
    this.front = front;
    this.refUp = up;
    this.fov = fov;
};
PerspectiveCamera.prototype = {
    initialize: function() {
        this.right = this.front.cross(this.refUp);
        this.up = this.right.cross(this.front);
        this.fovScale = Math.tan(this.fov * 0.5 * Math.PI / 180) * 2;
    },
    generateRay: function(x, y) {
        var r = this.right.multiply((x - 0.5) * this.fovScale);
        var u = this.up.multiply((y - 0.5) * this.fovScale);
        return new Ray3(this.eye, this.front.add(r).add(u).normalize());
    }
};
Plane = function(normal, d) {
    this.normal = normal;
    this.d = d;
};
Plane.prototype = {
    copy: function() {
        return new plane(this.normal.copy(), this.d);
    },
    initialize: function() {
        this.position = this.normal.multiply(this.d);
    },
    intersect: function(ray) {
        var a = ray.direction.dot(this.normal);
        if (a >= 0) {
            return IntersectResult.noHit;
        }
        var b = this.normal.dot(ray.origin.subtract(this.position));
        var result = new IntersectResult();
        result.geometry = this;
        result.distance = -b / a;
        result.position = ray.getPoint(result.distance);
        result.normal = this.normal;
        return result;
    }
};
Sphere = function(center, radius) {
    this.center = center;
    this.radius = radius;
};
Sphere.prototype = {
    copy: function() {
        return new Sphere(this.center.copy(), this.radius.copy());
    },
    initialize: function() { this.sqrRadius = this.radius * this.radius; },
    intersect: function(ray) {
        var v = ray.origin.subtract(this.center);
        var a0 = v.sqrLength() - this.sqrRadius;
        var DdotV = ray.direction.dot(v);
        if (DdotV <= 0) {
            var discr = DdotV * DdotV - a0;
            if (discr >= 0) {
                var result = new IntersectResult();
                result.geometry = this;
                result.distance = -DdotV - Math.sqrt(discr);
                result.position = ray.getPoint(result.distance);
                result.normal = result.position.subtract(this.center).normalize();
                return result;
            }
        }
        return IntersectResult.noHit;
    }
};
IntersectResult = function() {
    this.geometry = null;
    this.distance = 0;
    this.position = Vector3.zero;
    this.normal = Vector3.zero;
};
IntersectResult.noHit = new IntersectResult();Union = function(geometries) { this.geometries = geometries; };
Union.prototype = {
    initialize: function() {
        for (var i in this.geometries)
            this.geometries[i].initialize();
    },
    intersect: function(ray) {
        var minDistance = Infinity;
        var minResult = IntersectResult.noHit;
        for (var i in this.geometries) {
            var result = this.geometries[i].intersect(ray);
            if (result.geometry && result.distance < minDistance) {
                minDistance = result.distance;
                minResult = result;
            }
        }
        return minResult;
    }
};
Ray3 = function(origin, direction) {
    this.origin = origin;
    this.direction = direction;
}
Ray3.prototype = {
    getPoint: function(t) {
        return this.origin.add(this.direction.multiply(t));
    }
};
var lightDir = new Vector3(1, 1, 1).normalize();
var lightColor = Color.white;
CheckerMaterial = function(scale, reflectiveness) {
    this.scale = scale;
    this.reflectiveness = reflectiveness;
};
CheckerMaterial.prototype = {
    sample: function(ray, position, normal) {
        return Math.abs((Math.floor(position.x * 0.1) + Math.floor(position.z * this.scale)) % 2) < 1 ? Color.black : Color.white;
    }
};
function rayTraceRecursive(scene, ray, maxReflect) {
    var result = scene.intersect(ray);
    if (result.geometry) {
        var reflectiveness = result.geometry.material.reflectiveness;
        var color = result.geometry.material.sample(ray, result.position, result.normal);
        color = color.multiply(1 - reflectiveness);
        if (reflectiveness > 0 && maxReflect > 0) {
            var r = result.normal.multiply(-2 * result.normal.dot(ray.direction)).add(ray.direction);
            ray = new Ray3(result.position, r);
            var reflectedColor = rayTraceRecursive(scene, ray, maxReflect - 1);
            color = color.add(reflectedColor.multiply(reflectiveness));
        }
        return color;
    } else
        return Color.black;
}
function rayTraceReflection(canvas, scene, camera, maxReflect) {
    if (!canvas || !canvas.getContext)
        return;
    var ctx = canvas.getContext("2d");
    if (!ctx.getImageData)
        return;
    var w = canvas.attributes.width.value;
    var h = canvas.attributes.height.value;
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, w, h);
    var imgdata = ctx.getImageData(0, 0, w, h);
    var pixels = imgdata.data;
    scene.initialize();
    camera.initialize();
    var i = 0;
    for (var y = 0; y < h; y++) {
        var sy = 1 - y / h;
        for (var x = 0; x < w; x++) {
            var sx = x / w;
            var ray = camera.generateRay(sx, sy);
            var color = rayTraceRecursive(scene, ray, maxReflect);
            pixels[i++] = color.r * 255;
            pixels[i++] = color.g * 255;
            pixels[i++] = color.b * 255;
            pixels[i++] = 255;
        }
    }
    ctx.putImageData(imgdata, 0, 0);
}
function render_pic(){
    var canvas = document.getElementById('renderCanvas');
    canvas.style.display = "block";
    var plane = new Plane(new Vector3(0, 1, 0), 0);
    var sphere1 = new Sphere(new Vector3(-10, 10, -10), 10);
    var sphere2 = new Sphere(new Vector3(10, 10, -10), 10);
    plane.material = new CheckerMaterial(0.1, 0.5);
    sphere1.material = new PhongMaterial(Color.red, Color.white, 20, 0.25);
    sphere2.material = new PhongMaterial(Color.blue, Color.white, 20, 0.25);
    var zx,zy,zz,reflect_times,camera;
    zx = parseInt(document.getElementById('pos_x').value,10);
    zy = parseInt(document.getElementById('pos_y').value,10);
    zz = parseInt(document.getElementById('pos_z').value,10);
    reflect_times = parseInt(document.getElementById('reflect_times').value,10);
    camera =  new PerspectiveCamera(new Vector3(zx, zy, zz), new Vector3(0, 0, -1), new Vector3(0, 1, 0), 90);
    rayTraceReflection(
    canvas,
    new Union([plane, sphere1, sphere2]),
    camera,
    reflect_times);
}
</script>