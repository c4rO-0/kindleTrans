# 须知

该文件用来记录运行程序, 和开发程序的注意事项
开发日志请转移到[DevLog.md](./DevLog.md)

---

[TOC]

---



## 程序运行

### git

#### 初始化git环境

- git自动补全

  ``` bash
  # 在~/.bashrc文件下
  # 添加以下内容
  . /etc/bash_completion.d/git
  ```

  执行

  ``` bash
  $ source ~/.bashrc
  ```

  ​


- 设置用户名

  ``` bash
  # 使用github的名字
  $ git config --global user.name 用户名
  $ git config --global user.email 邮箱
  ```

  ​


#### clone

``` bash
# 克隆项目
$ git clone https://github.com/c4rO-0/kindleTrans.git
# 子项目目前为空
# 初始化子项目
$ git submodule init
# 克隆子项目
$ git submodule update
```

####




### 安装环境

1. 初始化

   ``` bash
   $ python3 -m venv 环境文件夹名字
   ```

2. 启动

   ``` bash
   $ source 环境文件夹名字/bin/active
   ```

3. 退出

   ``` bash
   $ deactivate
   ```

   ​



###安装python依赖

``` bash
$ pip install -r requirements.txt
```

**注意 :**

Ubuntu/Debain存在bug导致requirements.txt文件里可能存在`pkg-resources==0.0.0`. 导致在其他平台运行无法安装依赖包. 遇到这种情况可以手动删除该句.



### linux环境依赖

因为程序是直接在了linux上运行的, 有一些动作直接调用了linux命令

1. cd

2. enca

   对文本文件进行转码

3. convert

   命令行下P图

4. kindlegen

   amazon发布的转mobi工具. 该工具有windows版本的. 但是项目里默认的是linux版.

   ​



### 导出python依赖

 ``` bash
$ pip freeze > requirements.txt
 ```

**注意:**

对于Ubuntu/Debian系统用户,请使用

``` bash
pip freeze | grep -v "pkg-resources" > requirements.txt
```

Ubuntu/Debain存在bug导致requirements.txt文件里可能存在`pkg-resources==0.0.0`, 其他平台无法使用.


### 在服务器端运行
因为现在还是测试阶段, 所以没有单独创建服务进程.
目前使用scrren来完成后台运行,以及多用户交互.
因为一个窗口同时只能存在一个用户登录.
所以在该窗口里仅是运行python, 编程可以在窗口之外进行.

具体使用:
``` bash
# 查看当前正在运行的窗口
$ screen -ls
# 统一规定我们使用的窗口的名字为kindle
# 链接kindle窗口
$ screen -x kindle
# 退出窗口
ctrl-a d
# 如果kindle窗口不存在, 创建窗口
$ screen -S kindle
# 如果提示attached无法链接, 踢掉上一个用户(上一个用户可能是自己), 再重新链接
$ screen -D  -r <session-id>

```

### 需要翻译的文字

在html里

`{{ gettext("需要在网页显示的文字") }}`

`{{ gettext("显示变量 %(var)s ", var=varname) }}`

在.py里

var = gettext("要传递的变量")

### 更新翻译模板

/code下执行
``` bash
$ pybabel extract -F babel.cfg -o messages.pot .
$ pybabel update -i messages.pot -d translations
```
翻译translations/zh/LC_MESSAGES/messages.po 文件

编译
``` bash
$ pybabel compile -d translations
```



### 运行错误

#### extra does not exist

Ubuntu 平台
运行pybabel extract -F babel.cfg -o messages.pot . 弹出错误

```bash
pkg_resources.extern.packaging.markers.UndefinedEnvironmentName: 'extra' does not exist in evaluation environment.
```

python的bug. 一旦出现, 覆盖安装setuptools, 目前没有bug最新的为34.4.1

```bash
pip install --ignore-installed setuptools==34.4.1
```



## 程序书写

### 默认值
所有的默认值放在`/config.py`中

### session调用
- 任何文件不允许`import session`
- 所有的session函数统一放在`/Page/Script_UserSession.py`中


---
## 页面规则

1. 在项目目录下有code/Pages 和 code/templates文件夹。 这两个文件夹里面必须包含相同数量的文件。并且所有的文件名需要一一对应，区别只能是后缀名的不同。
2. 在文件夹code/Pages中，每个py文件里面的函数的函数民必须跟改py文件名相同。
