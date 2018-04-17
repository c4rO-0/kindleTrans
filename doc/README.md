# 须知

该文件用来记录运行程序, 和开发程序的注意事项
开发日志请转移到[DevLog.md](./DevLog.md)

---

[TOC]

---



## 程序运行

###安装python依赖

``` bash
$ pip install -r requirements.txt
```

**注意 :**

Ubuntu/Debain存在bug导致requirements.txt文件里可能存在`pkg-resources==0.0.0`. 导致在其他平台运行无法安装依赖包. 遇到这种情况可以手动删除该句.



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
