## 2018Jun6-BS
* 把书名P到cover存在隐患. 
* 详情如下:
    把文字P到图片用命令行
    大概格式是convert  a.png "test" b.png
    就会把test放到a图上, 最后生成b
    但是如果一个人把test换成"; ls -al ;"
    直接就可以执行命令了
* 解决方案 :
目前是发现特殊字符直接去掉
coverName = (filename.rsplit('.',1)[0]).replace('\'','').replace('\\','').replace('\"','')


## 2018Jun10-BS

* **子模块里需要返回主页的链接**
* 了联系方式暂定为在知乎给我们留言
* 

## 2018Jun02-BS

* **我觉得需要在网站上留联系方式**

* 检测没问题
  - [x] 多本书
  - [ ] 章节名很长 : 没找到足够长的章节名
  - [x] 触发error : 
    - [x] 转码失败
    - [x] 上传格式不符的文件
    - [x] 通配符错误输出
    - [x] 其他 :目前没发现

* 添加重置通配符按钮

## 2018jun02-L

* 粗略改完，需要测试
    * 比如章节名超级长的情况
    * 多个文件的情况
    * 触发error的情况
* 我本地只有一个可供测试的文件所以不太方便
* 吐个槽，页面上的字都是谁写的？
    * 再随后》在随后
    * 分号用得有点奇怪

## 2018may19-L
* 从master合并的最新版本不能在本地直接跑起来，需要
    * 手动添加/archive/toc.dat文件
    * 清空toc.dat中的内容
* 修改了TransformEbook页面
    * 删掉了navbar
* 目前所有文字都是直接写的中文，没有用gettext
    * 且有几个字是在写在TransformEbook.css里的，不知道怎么用gettext

## 2018-May02-BS
flask设置端口为80
利用apache2进行转接
[官方教程](http://flask.pocoo.org/docs/1.0/deploying/mod_wsgi/#configuring-apache)

[其他教程](https://blog.zhengzi.me/292.html)






## 2018-April25-BS

- 更新服务器开发说明, 具体见README.md

## 2018April21-BS

- 在example里添加测试用书
- 针对更复杂的目录还需要进一步调式

[官方文档](http://flask.pocoo.org/docs/0.12/patterns/fileuploads/)在最后提到如何做progress bar, 但是比较含混. 需要再详细调查.

下载修改文件名https://stackoverflow.com/questions/24504828/downloading-file-custom-name-with-jquery


## 2018April21-BS

### 完成

- 实现转化目录
- 删除目录
- 生成电子书

### 未完成

- 出版商需要修改

- 前言需要修改

- 打包提供下载

  ​

## 2018April20-BS

文件编码, 虽然用

``` python
# 获取文件编码类型  
def get_encoding(file):  
    # 二进制方式读取，获取字节数据，检测类型  
    
    with open(file, 'rb') as f:  
        for line in f:
            if(len(line) > 10 ):
                print(chardet.detect(line))
                return chardet.detect(line)['encoding']  
```

可以获得正确的文件编码, 但是在一些特殊字的情况下会识别失败.

linux自带转化`iconv`需要知道原编码, 而且对于一些特殊字也会报错.

现打算使用`enca`, 不需要知道编码, 而且也不报错

``` shell
$ enca -L zh_CN file 检查文件的编码
$ enca -L zh_CN -x UTF-8 file 将文件编码转换为"UTF-8"编码
$ enca -L zh_CN -x UTF-8 file1 file2 如果不想覆盖原文件可以这样
```

可以不指定语言

[来源](https://blog.csdn.net/a280606790/article/details/8504133)



---

目录文件 http://blog.sina.com.cn/s/blog_5c0175790100bdg5.html



---

flask 给前台发消息

https://stackoverflow.com/questions/42988907/how-do-you-send-messages-from-flask-server-python-to-html-client

(中文文档)[http://www.hi-roy.com/2015/12/29/flask-socketio%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3/]
