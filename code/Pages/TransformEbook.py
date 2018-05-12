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
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired
from wtforms import SubmitField, FieldList, IntegerField
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
#=================================

class UploadForm(FlaskForm):
    file = FileField(validators=[FileRequired(message=gettext("请选择文件"))])
    upload = SubmitField('upload')


    def validate_file(self, field):
        print("file check")
        str_filename = field.data.filename
        if not ('.' in str_filename and \
           str_filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS):
           print("格式不对")
           raise ValidationError(gettext('文件格式不对'))


@app.route('/TransformEbook' , methods = ['GET', 'POST']  )
def TransformEbook():
    #....

    #上传文件
    form = UploadForm()
    TOC = None

    if form.validate_on_submit():
        print("-------------------------")
        if(form.upload.data):
            

            filename = form.file.data.filename
            # secureFilename = secure_filename(filename)
            saveFileName = str(time.time()) + '-' + request.remote_addr +'.txt'
            filePath = os.path.join(app.config['UPLOAD_FOLDER'],saveFileName)
            # print("-------------------------------")
            # print("file name : " + filename)

            # 储存
            if (not os.path.exists(filePath) ):
                os.makedirs(filePath) 
            form.file.data.save(os.path.join(filePath , saveFileName))
            # 保存session
            sessionDelFileUpload()
            print(filename)
            info = sessionSaveFileUpload({'filename':filename, 'saveFileName':saveFileName, 'filePath':filePath, 'ChapterMaxLength':25} )
            if info != 0:
                print("储存文件错误 : ", info)
                return redirect("/TransformEbook")
            else:
                            
                #==================
                #-----------------
                # 统一文件编码
                print("--------coding---------")
                info_o = os.system('cd ' + filePath + ';' + 'enca -L chinese -x UTF-8 ' + saveFileName)
                if(info_o == 512):
                    # print("----自动转码失败, 转用遍历匹配")
                    # fileCode = get_encoding(os.path.join(filePath , saveFileName))
                    # if(fileCode == None):
                    #     info_o = os.system('cd ' + filePath + ';' 
                    #     + os.path.abspath(os.path.join(os.path.dirname(__file__),'..', 'serverside/conver.sh')) + ' ' + saveFileName )
                    # else:
                    #     info_o = os.system('cd ' + filePath + ';' 
                    #     + os.path.abspath(os.path.join(os.path.dirname(__file__),'..', 'serverside/conver.sh')) + ' ' + saveFileName + ' ' + fileCode )                        
                    # if(info_o != 0):
                    #     #转换失败
                    #     print("转换失败. 失败码 : ", info_o)
                    return redirect("/404/转码失败,请手动转换为gdb或utf-8")
                #-----------------              
                # 初始化图书
                init_project(filePath, filename)
                #-----------------              
                # 生成目录
                # book , TOC = genTOC(DEFAULT_TITLE_FILTER, filePath, saveFileName)
                # sessionSaveTitleFilter(DEFAULT_TITLE_FILTER)

                # book , TOC = genTOC(None, filePath, saveFileName)
              
                # if(book is None):
                #     return redirect("/TransformEbook")
                # # 链接目录
                # # 创建目录
                # if (not os.path.exists(os.path.join(app.config['UPLOAD_FOLDERTOC'],saveFileName) )):
                #     os.makedirs(os.path.join(app.config['UPLOAD_FOLDERTOC'],saveFileName)) 
                # # 连接
                # # os.link(os.path.join(filePath,'project-TOC.html'), \
                # # os.path.join(os.path.join(app.config['UPLOAD_FOLDERTOC'],saveFileName),'project-TOC.html'))
                # shutil.copy2(os.path.join(filePath,'project-TOC.html'), \
                # os.path.join(os.path.join(app.config['UPLOAD_FOLDERTOC'],saveFileName),'project-TOC.html'))    
                    # sessionSaveTOC(TOC)
                    # sessionSaveBook(book)
        else:
            print("unknown submit")
        return redirect("/ConfirmTransformEbook")


    return render_template('TransformEbook.html.j2', app = app, form=form)
