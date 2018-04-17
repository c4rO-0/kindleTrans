# -*- coding: utf-8 -*-
# ...


#---------------------------------
# 支持的语言列表
LANGUAGES = {
    'en': 'English',
    'zh': '中文'
}

#---------------------------------
# 默认语言
default_lang = 'zh'


#---------------------------------
# 上传设置
# 上传根目录
import os
dbpath = os.path.dirname(__file__) + os.sep + 'db/Userinfo.db'
UPLOAD_FOLDER = os.path.dirname(__file__) + os.sep + 'uploads'
# 允许上传的文件类型
ALLOWED_EXTENSIONS = set(['txt'])
