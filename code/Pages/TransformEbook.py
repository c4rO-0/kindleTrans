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


    if form.validate_on_submit():
        print("-------------------------")
        if(form.upload.data):
            

            filename = form.file.data.filename
            # secureFilename = secure_filename(filename)
            saveFileName = str(time.time()) + '-' + request.environ['REMOTE_ADDR']+'.txt'
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
            info = sessionSaveFileUpload({'filename':filename, 'saveFileName':saveFileName, 'filePath':filePath} )
            if info != 0:
                print("储存文件错误 : ", info)
                return redirect("/TransformEbook")
            else:
                            
                #==================
                #-----------------
                # 统一文件编码
                info_o = os.system('cd ' + filePath + ';' + 'enca -x UTF-8 ' + saveFileName)
                if(info_o !=0):
                    #转换失败
                    return redirect("/404")
                #-----------------              
                # 初始化图书
                init_project(filePath, filename)
                #-----------------              
                # 生成目录
                book , TOC = genTOC(".*[第]?[0-9零○一二两三四五六七八九十百千廿卅卌壹贰叁肆伍陆柒捌玖拾佰仟万１２３４５６７８９０]{1,5}[章节節堂讲回集部分品]?.*", filePath, saveFileName)
                if(book is not None):
                    sessionSaveTOC(TOC)
                    # sessionSaveBook(book)

        else:
            print("unknown submit")
        return redirect("/ConfirmTransformEbook")


    return render_template('TransformEbook.html.j2', app = app, form=form)
