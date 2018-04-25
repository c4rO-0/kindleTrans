#---------------------------------
from config import *
from main  import *
from flask import Flask, render_template, request, redirect,  url_for, g, send_from_directory
from flask.ext.babel import gettext
from config import DEFAULT_TITLE_FILTER
#---------------------------------
# 上传文件
import os
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired
from wtforms import SubmitField, FieldList, IntegerField, StringField , validators
from werkzeug.utils import secure_filename

from wtforms.validators import ValidationError 

import time;  # 引入time模块

from utilities import init_project 
from scaffold import   genTOC, gen_project
from txt2html import Book, Chapter

#--------------------------------
# 引入session
from Script_UserSession import sessionQueryFileUpload, sessionSaveFileUpload, sessionDelFileUpload, sessionSaveTOC, sessionQueryTitleFilter, sessionSaveTitleFilter
#--------------------------------
# 运行shell
# import commands
#--------------------------------
from flask_socketio import SocketIO, emit
from Script_socketio import *

import shutil
#=================================

class TransformForm(FlaskForm):

    TOClistindex = FieldList( IntegerField())
    confirmTOC = SubmitField('确认目录')

    titleFilter = StringField('过滤规则')
    ChapterMaxLength = IntegerField()
    confirmtitleFilter = SubmitField('重新生成目录')


    def validate_confirmTOC(self, field):
        if(sessionQueryFileUpload() == None):
            raise ValidationError(gettext('错误 : 没有检测到上传文件'))

    def validate_titleFilter(self, field):
        if(self.confirmtitleFilter.data):
            if(field.data == None or len(field.data) == 0):
                raise ValidationError(gettext('需要目录过滤规则'))


@app.route('/ConfirmTransformEbook' , methods = ['GET', 'POST']  )
def ConfirmTransformEbook():
    #....

    fileDict = sessionQueryFileUpload()

    if (fileDict == None):
        return redirect("/TransformEbook")


    # 确认转换
    formTran = TransformForm()


    book , TOC = genTOC(sessionQueryTitleFilter(), fileDict['filePath'], fileDict['saveFileName'], fileDict['ChapterMaxLength'])
    if(book is None):
        return redirect("/TransformEbook")


    print("----formTran----")
    if formTran.validate_on_submit():

        if(formTran.confirmtitleFilter.data):

            titleFilter = formTran.titleFilter.data
            ChapterMaxLength = formTran.ChapterMaxLength.data
            if(ChapterMaxLength == None or ChapterMaxLength <0):
                ChapterMaxLength = 25

            # book , TOC = genTOC(titleFilter, fileDict['filePath'], fileDict['saveFileName'])
            sessionSaveTitleFilter(titleFilter)

            # book , TOC = genTOC(None, filePath, saveFileName)
            
            if(book is None):
                return redirect("/TransformEbook")
            # 链接目录
            # 创建目录
            # if (not os.path.exists(os.path.join(app.config['UPLOAD_FOLDERTOC'],fileDict['saveFileName']) )):
            #     os.makedirs(os.path.join(app.config['UPLOAD_FOLDERTOC'],fileDict['saveFileName'])) 
            # 连接
            # 删除之前的链接
            # os.remove(os.path.join(os.path.join(app.config['UPLOAD_FOLDERTOC'],fileDict['saveFileName']),'project-TOC.html'))
            # # os.link(os.path.join(fileDict['filePath'],'project-TOC.html'), \
            # # os.path.join(os.path.join(app.config['UPLOAD_FOLDERTOC'],fileDict['saveFileName']),'project-TOC.html'))
            # shutil.copy2(os.path.join(fileDict['filePath'],'project-TOC.html'), \
            # os.path.join(os.path.join(app.config['UPLOAD_FOLDERTOC'],fileDict['saveFileName']),'project-TOC.html'))

            return redirect("/ConfirmTransformEbook")

        else:

            print("----submit----")
            # print(formTran.confirmTOC.data)
            # if(formTran.confirmTOC.data):
            print("确认目录")
            fileDict = sessionQueryFileUpload()
            print('---------index----------')
            print(formTran.TOClistindex.data)

            titleFilter = sessionQueryTitleFilter()
            if(titleFilter == None):
                titleFilter = DEFAULT_TITLE_FILTER

            book , TOC = genTOC(titleFilter, fileDict['filePath'], fileDict['saveFileName'], fileDict['ChapterMaxLength'])

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
            gen_project(book, titleFilter, fileDict['filePath'], fileDict['saveFileName'])

            # 用bookCount代表已经转化完book
            fileDict['bookCount'] = book.book_count()
            sessionDelFileUpload()
            info = sessionSaveFileUpload(fileDict)
            if info != 0:
                print("储存文件错误 : ", info)
                return redirect("/404")
            
            return redirect("/ConfirmTransformEbook")


    return render_template('ConfirmTransformEbook.html.j2', app = app, formTran=formTran, os=os, TOC=TOC)


@app.route('/TransformDownloads/<saveFileName>/<filename>')
def downloads(saveFileName,filename):
    fileDict = sessionQueryFileUpload()
    if(fileDict == None):
        return redirect('/404')
    elif(not ('bookCount' in fileDict.keys())):
        return redirect('/TransformEbook')
    elif(saveFileName !=  fileDict['saveFileName']):
        return redirect('/404/没有找到文件')

    print("download page : " + fileDict['filePath'])

    return send_from_directory(fileDict['filePath'],
                               filename)
