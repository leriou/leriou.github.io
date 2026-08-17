---
title: "常用的设计模式总结"
published: 2015-12-30
category: "计算机编程"
tags: ["design-pattern"]
description: "总结一些常用的设计模式 # 适配器模式"
---

总结一些常用的设计模式
# 适配器模式

- **概念**

将一个类的接口转换成客户希望的另外一个接口。Adapter模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作

- **主要角色**

**目标(Target)角色**：定义客户端使用的与特定领域相关的接口，这也就是我们所期待得到的

**源(Adaptee)角色**：需要进行适配的接口

**适配器(Adapter)角色**：对Adaptee的接口与Target接口进行适配；适配器是本模式的核心，适配器把源接口转换成目标接口，此角色为具体类

- **适用性** 

1. 你想使用一个已经存在的类，而它的接口不符合你的需求
2. 你想创建一个可以复用的类，该类可以与其他不相关的类或不可预见的类协同工作
3. 你想使用一个已经存在的子类，但是不可能对每一个都进行子类化以匹配它们的接口。对象适配器可以适配它的父类接口（仅限于对象适配器）

在实际应用中，适配器模式分为类适配器和对象适配器

**类适配器**

```php
//目标角色
interface ITarget  
{  
    function operation1();  
    function operation2();  
}  
//源角色  
interface IAdaptee  
{  
    function operation1();  
}  
  
class Adaptee implements IAdaptee  
{  
    public  function operation1()  
    {  
        echo "原方法";  
    }  
}  

//适配器角色  
class Adapter extends Adaptee implements IAdaptee, ITarget  
{  
    public  function operation2()  
    {  
        echo "适配方法";  
    }  
}  
  
class Client  
{  
    public  function test()  
    {  
        $adapter = new Adapter();  
        $adapter->operation1();//原方法  
        $adapter->operation2();//适配方法  
    }  
}

```

**对象适配器**

```php
//目标角色
interface ITarget  
{  
    function operation1();  
    function operation2();  
}  
//源角色   
interface IAdaptee  
{  
    function operation1();  
}  
  
class Adaptee implements IAdaptee  
{  
    public  function operation1()  
    {  
        echo "原方法";  
    }  
}  
//适配器角色  
class Adapter implements ITarget  
{  
    private $adaptee;  
  
    public function __construct($adaptee)  
    {  
        $this->adaptee = $adaptee;  
    }  
  
    public  function operation1()  
    {  
         return $this->adaptee->operation1();  
    }  
  
    public  function operation2()  
    {  
        echo "适配方法";  
    }  
    
}  
  
  
class Client  
{  
    public  function test()  
    {  
        $adapter = new Adapter(new Adaptee(null));  
        $adapter->operation1();//原方法  
        $adapter->operation2();//适配方法  
    }  
}

```

>类适配器中适配器继承原有的Adaptee类，自己实现原类没有的操作，使用的是继承模式，而对象适配器使用的是组合模式，将adaptee作为adapter的一个引用。由于组合在耦合性上小于继承，对象适配器显得更加灵活但缺点是增加代码量。 需要重写adapee中的方法的数量太大的话，可以考虑在adapter类中添加`__call`方法委托adapee取得客户端调用的方法

```php

public function __call($func, $args)  
{  
    if (is_callable(array($this->adaptee, $func))) {  
        return $this->adaptee->$func($args);  
    }  
    trigger_error('*********', E_USER_ERROR);  
}

```


# 装饰器模式

- **装饰器模式概念**

>在不必改变原类文件和使用继承的情况下，动态地扩展一个对象的功能，它是通过创建一个包装对象，也就是装饰来包裹真实的对象。

- **装饰器模式特点**

1. 装饰对象和真实对象有相同的接口。这样客户端对象就能以和真实对象相同的方式和装饰对象交互。
2. 装饰对象包含一个真实对象的引用（reference）
3. 装饰对象接受所有来自客户端的请求。它把这些请求转发给真实的对象。
4. 装饰对象可以在转发这些请求以前或以后增加一些附加功能。这样就确保了在运行时，不用修改给定对象的结构就可以在外部增加附加的功能。在面向对象的设计中，通常是通过继承来实现对给定类的功能扩展。

- **适用性**

1. 需要扩展一个类的功能，或给一个类添加附加职责。
2. 需要动态的给一个对象添加功能，这些功能可以再动态的撤销。
3. 需要增加由一些基本功能的排列组合而产生的非常大量的功能，从而使继承关系变的不现实。
4. 当不能采用生成子类的方法进行扩充时。一种情况是，可能有大量独立的扩展，为支持每一种组合将产生大量的子类，使得子类数目呈爆炸性增长。另一种情况可能是因为类定义被隐藏，或类定义不能用于生成子类。

- **优点**

1. Decorator模式与继承关系的目的都是要扩展对象的功能，但是Decorator可以提供比继承更多的灵活性。
2. 通过使用不同的具体装饰类以及这些装饰类的排列组合，设计师可以创造出很多不同行为的组合。

- **缺点**

1. 这种比继承更加灵活机动的特性，也同时意味着更加多的复杂性。
2. 装饰模式会导致设计中出现许多小类，如果过度使用，会使程序变得很复杂。
3. 装饰模式是针对抽象组件（Component）类型编程。但是，如果你要针对具体组件编程时，就应该重新思考你的应用架构，以及装饰者是否合适。当然也可以改变Component接口，增加新的公开的行为，实现“半透明”的装饰者模式。在实际项目中要做出最佳选择。

- **设计原则**

1. 多用组合，少用继承。
2. 类应设计的对扩展开放，对修改关闭。

- **装饰器模式实例**

```php

//抽象接口类
interface IDecorator{
  function sayMsg();
}

//具体装饰类1
class decorator1 implements IDecorator{
  function sayMsg(){
    echo "增加功能1";
  }
}
//具体装饰类2
class decorator2 implements IDecorator{
  function sayMsg(){
    echo "增加功能2";
  }
}

class MailTest{
    private $decorators;
    function addDecorator(IDecorator $decorator){
        $this->decorators[] = $decorator;
    }

    function addExtraFunction(){
        foreach ($this->decorators as $decorator) {
            $decorator->sayMsg();
        }
    }

    function test(){
        $this->addExtraFunction();
        echo "I am test";
    }
}

$mailTest = new MailTest();

$decorator1 = new decorator1();
$decorator2 = new decorator2();

$mailTest->addDecorator($decorator1);
$mailTest->addDecorator($decorator2);

$mailTest->test();

```

# 工厂模式

- **概念及特点**

面向对象设计强调抽象类高于实现，也就是说我们要尽量一般化而不是特殊化，工厂模式解决了当代码关于抽象类型时如何创建对象实例的问题。

工厂模式就是把创建对象的过程封装起来，这样随时可以产生一个新的对象，减少代码之间耦合。

通俗的说，常规的创建一个对象要使用new，工厂模式就是把这个过程封装起来，使用一个工厂类来创建对象

如果不使用工厂模式，那么很多地方调用类Database，代码就会这样子创建一个实例：new Database(),假设某天需要修改Database类的名称那么调用Database类的代码都要修改。

- **工厂模式举例**

假如已经有一个数据库类Database

```php

class Factory{

    static function createDatabase(){
	$db = new Database();
	return $db;
    }
}

```
创建数据库类

```php

$db = Factory::createDatabase();

```

# 抽象工厂模式

- **概念**

>为创建一组相关或相互依赖的对象提供一个接口，而且无需指定他们的具体类


- **特点**

抽象工厂模式（Abstact Factory）是一种常见的软件设计模式，该模式为一个产品族提供了统一的创建接口。当需要这个产品族的某一系列的时候，可以为此系列的产品族创建一个具体的工厂类。

- **主要角色**

**抽象工厂(Abstract Factory)角色**：它声明一个创建抽象产品对象的接口。通常以接口或抽象类实现，所有的具体工厂类必须实现这个接口或继承这个类。

**具体工厂(Concrete Factory)角色**：实现创建产品对象的操作。客户端直接调用这个角色创建产品的实例。这个角色包含有选择合适的产品对象的逻辑。通常使用具体类实现。

**抽象产品(Abstract Product)角色**：声明一类产品的接口。它是工厂方法模式所创建的对象的父类，或它们共同拥有的接口。

**具体产品(Concrete Product)角色**：实现抽象产品角色所定义的接口，定义一个将被相应的具体工厂创建的产品对象。其内部包含了应用程序的业务逻辑。

- **优缺点**

**抽象工厂模式的优点**:

1. 分离了具体的类
2. 使增加或替换产品族变得容易
3. 有利于产品的一致性

**抽象工厂模式的缺点**:

难以支持新种类的产品。这是因为AbstractFactory接口确定了可以被创建的产品集合。支持新各类的产品就需要扩展访工厂接口，从而导致AbstractFactory类及其所有子类的改变。
抽象工厂就是以一种倾斜的方式支持增加新的产品中，它为新产品族的增加提供了方便，而不能为新的产品等级结构的增加提供这样的方便。

- **适用性**

1. 一个系统不应当依赖于产品类实例如何被创建、组合和表达的细节，这对于所有形态的工厂模式都是重要的。
2. 这个系统的产品有多于一个的产品族，而系统只消费其中某一族的产品。
3. 同属于同一个产品族的产品是在一起使用的，这一约束必须在系统的设计中体现出来。
4. 系统提供一个产品类的库，所有的产品以同样的接口出现，从而使用客户端不依赖于实现

- **抽象工厂模式实例**

```php

//抽象工厂
interface AnimalFactory {

    public function createCat();
    public function createDog();

}

//具体工厂
class BlackAnimalFactory implements AnimalFactory {

    function createCat(){
        return new BlackCat();
    }

    function createDog(){
        return new BlackDog();
    }
}

class WhiteAnimalFactory implements AnimalFactory {

    function createCat(){
        return new WhiteCat();
    }

    function createDog(){
        return new WhiteDog();
    }
}

//抽象产品
interface Cat {
    function Voice();
}

interface Dog {
    function Voice();
}

//具体产品
class BlackCat implements Cat {

    function Voice(){
        echo '黑猫喵喵喵';
    }
}

class WhiteCat implements Cat {

    function Voice(){
        echo '白猫喵喵喵';
    }
}

class BlackDog implements Dog {

    function Voice(){
        echo '黑狗汪汪汪';
    }
}

class WhiteDog implements Dog {

    function Voice(){
        echo '白狗汪汪汪';
    }
}

//客户端
class Client {

    public static function main() {
        self::run(new BlackAnimalFactory());
        self::run(new WhiteAnimalFactory());
    }

    public static function run(AnimalFactory $AnimalFactory){
        $cat = $AnimalFactory->createCat();
        $cat->Voice();

        $dog = $AnimalFactory->createDog();
        $dog->Voice();
    }
}
Client::main();

```

# 迭代器模式

- **迭代器模式概念**

>在不需要了解内部实现的前提下，遍历一个聚合对象的内部元素而又不暴露该对象的内部表示。

- **适用场景**

* 访问一个聚合对象的内容而无需暴露它的内部表示
* 支持对聚合对象的多种遍历
* 为遍历不同的聚合结构提供一个统一的接口

- **迭代器模式实例**

```php

class ConcreteIterator implements Iterator{
	private $position = 0;
	private $arr;
	function __construct(array $arr){
		$this->arr = $arr;
	}

	function rewind(){
		$this->position = 0;
	}

	function current(){
		return $this->arr[$this->position];
	}

	function key(){
		return $this->position;
	}

	function next(){
		++$this->position;
	}

	function valid(){
		return isset($this->arr[$this->position]);
	}
}

$arr = array('xiao hong','xiao ming','xiaohua');
$concreteIterator = new ConcreteIterator($arr);
foreach ($concreteIterator as $key => $value) {
	echo $key."=>".$value."\n";
}

```

# 观察者模式

- **观察者模式概念**

>观察者模式（有时又被称为发布（publish）-订阅（Subscribe）模式、模型-视图（View）模式、源-收听者(Listener)模式或从属者模式），在此种模式中，当一个对象状态发生改变时，依赖它的对象全部会收到通知，并自动更新。

- **使用场景**

一个事件发生以后，要执行一连串更新操作，传统编程方法就是在事件的代码之后直接加入处理逻辑，当更新的逻辑增多之后，代码会变得难以维护，这种方式是耦合的，侵入式的，增加新的逻辑需要修改事件主体的代码。观察者模式实现了低耦合非侵入式的通知与更新机制。

- **实现方式**

从根本上说，该模式必须包含两个角色：观察者和被观察对象。观察者和被观察者之间存在“观察”的逻辑关联，当被观察者发生改变的时候，观察者就会观察到这样的变化。

- **观察者模式实例**

```php

//观察者，需要用到观察者模式的类需实现此接口
interface Observer
{
    function update($event_info = null);
}
//被观察者（一个抽象类，方便扩展）
abstract class Observable{
    private $observers = array();

    function addObserver(Observer $observer)
    {
        $this->observers[] = $observer;
    }

    function notify()
    {
        foreach($this->observers as $observer)
        {
            $observer->update();
        }
    }
}

class ConcreteObservable extends Observable{
    function trigger()
    {
        $this->notify();
    }
}

class Observer1 implements Observer{
    function update($event_info = null){
        echo "action one";
    }
}

class Observer2 implements Observer{
    function update($event_info = null){
        echo "action two";
    }
}

$event = new ConcreteObservable();
//添加观察者
$event->addObserver(new Observer1);
$event->addObserver(new Observer2);
$event->trigger();

```

# 数据对象映射(ORM)

- **数据对象映射模式概念**

>将对象和数据存储映射起来，对一个对象的操作会映射为对数据存储的操作

- **数据对象映射模式实例**

```php
class User
{
    protected $id;
    protected $data;
    protected $db;
    protected $change = false;

    function __construct($id)
    {
        $this->db = Factory::getDatabase();
        $res = $this->db->query("select * from user where id = $id limit 1");
        $this->data = $res->fetch_assoc();
        $this->id = $id;
    }

    function __get($key)
    {
        if (isset($this->data[$key]))
        {
            return $this->data[$key];
        }
    }

    function __set($key, $value)
    {
        $this->data[$key] = $value;
        $this->change = true;
    }

    function __destruct()
    {
        if ($this->change)
        {
            foreach ($this->data as $k => $v)
            {
                $fields[] = "$k = '{$v}'";
            }
            $this->db->query("update user set " . implode(', ', $fields) . "where
            id = {$this->id} limit 1");
        }
    }
}

$user = new User(1);
$user->mobile = '18888888888'；
$user->name = 'test'；
```

# 原型模式

- **原型模式概念**

>用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。

-**使用场景**

它主要面对的问题是：“某些结构复杂的对象”的创建工作；由于需求的变化，这些对象经常面临着剧烈的变化，但是他们却拥有比较稳定一致的接口。原型模式适用于大型对象的创建，创建一个大型对象需要很大的开销，如果每次new就会消耗很大，原型模式只需内存拷贝即可

-**主要角色**

1. 抽象原型(Prototype)角色：声明一个克隆自身的接口
2. 具体原型(Concrete Prototype)角色：实现一个克隆自身的操作

-**原型模式实例**

```php
  
//抽象原型
interface Prototype {  
    public function copy();   
}     
  
//具体原型
class ConcretePrototype implements Prototype {  
    private $name;  
      
    function __construct($name){  
        $this->name = $name;  
    }  
      
    function getName(){  
        return $this->name;  
    }  
      
    function setName($name){  
        $this->name = $name;  
    }  
      
    //克隆  
    function copy(){  
        return clone $this;  
    }  
}  
  
//客户端  
class Client {  
      
    public static function main(){  
          
        $pro = new ConcretePrototype('test');  
        $pro2 = $pro->copy();  
        echo $pro->getName();  
        echo $pro2->getName();  
    }   
}  
  
Client::main();  

```

# 代理模式

- **代理模式定义**

>为其他对象提供一种代理以控制对这个对象的访问。在某些情况下，一个对象不适合或者不能直接引用另一个对象，而代理对象可以在客户端和目标对象之间起到中介的作用

- **主要角色**

    * 抽象角色：通过接口或抽象类声明真实角色实现的业务方法。
    * 代理角色：实现抽象角色，是真实角色的代理，通过真实角色的业务逻辑方法来实现抽象方法，并可以附加自己的操作。
    * 真实角色：实现抽象角色，定义真实角色所要实现的业务逻辑，供代理角色调用。

- **优点**

1. 职责清晰
2. 代理对象可以在客户端和目标对象之间起到中介的作用，这样起到了中介的作用和保护了目标对象的作用。
3. 高扩展性

- **代理模式实例**

```php
//抽象角色
interface IGiveGift  
{  
    function giveRose();  
    function giveChocolate();  
}  
  
//真实角色
class Follower implements IGiveGift  
{  
    private $girlName;  
  
    function __construct($name='Girl')  
    {  
        $this->girlName=$name;  
    }  
  
    function giveRose()  
    {  
        echo "{$this->girlName}:送你的玫瑰<br/>";  
    }  
  
    function giveChocolate()  
    {  
        echo "{$this->girlName}:送你的巧克力<br/>";  
    }  
}  
  

//代理角色
class Proxy implements IGiveGift  
{  
    private $follower;  
  
    function __construct($name='Girl')  
    {  
        $this->follower=new Follower($name);  
    }  
  
    function giveRose()  
    {  
        $this->follower->giveRose();  
    }  
  
    function giveChocolate()  
    {  
        $this->follower->giveChocolate();  
    }  
}

$proxy=new Proxy('xxx');  
$proxy->giveRose();  
$proxy->giveChocolate();

```

# 注册树模式

- **注册树模式概念**

>注册树模式也叫注册模式或注册器模式。注册树模式将对象实例注册到一棵全局的对象树上，需要的时候从对象树上获取即可。   

- **注册树模式优点**

　　单例模式创建唯一对象的过程本身还有一种判断，即判断对象是否存在，存在则返回对象，不存在则创建对象并返回。 工厂模式更多考虑的是扩展维护的问题。 总的来说，单例模式和工厂模式可以产生更加合理的对象。怎么方便调用这些对象呢？注册树模式是一种不错的选择。不管是通过单例模式还是工厂模式还是二者结合生成的对象，都统统给我插入到注册树上，用某个对象的时候，直接从注册树上获取即可。

- **注册树模式实例**

假如已经存在类Database；

```php

class Register
{
    protected static $objects;

    static function set($alias, $object)
    {
        self::$objects[$alias] = $object;
    }

    static function get($key)
    {
        if (!isset(self::$objects[$key]))
        {
            return false;
        }
        return self::$objects[$key];
    }

    function _unset($alias)
    {
        unset(self::$objects[$alias]);
    }
}

class Factory{
    static function createDatabase(){
	$db = new Database();
	//插入到注册树
	Register::set('db1', $db);
    }
}

//从注册树里获取
$db = Register::get('db1');

```


# 单例模式

- **单例模式概念**

>一个类有且仅有一个实例，并且自行实例化向整个系统提供

- **单例模式的特点**

1. 一个类在整个应用中只有一个实例
2. 类必须自行创建这个实例
3. 必须自行向整个系统提供这个实例

- **单例模式举例**

一个应用中有一个数据库的类Database，如果不用单例模式，每次new都会消耗大量的资源，而且每次打开和关闭数据库连接也会消耗一些资源，如果使用单例模式则不会存在这些问题。
使用单例模式实现代码：

```php

<?php

class Database
{
    static private $db;

    private function __construct()
    {

    }
    
    static function getInstance()
    {
        if (empty(self::$db)) {
            self::$db = new self;
            return self::$db;
        } 
        return self::$db;
    }
}

```
使用方法：

`$db = Database::getInstance();`


# state模式

- **概念**

>不同的状态,不同的行为;或者说,每个状态有着相应的行为.

- **使用场景**

State模式在实际使用中比较多,适合"状态的切换".因为我们经常会使用`If elseif else` 进行状态切换, 如果针对状态的这样判断切换反复出现,我们就要联想到是否可以采取State模式了.

不只是根据状态,也有根据属性.如果某个对象的属性不同,对象的行为就不一样,这点在数据库系统中出现频率比较高,我们经常会在一个数据表的尾部,加上property属性含义的字段,用以标识记录中一些特殊性质的记录,这种属性的改变(切换)又是随时可能发生的,就有可能要使用State.

**适用性**：

在下面的两情况下均可以使用State模式：

1. 一个对象的行为取决于它的状态，并且必须在运行时刻根据状态改变它的行为。
2. 一个操作中含有庞大的多分支的条件豫剧，并且这些分支依赖于该对象的状态，这个状态通常用一个或多个枚举常量表示。通常，有多个操作包含这一相同的条件结构，State模式将每一个条件分支放入一个单独的类中。这使得你可以根据对象自身的情况将对象的状态作为一个对象，这一对象可以不依赖于其他对象而独立变化。

- **参与者**

- Context(环境，Person)定义客户感兴趣的类。
- State(Moodstate)：定义一个接口以封装与Context的一个特定状态相关的行为
- ConcreteState Subclasses(具体状态子类，如Angry)每一个子类实现一个与Context的状态相关的行为。

他们的协作关系是：

- Context将于状态相关的请求委托给当前的ConcreteState对象处理。
- Context可将自身作为一个参数传递给处理该请求的状态对象，这使得状态对象在必要的时候可访问Context。
- Context是客户使用的主要接口，客户可用状态对象来配置一个Context，一旦一个Context配置完毕，他的客户不再需要直接与状态对象打交道。
- Context或者ConcreteState子类都可以决定哪个状态是另外那个状态的后继者，以及是在何种条件下进行状态转换。

- **如何使用**

State需要两种类型实体参与:

1. state manager 状态管理器 ,就是开关 ,如上面例子的Context实际就是一个state manager, 在state manager中有对状态的切换动作.
2. 用抽象类或接口实现的父类,,不同状态就是继承这个父类的不同子类.

以上面的Context为例.我们要修改它,建立两个类型的实体.
第一步: 首先建立一个父类:

```php

interface MoodState
{
    public function doSomething();
    public function changeState();
}

```

父类中的方法要对应state manager中的开关行为,在state manager中 本例就是Context中,开关动作为changeState.那么在状态父类中就要有具体处理这个动作:changeState(); 同时还需要一个doSomething();

下面是具体子类的实现:

```php

class Angry implements MoodState
{
    public $p;
    public function __construct($p)
    {
        $this->p = $p;
    }

    public function doSomething()
    {
        echo "i am angry\r\n";
    }

    public function changeState()
    {
        $this->p->setState(new Happy($this->p));
    }
}

```

同样 其他状态的子类实现如Angry一样.

第二步: 要重新改写State manager 也就是本例的Context:

```php

class Person
{
    public function __construct()
    {
        $this->state = new Mad($this);
    }

    public function setState($state)
    {
        $this->state = $state;
    }

    public function doSomething()
    {
        $this->state->doSomething();
        $this->state->changeState();
    }
}

```

至此,我们也就实现了State的refactorying过程.

以上只是相当简单的一个实例,在实际应用中,处理是复杂的.

**状态模式优点**：

1. 封装转换过程，也就是转换规则
2. 枚举可能的状态，因此，需要事先确定状态种类。

>状态模式可以允许客户端改变状态的转换行为，而状态机则是能够自动改变状态，状态机是一个比较独立的而且复杂的机制，具体可参考一个状态机开源项目：[项目地址][1]

状态模式在工作流或游戏等各种系统中有大量使用，甚至是这些系统的核心功能设计，例如政府OA中，一个批文的状态有多种：未办；正在办理；正在批示；正在审核；已经完成等各种状态，使用状态机可以封装这个状态的变化规则，从而达到扩充状态时，不必涉及到状态的使用者。

在网络游戏中，一个游戏活动存在开始；开玩；正在玩；输赢等各种状态，使用状态模式就可以实现游戏状态的总控，而游戏状态决定了游戏的各个方面，使用状态模式可以对整个游戏架构功能实现起到决定的主导作用。

状态模式实质：

**使用状态模式前，客户端外界需要介入改变状态，而状态改变的实现是琐碎或复杂的。**

使用状态模式后，客户端外界可以直接使用事件Event实现，根本不必关心该事件导致如何状态变化，这些是由状态机等内部实现。

这是一种Event-condition-State，状态模式封装了condition-State部分。

每个状态形成一个子类，每个状态只关心它的下一个可能状态，从而无形中形成了状态转换的规则。如果新的状态加入，只涉及它的前一个状态修改和定义。

状态转换有几个方法实现：一个在每个状态实现next()，指定下一个状态；还有一种方法，设定一个StateOwner，在StateOwner设定stateEnter状态进入和stateExit状态退出行为。

状态从一个方面说明了流程，流程是随时间而改变，状态是截取流程某个时间片。

- **实例**

```php
/**
 * state 设计模式.
 */
interface MoodState
{
    public function doSomething();
    public function changeState();
}

class Angry implements MoodState
{
    public $p;
    public function __construct($p)
    {
        $this->p = $p;
    }

    public function doSomething()
    {
        echo "i am angry\r\n";
    }

    public function changeState()
    {
        $this->p->setState(new Happy($this->p));
    }
}

class Happy implements MoodState
{
    public $p;
    public function __construct($p)
    {
        $this->p = $p;
    }

    public function doSomething()
    {
        echo "i am Happy\r\n";
    }

    public function changeState()
    {
        $this->p->setState(new Mad($this->p));
    }
}

class Mad implements MoodState
{
    public $p;
    public function __construct($p)
    {
        $this->p = $p;
    }

    public function doSomething()
    {
        echo "i am mad\r\n";
    }

    public function changeState()
    {
        $this->p->setState(new Angry($this->p));
    }
}

class Person
{
    public function __construct()
    {
        $this->state = new Mad($this);
    }

    public function setState($state)
    {
        $this->state = $state;
    }

    public function doSomething()
    {
        $this->state->doSomething();
        $this->state->changeState();
    }
}

class client
{
    public function __construct()
    {
        $p = new Person();
        for ($i = 0;$i < 10;++$i) {
            echo "the $i times:";
            $p->doSomething();
        }
    }
}

$c = new Client();

```
[1]:http://sourceforge.net/projects/smframework/



# 策略模式

- **策略模式概念**

>策略模式定义了一系列的算法，并将每一个算法封装起来，而且使它们还可以相互替换。策略模式让算法独立于使用它的客户而独立变化。

- **主要角色**

* 抽象策略角色： 策略类，通常由一个接口或者抽象类实现。
* 具体策略角色：包装了相关的算法和行为。
* 环境角色：持有一个策略类的引用，最终给客户端调用。

- **应用场景**

1. 多个类只区别在表现行为不同，可以使用Strategy模式，在运行时动态选择具体要执行的行为。
2. 需要在不同情况下使用不同的策略(算法)，或者策略还可能在未来用其它方式来实现。
3. 对客户隐藏具体策略(算法)的实现细节，彼此完全独立。

- **优点**

1. 策略模式提供了管理相关的算法族的办法。策略类的等级结构定义了一个算法或行为族。恰当使用继承可以把公共的代码转移到父类里面，从而避免重复的代码。
2. 策略模式提供了可以替换继承关系的办法。继承可以处理多种算法或行为。如果不是用策略模式，那么使用算法或行为的环境类就可能会有一些子类，每一个子类提供一个不同的算法或行为。但是，这样一来算法或行为的使用者就和算法或行为本身混在一起。决定使用哪一种算法或采取哪一种行为的逻辑就和算法或行为的逻辑混合在一起，从而不可能再独立演化。继承使得动态改变算法或行为变得不可能。
3. 使用策略模式可以避免使用多重条件转移语句。多重转移语句不易维护，它把采取哪一种算法或采取哪一种行为的逻辑与算法或行为的逻辑混合在一起，统统列在一个多重转移语句里面，比使用继承的办法还要原始和落后。

- **缺点**

 1. 客户端必须知道所有的策略类，并自行决定使用哪一个策略类。这就意味着客户端必须理解这些算法的区别，以便适时选择恰当的算法类。换言之，策略模式只适用于客户端知道所有的算法或行为的情况。
 2. 策略模式造成很多的策略类，每个具体策略类都会产生一个新类。有时候可以通过把依赖于环境的状态保存到客户端里面，而将策略类设计成可共享的，这样策略类实例可以被不同客户端使用。换言之，可以使用享元模式来减少对象的数量。

- **策略模式实例**

```php

/**
*策略模式
*定义一系列的算法,把每一个算法封装起来,并且使它们可相互替换。
*本模式使得算法可独立于使用它的客户变化
*/

/**
*出行旅游
*/
interface TravelStrategy{
    public function travelAlgorithm();
}

/**
*具体策略类(ConcreteStrategy)
*1：乘坐飞机
*/
class AirPlanelStrategy implements TravelStrategy{
    public function travelAlgorithm(){
        echo"travelbyAirPlain","<BR>\r\n";
    }
}

/**
*具体策略类(ConcreteStrategy)
*2：乘坐火车
*/
class TrainStrategy implements TravelStrategy{
    public function travelAlgorithm(){
        echo"travelbyTrain","<BR>\r\n";
    }
}
/**
*具体策略类(ConcreteStrategy)
*3：骑自行车
*/
class BicycleStrategy implements TravelStrategy{
    public function travelAlgorithm(){
        echo"travelbyBicycle","<BR>\r\n";
    }
}

/**
*
*环境类(Context):
*用一个ConcreteStrategy对象来配置。
*维护一个对Strategy对象的引用。可定义一个接口来让Strategy访问它的数据。
*算法解决类，以提供客户选择使用何种解决方案：
*/
class PersonContext{
    private$_strategy = null;
    public function __construct(TravelStrategy $travel){
        $this->_strategy=$travel;
    }
    /**
    *旅行
    */
    public function setTravelStrategy(TravelStrategy $travel){
        $this->_strategy=$travel;
    }
    /**
    *旅行
    */
    public function travel(){
        return$this->_strategy->travelAlgorithm();
    }

}
//乘坐火车旅行
$person=new PersonContext(new TrainStrategy());
$person->travel();

//改骑自行车
$person->setTravelStrategy(new BicycleStrategy());
$person->travel();

```

