#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#---------------------------------
from config import *
from main  import *
from flask import Flask, render_template, request, redirect,  url_for, g, send_from_directory
from flask.ext.babel import gettext
#---------------------------------
# 上传文件
import os
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired
from wtforms import SubmitField, FieldList, IntegerField, StringField
from werkzeug.utils import secure_filename

from wtforms.validators import ValidationError

import time;  # 引入time模块

from utilities import init_project 
from scaffold import   genTOC, gen_project
from txt2html import Book, Chapter, get_encoding

#--------------------------------
# 引入session
from Script_UserSession import sessionQueryFileUpload, sessionSaveFileUpload, sessionDelFileUpload, sessionSaveTOC, sessionSaveTitleFilter
#--------------------------------
# 运行shell
# import commands
#--------------------------------
from flask_socketio import SocketIO, emit
from Script_socketio import *

import time

from config import DEFAULT_TITLE_FILTER

import shutil

from flask import jsonify

import re

#=================================

@app.route('/ListBook/' , methods = ['GET', 'POST']  )
def ListBook():

    listBookName  = {}
    listBookIndex = {}
    with open(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','archive','toc.dat')),'r') as f:
        for line in f.readlines():
            
            tarName, booName = (line.strip('\n')).split('\t',1)

            listBookName[len(listBookName)] = booName
            listBookIndex[len(listBookIndex)] = tarName
            
    f.close()

    return render_template('ListBookPage.html.j2', app = app, listBookName = listBookName)

@app.route('/ListBook/<Downloadindex>/<DownloadBookName>')
def downloadsOthersBook(Downloadindex,DownloadBookName):
    index = int(Downloadindex)
    listBookName  = {}
    listBookIndex = {}
    with open(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','archive','toc.dat')),'r') as f:
        for line in f.readlines():
            
            tarName, booName = (line.strip('\n')).split('\t',1)

            listBookName[len(listBookName)] = booName
            listBookIndex[len(listBookIndex)] = tarName
            
    f.close()

    if(index <len(listBookName) and listBookName[index] == DownloadBookName):
        bookPath = os.path.abspath(os.path.join(os.path.dirname(__file__),'..','archive'))

        print(bookPath)
        return send_from_directory(bookPath, listBookIndex[index]+".tar.gz")
    else:
        return redirect('/404/没有找到文件')