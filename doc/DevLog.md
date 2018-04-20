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

[中文文档](http://www.hi-roy.com/2015/12/29/flask-socketio%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3/)