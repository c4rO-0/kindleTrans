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

DEFAULT_TITLE_FILTER=".*[第]{1,2}[0-9零○一二两三四五六七八九十百千廿卅卌壹贰叁肆伍陆柒捌玖拾佰仟万１２３４５６７８９０]{1,5}[章节節堂讲回集部分品]{1,2}.*"

SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
    'sqlite:///' + os.path.join(os.path.dirname(__file__), "db", 'app.db')

SQLALCHEMY_TRACK_MODIFICATIONS = False