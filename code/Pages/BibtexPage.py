#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#---------------------------------
from config import *
from main  import *
from flask import Flask, render_template, request, redirect,  url_for, g
from flask.ext.babel import gettext
#---------------------------------
# 上传文件
import os

#=================================

@app.route('/BibtexPage' , methods = ['GET', 'POST']  )
def BibtexPage():


    return render_template('BibtexPage.html.j2', app = app, jsV=jsV)