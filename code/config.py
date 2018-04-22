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
UPLOAD_FOLDER = os.path.dirname(__file__) + os.sep + 'uploads'
UPLOAD_FOLDERTOC = os.path.dirname(__file__) + os.sep + 'templates' + os.sep + 'uploads'
# 允许上传的文件类型
ALLOWED_EXTENSIONS = set(['txt'])
