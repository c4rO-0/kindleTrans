#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
#----------------------------------------------------
#    声明python查找路径
Project_path = os.path.dirname(__file__)
PagesPath = os.path.join(Project_path, "Pages")
ServerPath = os.path.join(Project_path, "serverside")
#---------------------------------------
sys.path.insert(0, PagesPath)
sys.path.insert(0, ServerPath)

# from flask import Flask , request
import flask



#----------------------------------------------------
#     setting app
app = flask.Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)

#----------------------------------------------------
#     set language
from flask.ext.babel import Babel
babel = Babel(app)


#----------------------------------------------------
#     render Bootstrap

# from flask.ext.bootstrap import Bootstrap
from flask_bootstrap import Bootstrap
Bootstrap(app)
# yhh:这里可能不需要了，我直接用的bootstrap的文件，没有通过flask




#----------------------------------------------------
#  append all the components
from Pages import *

#-----------------------------------------------------
#    Run
if __name__ == '__main__':
    # app.run(host='127.0.0.1', port=8081   , debug=True)
    app.run(host='0.0.0.0', port=8081, debug=True)


