#!/usr/bin/env python3
# -*- coding: utf-8 -*-
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
from Script_UserSession import sessionQueryFileUpload, sessionSaveFileUpload, sessionDelFileUpload, sessionSaveTOC, sessionQueryTitleFilter, sessionSaveTitleFilter, sessionSaveChapterMaxLength, sessionQueryChapterMaxLength
#--------------------------------
# 运行shell
# import commands
#--------------------------------
from flask_socketio import SocketIO, emit
from Script_socketio import *

import shutil

import re

import random

import subprocess
#=================================

def readSlogan():
    
    if(not os.path.exists(os.path.join(Txt2mobiPath,'resources','slogan.dat'))):
        return ''

    lines = []
    with open(os.path.join(Txt2mobiPath,'resources','slogan.dat')) as f:
        for line in f:
            li=line.strip()
            if (not li.startswith("#")) and len(li) > 0:
                lines.append(li)
    
    if(len(lines) == 0):
        return ''
    else:
        r_l = random.randint(0,len(lines)-1)
        # print('debug : rand ', r_l,len(lines), file=sys.stderr)
        return lines[r_l]


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
            
            titleFilter = field.data 
        else:
            titleFilter = sessionQueryTitleFilter()

        try:
            re.compile(titleFilter)
        except:
            # sessionSaveTitleFilter(titleFilter)
            raise ValidationError(gettext('目录过滤规则有误.'))




@app.route('/ConfirmTransformEbook' , methods = ['GET', 'POST']  )
def ConfirmTransformEbook():
    #....

    fileDict = sessionQueryFileUpload()

    if (fileDict == None):
        return redirect("/TransformEbook")


    # 确认转换
    formTran = TransformForm()

    try:
        book , TOC = genTOC(sessionQueryTitleFilter(), fileDict['filePath'], fileDict['saveFileName'], sessionQueryChapterMaxLength())
    except:
        return redirect("/404/转换失败,请联系网站管理员.")
    if(book is None):
        return redirect("/404/没有检测到上传的书.")


    print("----formTran----", file=sys.stderr)
    if formTran.validate_on_submit():

        if(formTran.confirmtitleFilter.data):

            titleFilter = formTran.titleFilter.data
            ChapterMaxLength = formTran.ChapterMaxLength.data
            if(ChapterMaxLength == None or ChapterMaxLength <0):
                ChapterMaxLength = 25

            # book , TOC = genTOC(titleFilter, fileDict['filePath'], fileDict['saveFileName'])
            sessionSaveTitleFilter(titleFilter)
            sessionSaveChapterMaxLength(ChapterMaxLength)

            # book , TOC = genTOC(None, filePath, saveFileName)
            
            if(book is None):
                return redirect("/404/没有检测到上传的书.")
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

            print("----submit----", file=sys.stderr)
            # print(formTran.confirmTOC.data)
            # if(formTran.confirmTOC.data):
            print("确认目录", file=sys.stderr)
            fileDict = sessionQueryFileUpload()
            print('---------index----------', file=sys.stderr)
            print(formTran.TOClistindex.data, file=sys.stderr)

            titleFilter = sessionQueryTitleFilter()
            if(titleFilter == None):
                titleFilter = DEFAULT_TITLE_FILTER

            try:
                book , TOC = genTOC(titleFilter, fileDict['filePath'], fileDict['saveFileName'], sessionQueryChapterMaxLength())
            except:
                return redirect("/404/转换失败,请联系网站管理员.")
            if(book == None):
                print("没有检测到上传的书", file=sys.stderr)
                sessionDelFileUpload()
                return redirect("/404/没有检测到上传的书.")
                
            #-----------------
            # 删除目录
            if(len(formTran.TOClistindex.data) >0 ):
                book.combineChapter(formTran.TOClistindex.data)
            #-----------------

            # 用bookCount代表已经转化完book
            fileDict['bookCount'] = book.book_count()

            # 转化封面
            coverFontFlag = ' -font \'' + os.path.join(Txt2mobiPath,'resources','STHeiti.ttf') + '\''
            # 添加乞讨语
            coverFlag = coverFontFlag + ' -gravity South -pointsize 30 -annotate +0+100 '
            coverName = readSlogan()
            info_o = os.system("convert " + os.path.join(fileDict['filePath'] , "cover.png") + coverFlag + '\''  + coverName + '\' ' +os.path.join(fileDict['filePath'] , "cover.png"))
            # 书名
            coverFlag = coverFontFlag + ' -gravity North -pointsize 50 -annotate +0+100 '
            coverName = (fileDict['filename'].rsplit('.',1)[0]).replace('\'','').replace('\\','').replace('\"','')
            
            if(fileDict['bookCount'] == 1):
                info_o = os.system("convert " + os.path.join(fileDict['filePath'] , "cover.png") + coverFlag + '\''  + coverName + '\' ' +os.path.join(fileDict['filePath'] , "cover-1.png"))
                # print("convert " + os.path.join(filePath , "cover.png") + coverFlag + '\'' + coverName + '\' ' +os.path.join(filePath , "cover.png"))
                print("转化 : ", info_o, file=sys.stderr) 
            else:
                for idx in range(1, fileDict['bookCount']+1):
                    info_o = os.system("convert " + os.path.join(fileDict['filePath'] , "cover.png") + coverFlag + '\''  + coverName + '\n P-%s\' ' % idx +os.path.join(fileDict['filePath'] , "cover-%s.png" % idx))
                    print("转化 : ", info_o, file=sys.stderr) 
                    


            # 生成项目文件        
            try:
                gen_project(book, titleFilter, fileDict['filePath'], fileDict['saveFileName'])
            except subprocess.TimeoutExpired:
                return redirect("/404/转化超时,请减小电子书大小")
            

            sessionDelFileUpload()
            info = sessionSaveFileUpload(fileDict)
            if info != 0:
                print("储存文件错误 : ", info, file=sys.stderr)
                return redirect("/404/转存错误")
            
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
    elif(not re.match('project-[0-9]{1,2}\.mobi', filename)):
        return redirect('/404/没有找到文件')

    print("download page : " + fileDict['filePath'], file=sys.stderr)

    return send_from_directory(fileDict['filePath'],
                               filename)
