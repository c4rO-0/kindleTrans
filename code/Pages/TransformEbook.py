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
from wtforms import SubmitField, FieldList, IntegerField, StringField, BooleanField
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

import subprocess

#=================================


class UploadForm(FlaskForm):
    file = FileField(validators=[FileRequired(message=gettext("请选择文件"))])
    cover = FileField()
    author = StringField('作者')
    upload = SubmitField('upload')
    # share = BooleanField('agreed to share',default="checked")


    def validate_file(self, field):
        print("|-file check", file=sys.stderr)
        str_filename = field.data.filename
        if not ('.' in str_filename and \
           str_filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS):
           print("|-file wrong extension", file=sys.stderr)
           raise ValidationError(gettext('文件格式不对'))

    def validate_cover(self, field):
        print("|-cover check", file=sys.stderr)
        if field.data :
            str_filename = field.data.filename
            # print(field.data)
            #  check name
            if not ('.' in str_filename and \
                str_filename.rsplit('.', 1)[1].lower() in ALLOWED_COVER_EXTENSIONS) :

                print("|-cover wrong extension",str_filename, ALLOWED_COVER_EXTENSIONS, file=sys.stderr)
                raise ValidationError(gettext('封面格式不对'))


@app.route('/TransformEbook' , methods = ['GET', 'POST']  )
def TransformEbook():
    #....
    error = None

    # -----------------------
    # check disk usage status
    diskAvailInfo = subprocess.check_output("df  / | tail -n1 | awk '{print $4, $5}'", shell=True)
    diskAvailInfo_list = diskAvailInfo.decode("utf-8") .split(" ")
    diskAvail  = int(diskAvailInfo_list[0])
    diskUsage = float((diskAvailInfo_list[1]).strip('\n').strip('%'))/100.
    
    diskTotal = diskAvail/(1.-diskUsage)

    maxHardDisk=20
    toGb=1./1048576.

    if(diskTotal*toGb > maxHardDisk):
        diskTotal = maxHardDisk/toGb
    
    if(diskAvail*toGb > maxHardDisk):
        diskAvail = maxHardDisk/toGb

    diskUsage = 1.- float(diskAvail)/float(diskTotal)

    print(
        '|-disk info | avail:', format(diskAvail*toGb, '.2f'), 
        'Gb total:', format(diskTotal*toGb, '.2f'),
        'Gb usage:', format(diskUsage*100., '.2f') +'%' )

    # -----------------------
    # check visit ip address
    if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
        print("|-visit ip address : ",request.environ['REMOTE_ADDR'], file=sys.stderr)
        visitIP = request.environ['REMOTE_ADDR']
    else:
        print("|-visit ip address : ",request.environ['HTTP_X_FORWARDED_FOR'], file=sys.stderr) # if behind a proxy
        visitIP = request.environ['HTTP_X_FORWARDED_FOR']

    visitIP = ''.join(visitIP.split())


    # -----------------------
    # start to process upload files
    form = UploadForm()
    TOC = None

    if form.validate_on_submit():
        print("-------------------------", file=sys.stderr)
        if(form.upload.data):
            
            filename = ''.join(form.file.data.filename.split()) 
            saveFileName = str(time.time()) + '-' + visitIP +'.txt'
            filePath = os.path.join(app.config['UPLOAD_FOLDER'],saveFileName)

            # 储存
            if (not os.path.exists(filePath) ):
                os.makedirs(filePath) 
            form.file.data.save(os.path.join(filePath , saveFileName))

            # 储存封面
            isCoverUpload = False
            if(form.cover.data):
                isCoverUpload = True
                saveCoverName = 'cover.png'
                form.cover.data.save(os.path.join(filePath , saveCoverName))


            # 保存session
            sessionDelFileUpload()
            print('|-filename ', filename, file=sys.stderr)
            info = sessionSaveFileUpload({'filename':filename, 'saveFileName':saveFileName, 'filePath':filePath, 'isCoverUpload':isCoverUpload} )
            if info != 0:
                print("|-储存文件错误 : ", info, file=sys.stderr)
                return redirect("/TransformEbook")
            else:
                            
                #==================
                #-----------------
                # 统一文件编码
                print("|--------coding---------", file=sys.stderr)
                # info_o = os.system('cd ' + filePath + ';' + 'enca -L chinese -x UTF-8 ' + saveFileName)
                # if(info_o == 512):
                    # print("----自动转码失败, 转用遍历匹配")
                fileCode = get_encoding(os.path.join(filePath , saveFileName))
                print(fileCode)
                if(fileCode == None):
                    # info_o = os.system('cd ' + filePath + ';' 
                    # + os.path.abspath(os.path.join(os.path.dirname(__file__),'..', 'serverside/conver.sh')) + ' ' + saveFileName )
                    return redirect("/404/转码失败,请手动转换为gdb或utf-8. ")
                else:
                    try:
                        with open(os.path.join(filePath , saveFileName+'.code'), 'a') as wf:  
                            with open(os.path.join(filePath , saveFileName), 'rb') as rf:  
                                while True: 
                                    line = rf.readline() 
                                    wf.write(line.decode(fileCode))
                                    if not line: 
                                        break
                        # os.system('cd ' + filePath + ';' + 'enca -L chinese -x UTF-8 ' + saveFileName)
                        shutil.move(os.path.join(filePath , saveFileName+'.code'), os.path.join(filePath , saveFileName))
                    except:
                        error = '转码失败,请手动转换为gdb或utf-8.'
                        # return redirect("/404/转码失败,请手动转换为gdb或utf-8.")
                        # return redirect("/TransformEbook")
                #-----------------              
                if(not error):
                    # ********************
                    # --------------------
                    # 初始化图书
                    init_project(filePath, filename, form.author.data, isCoverUpload)


                    # --------------------
                    # 添加其他配置信息
                    with open(os.path.abspath(os.path.join(filePath, '.project.ini')), 'a+', encoding='UTF-8') as f:

                        f.write("\nshare="+str(False)+"\n")
                        if(form.cover.data):
                            f.write("\nisCoverUpload="+str(True)+"\n")
                        else:
                            f.write("\nisCoverUpload="+str(False)+"\n")
                        f.close()
                
                
                
        else:
            print("|-unknown submit", file=sys.stderr)
            error = "unknown submit"

        if(not error):
            return redirect("/ConfirmTransformEbook")


    return render_template('TransformEbook.html.j2', app = app, form=form, jsV=jsV, error=error, diskAvail=diskAvail, diskUsage=diskUsage)
