#---------------------------------
from main  import *
from flask import render_template, request
from flask.ext.babel import gettext
#=================================

@app.route('/TransformEbook' , methods = ['GET', 'POST']  )
def TransformEbook():
    #....

    return render_template('TransformEbook.html.j2', app = app)