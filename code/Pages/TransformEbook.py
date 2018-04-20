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
from wtforms import SubmitField
from werkzeug.utils import secure_filename

from wtforms.validators import ValidationError

import time;  # 引入time模块

from utilities import init_project 

#--------------------------------
# 引入session
from Script_UserSession import sessionQueryFileUpload, sessionSaveFileUpload, sessionDelFileUpload
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

class TransformForm(FlaskForm):

    createTOC = SubmitField('确认目录')
    transform = SubmitField('转化')



    def validate_createTOC(self, field):
        if(sessionQueryFileUpload() == None):
            raise ValidationError(gettext('错误 : 没有检测到上传文件'))

@app.route('/TransformEbook' , methods = ['GET', 'POST']  )
def TransformEbook():
    #....

    form = UploadForm()

    formTran = TransformForm()
 

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
            info = sessionSaveFileUpload({'filename':filename, 'saveFileName':saveFileName, 'filePath':filePath} )
            if info != 0:
                print("储存文件错误 : ", info)
                return redirect("/TransformEbook")
            else:
                #==================
                # 初始化图书
                init_project(filePath, filename)
        else:
            print("unknown submit")
        return redirect("/TransformEbook")
    
    if formTran.validate_on_submit():
        if(formTran.createTOC.data):
            print("确认目录")
            fileDict = sessionQueryFileUpload()

            print(fileDict['filename'])


            # init_project(formTran.filePath, formTran.filename)
        return redirect("/TransformEbook")

    return render_template('TransformEbook.html.j2', app = app, form=form, formTran=formTran)

