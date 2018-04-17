## 2018April13-BS

HyLi底层函数修改完毕. 

我来负责擦屁股...

目前发现的变更

### DB_UserInfo

#### 1. 

**变更类型** : 类名变更

**变更文件** : `p2pdaigou/code/serverside/DB_UserInfo.py`

| 变更前            | 变更后               |
| ----------------- | -------------------- |
| class DB_UserInfo | class DB_UserInfoNew |

**变更涉及文件** : 

- p2pdaigou/code/main.py
- p2pdaigou/code/Pages/SigninPage.py
- p2pdaigou/code/Pages/SignupPage.py
- p2pdaigou/code/Pages/Profile.py



**修改程序 :**

``` bash
-from DB_UserInfo import DB_UserInfo
+from DB_UserInfo import DB_UserInfoNew
```





#### 2.

**变更类型** : 函数删除

**变更文件** : `p2pdaigou/code/serverside/DB_UserInfo.py`

| 变更前                         | 变更后 |
| ------------------------------ | ------ |
| function GetUserInfoFromColumn | -      |

**变更涉及文件** : 

- p2pdaigou/code/main.py
- p2pdaigou/code/Pages/SigninPage.py
- p2pdaigou/code/Pages/SignupPage.py
- p2pdaigou/code/Pages/Profile.py




---

~~发现用户无法登录~~ (已解决)

1. db文件似乎是空的.

2. 但是查询函数没有返回错误而是卡死在了DataBaseBase.py : GetOneItemFromColumnValue : row = self.c.fetchone() 

   ​



~~用户也无法完成注册.~~(已解决)

1. 注册之前需要查询用户是否存在, 程序卡死, 同上一个问题

2. 在代码里跳过检测用户是否存在, 直接写入用户. 

   提示失败

   ``` bash
   SignupPage.py : Signup : 储存用户
   ERROR: input key: username  is not in DB: /home/bsplu/workspace/p2pdaigou/code/db/p2pDB.db
   ```

   ​

---

21:20

在修改了DataBaseBase.py中bug, 现在可以成功注册.

bug是 : 在循环中修改了dict大小.



----

在修改了查询key值后可以登录. 不知道还有没有其他的key值没改.

还原注册页面对用户名检测, 嫌疑可以检测到重复用户.



---

21:43

可以修改密码






## 2018amar29-BS

- 按照商讨后规则重新写密码用户名检验函数(HyLi)
- 将检验函数整合到程序

## 2018mar29-L
- 语言按钮改浅色

## 2018mar27-L
- prifile改为用户名

## 2018mar26-BS

- 添加j2查询session用户名

## 2018mar26-BS
- 删除DB文件多余用户
- 修改用户名和密码长度要求
- 完成判断用户名和密码是否合法


## 2018mar26-L
- 修复profile页面无法修改语言bug

## 2018mar26-HyLi
- 在serverside里面增加了UsernamPasswordValidation.py文件。该脚本功能是检验密码和用户名的合法性。在检验密码的同时input需要用户名，所以BS所写的套子不符合要求。细节请仔细观察Script_Str.py中函数的接口。
- 因为api有所改动，现在（我猜的话）无法正常运行。
- 发现一个bug。在profile页面无法修改语言。

## 2018mar21-L
- 将ChangePasswd整合进Profile，py部分复制到ProfilePage.py，ChangePasswd.html.j2 和 ChangePasswdPage.py 应该可以直接删掉了
- 将NavBar从HomePage分离
- 添加订单，市场等
- 添加404页面
- 几个细节修改
  - 修改所有按钮颜色
  - 修正注册页输入框间隔
  - 修正登陆注册按钮间隙


## 2018mar18-BS

已完成

1. 注册新用户
2. 修改密码

**至此BS的第一阶段任务全部完成.**

第一阶段, 未完成部分

1. 注册用户时密码和用户名的合法性(**Hengyue**)
2. 404页面(**L**)



## 2018mar17-BS

未完...需要修改的地方

1. siginup 错误提示无法翻译成中文
  需要完全舍弃掉validators方法

2. 注册用户对字符合法化的判断

3. 注册用户后没有把用户储存到DB文件中

4. profile在未登录的时候不能访问, 需要返回404

   ​

## 2018mar15-L

- 哇。。。BS把这写得好乱啊。。。整理整理好伐。。。~~我发现我被吐槽了...我觉得很整齐啊~~
- 给signin页面加了背景色，还是照抄example
- 把signin页面的error提示用bootstrap装饰了一下。。。但是并没有觉得变好看。。。你们怎么看？
- 添加了signup页面
- 添加了profile页面，发现目前的设计在移动端不好看，目前打算
    - 把market, creat order, my order 放到navbar中，会单独跳转到页面，当然是登陆后可见
    - 修改密码和修改资料留来本页，用tab，也就是目前看到的效果，tab少的话应该没问题

## 2018mar13-BS
准备实现语言国际化和本地化.

使用[flask扩展](http://translations.readthedocs.io/en/latest/flask-babel.html).

### 注意
Ubuntu 平台
运行pybabel extract -F babel.cfg -o messages.pot . 弹出错误
``` bash
pkg_resources.extern.packaging.markers.UndefinedEnvironmentName: 'extra' does not exist in evaluation environment.
```
python的bug. 一旦出现, 覆盖安装setuptools, 目前没有bug最新的为34.4.1
``` bash
pip install --ignore-installed setuptools==34.4.1
```
[具体问题解决网页](https://github.com/pypa/setuptools/issues/523)

## 2018Mar10-BS

- session需要调查一下

## 2018mar09-L

- 添加了Signin.html Signin.css

- 本来想尝试单独写一个 Signin.py ，失败了，不会写，根据 http://flask.pocoo.org/docs/0.12/patterns/packages/ 中的的范例，好像所有页面是共用一个py的。所以def Signin 暂时也写到 HomePage.py 里了

- 我的新电脑到了，预计要折腾一两天。

- 照搬了我自己practice3的代码在 Signin.html 里用上了wtf。你们谁把登陆的py部分写一写？

  **BS写.**



  ​

## 2018mar08-L
- 修改了HomePage.html
    - 切换语言，目前在html中硬编码，之后可能需要**BS**修改成i18n的形式
    - 未完成，导航条右侧需要根据用户登陆状态动态显示，可能需要先完成用户登陆部分
    - 关于bootstrap，直接在html中引用了文件，没有调用flask-bootstrap插件
- 添加了HomePage.js HomePage.css icon/globe.svg DieGoLogo.png
- 修改运行地址为 0.0.0.0 以便手机端测试

请BS和YHH在doc里面找到‘页面拓扑和结构.pdf’。 这个是我的总体规划。第一页我定义了一些符号。第二页是page list，罗列出了所有的pages。每一个page我用‘@’符号标出。从第三页开始，每一个页的内容正好就是一个page。你们只要按照里面的说明将功能实现就行。

代码的框架我也设计好了，在code里面。你们按照这个框架打代码就行。
