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
Txt2mobiPythonPath = os.path.abspath(os.path.join(Project_path,os.path.pardir, "txt2mobi", "txt2mobi"))
#---------------------------------------
sys.path.insert(0, PagesPath)
sys.path.insert(0, ServerPath)
sys.path.insert(0, Txt2mobiPath)
sys.path.insert(0, Txt2mobiPythonPath)

# from flask import Flask , request
import flask

from flask_socketio import SocketIO, emit


#----------------------------------------------------
#     setting app

app = flask.Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
socketio = SocketIO(app)

#----------------------------------------------------
#  设置上传文件根目录
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['UPLOAD_FOLDERTOC'] = UPLOAD_FOLDERTOC

#----------------------------------------------------
#     set language
from flask.ext.babel import Babel
babel = Babel(app)

#----------------------------------------------------
#  append all the components
from Pages import *
#----------------------------------------------------
#  import socket.io
from Script_socketio import *
#-----------------------------------------------------
#    Run
if __name__ == '__main__':
    # app.run(host='127.0.0.1', port=8081   , debug=True)
    # socketio.run(app, host='0.0.0.0', port=8081, debug=True)
    socketio.run(app, host='0.0.0.0', debug=True)


