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
from wtforms import SubmitField, FieldList, IntegerField, StringField, BooleanField , SelectField
from wtforms.widgets import TextArea
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
# sql
#--------------------------------
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from datetime import datetime

from Script_dbModel import manageMoney

#=================================

class MoneyRecordForm(FlaskForm):

    opName = SelectField(
        '操作人姓名',
        choices=[('lsq', '刘士琦'), ('bs', '毕升') ]
    )
 
    recordTime = StringField()
    recordZone = SelectField(
        '时区',
        choices=[('+0800', '北京时间'), ('+0200', '柏林时间')]
    )
    opMode  = SelectField(
        '要干啥',
        choices=[('deposit', '存钱'), ('withdraw', '取钱')]
    )
    opMount  = IntegerField()
    currency = SelectField(
        '货币',
        choices=[('RMB', '人民币'), ('EU', '欧元')]
    )
    opLog = StringField('操作原因', widget=TextArea())
    comfirm = SubmitField('comfirm')



    # def validate_file(self, field):
    #     print("file check", file=sys.stderr)
    #     str_filename = field.data.filename
    #     if not ('.' in str_filename and \
    #        str_filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS):
    #        print("格式不对", file=sys.stderr)
    #        raise ValidationError(gettext('文件格式不对'))


@app.route('/ManageMoney' , methods = ['GET', 'POST']  )
def ManageMoney():

    form = MoneyRecordForm()

    # 获取ip
    if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
        # print("访问ip : ",request.environ['REMOTE_ADDR'], file=sys.stderr)
        visitIP = request.environ['REMOTE_ADDR']
    else:
        # print("访问ip : ",request.environ['HTTP_X_FORWARDED_FOR'], file=sys.stderr) # if behind a proxy
        visitIP = request.environ['HTTP_X_FORWARDED_FOR'] 
    

    if form.validate_on_submit():
        print("-------------------------", file=sys.stderr)
        if(form.comfirm.data): 
            # 获取当前时间 
            opTime = int((datetime.now().timestamp())*1000)

            recordTime = int((datetime.strptime( 
                form.recordTime.data+" "+form.recordZone.data,
                '%Y-%m-%d %z')).timestamp()*1000)
            if(form.opMode.data == "withdraw"):
                opMode = 1
            else:
                opMode = 0
            
            
            # 生成记录
            slidRecord = manageMoney(
                form.opName.data,
                visitIP, 
                opTime,
                recordTime, 
                opMode,
                form.opMount.data,
                form.currency.data,
                form.opLog.data)
            # 储存记录 
            if(not os.path.exists(os.path.join(Project_path, "db", 'app.db') )):
                db.create_all()

            db.session.add(slidRecord)
            db.session.commit()

            return redirect("/ManageMoney")




    return render_template('ManageMoney.html.j2', app = app, form=form)



