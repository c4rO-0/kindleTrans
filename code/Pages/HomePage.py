#!/usr/bin/env python3

#---------------------------------
from main  import *
from flask import render_template, request
from flask.ext.babel import gettext
#=================================

@app.route('/' , methods = ['GET', 'POST']  )
def HomePage():
    #....

    # 检查用户是否已登录
    # if sessionQueryStatusLogged():
        # 无动于衷

    return render_template('HomePage.html.j2', app = app)
