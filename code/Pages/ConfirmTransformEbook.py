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
from wtforms import SubmitField, FieldList, IntegerField
from werkzeug.utils import secure_filename

from wtforms.validators import ValidationError

import time;  # 引入time模块

from utilities import init_project 
from scaffold import   genTOC, gen_project
from txt2html import Book, Chapter

#--------------------------------
# 引入session
from Script_UserSession import sessionQueryFileUpload, sessionSaveFileUpload, sessionDelFileUpload, sessionSaveTOC
#--------------------------------
# 运行shell
# import commands
#--------------------------------
from flask_socketio import SocketIO, emit
from Script_socketio import *

import time
#=================================

class TransformForm(FlaskForm):

    TOClistindex = FieldList( IntegerField())
    confirmTOC = SubmitField('确认目录')


    def validate_confirmTOC(self, field):
        if(sessionQueryFileUpload() == None):
            raise ValidationError(gettext('错误 : 没有检测到上传文件'))


@app.route('/ConfirmTransformEbook' , methods = ['GET', 'POST']  )
def ConfirmTransformEbook():
    #....

    if (sessionQueryFileUpload() == None):
        return redirect("/TransformEbook")


    # 确认转换
    formTran = TransformForm()

    print("----formTran----")
    if formTran.validate_on_submit():
        print("----submit----")
        # print(formTran.confirmTOC.data)
        # if(formTran.confirmTOC.data):
        print("确认目录")
        fileDict = sessionQueryFileUpload()
        print('---------index----------')
        print(formTran.TOClistindex.data)
        book , TOC = genTOC(None, fileDict['filePath'], fileDict['saveFileName'])
        if(book == None):
            print("没有检测到上传的书")
            sessionDelFileUpload()
            return redirect("/TransformEbook")
            
        #-----------------
        # 删除目录
        if(len(formTran.TOClistindex.data) >0 ):
            book.combineChapter(formTran.TOClistindex.data)
        #-----------------
        # 生成项目文件        
        gen_project(book, None, fileDict['filePath'], fileDict['saveFileName'])

        # 用bookCount代表已经转化完book
        fileDict['bookCount'] = book.book_count()
        sessionDelFileUpload()
        info = sessionSaveFileUpload(fileDict)
        if info != 0:
            print("储存文件错误 : ", info)
            return redirect("/404")
        
        return redirect("/ConfirmTransformEbook")

    return render_template('ConfirmTransformEbook.html.j2', app = app, formTran=formTran)


@app.route('/TransformDownloads/<filename>')
def downloads(filename):
    fileDict = sessionQueryFileUpload()
    if(fileDict == None):
        return redirect('/404')
    elif(not ('bookCount' in fileDict.keys())):
        return redirect('/TransformEbook')

    return send_from_directory(fileDict['filePath'],
                               filename)
