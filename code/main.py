#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from config import *
import os
import sys
#----------------------------------------------------
#    声明python查找路径
Project_path = os.path.dirname(__file__)
PagesPath = os.path.join(Project_path, "Pages")
ServerPath = os.path.join(Project_path, "serverside")
Txt2mobiPath = os.path.abspath(os.path.join(Project_path,os.path.pardir, "txt2mobi"))
#---------------------------------------
sys.path.insert(0, PagesPath)
sys.path.insert(0, ServerPath)
sys.path.insert(0, Txt2mobiPath)

# from flask import Flask , request
import flask



#----------------------------------------------------
#     setting app
app = flask.Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
#----------------------------------------------------
#  设置上传文件根目录
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#----------------------------------------------------
#     set language
from flask.ext.babel import Babel
babel = Babel(app)

#----------------------------------------------------
#  append all the components
from Pages import *

#-----------------------------------------------------
#    Run
if __name__ == '__main__':
    # app.run(host='127.0.0.1', port=8081   , debug=True)
    app.run(host='0.0.0.0', port=8081, debug=True)


