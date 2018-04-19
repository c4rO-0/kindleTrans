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
    filename = ""
    saveFileName = ""
    filePath = ""

    transform = SubmitField('transform')

    # def validate_transform(self, field):
    #     if(self.filename =="" or self.saveFileName =="" or self.filePath == ""):
    #         raise ValidationError(gettext('请先上传文件'))

@app.route('/TransformEbook' , methods = ['GET', 'POST']  )
def TransformEbook():
    #....

    
    form = UploadForm()



    formTran = TransformForm()
 
        

    if form.validate_on_submit():
        print("-------------------------")
        if(form.upload.data):
            print("-------------------------")

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
            # 准备转化
            formTran.filename = filename
            formTran.saveFileName = saveFileName
            formTran.filePath = filePath
        else:
            print("unknown submit")
        
    
    if formTran.validate_on_submit():
        if(formTran.transform.data):
            print("转化")
            print(formTran.filePath)
            init_project(formTran.filePath, formTran.filename)
        # return redirect(url_for('TransformEbook'))

    return render_template('TransformEbook.html.j2', app = app, form=form, formTran=formTran)

