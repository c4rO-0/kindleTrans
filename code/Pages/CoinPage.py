#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#---------------------------------
from config import *
from main  import *
from flask import Flask, render_template, request, redirect,  url_for, g, jsonify
from flask.ext.babel import gettext
import json
import urllib.request
#---------------------------------
import os

from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired
from wtforms import SubmitField, FieldList, IntegerField, StringField, BooleanField
from werkzeug.utils import secure_filename

from wtforms.validators import ValidationError

#=================================

class UploadForm(FlaskForm):

    user = StringField('User')
    upload = SubmitField('comfirm')

    def validate_user(self, field):
        # print("file user", file=sys.stderr)

        str_username = field.data
        if not ('-' in str_username and \
           str_username.rsplit('-', 1)[1].isdecimal()):
           print("格式不对", file=sys.stderr)
           raise ValidationError(gettext('用户名格式不对'))


def getCoinDataDirectList(user):
    # Opening JSON file 
    rootpath_server = '/home/public/autoDigiCoin/'
    # rootpath_server = '/home/bsplu/workspace/autoDigiCoin/'

    if(os.path.exists(rootpath_server)):
        
        list_symbol = [f for f in os.listdir(os.path.join(rootpath_server, 'log/')) if (os.path.isdir(os.path.join(rootpath_server, 'log/', f)) and user in f)  ]

        # list_symbol.pop(0)

        return {
            'list_symbol': list_symbol
        }

    else:
        try:
            with urllib.request.urlopen("http://papercomment.tech/_getCoinDataList/"+user) as url:
                data = json.loads(url.read().decode())
                return data
        except :
            return None

    return None

@app.route('/_getCoinDataList/<user>' , methods = ['GET', 'POST']  )
def getCoinDataList(user):

    return jsonify(getCoinDataDirectList(user))


@app.route('/_getCoinData/<symbol>' , methods = ['GET', 'POST']  )
def getCoinData(symbol):

    # Opening JSON file 
    
    rootpath_server = '/home/public/autoDigiCoin/'
    # rootpath_server = '/home/bsplu/workspace/autoDigiCoin/'

    if(os.path.exists(rootpath_server)):
        path = os.path.join(rootpath_server, 'log', symbol, 'coinData.json')
        if(os.path.exists(path)):
            try:
                with open(path,'r') as f:
                    orderInfo = json.load(f) 

                    return jsonify(orderInfo)  
            except :
                return jsonify(None)

    else: 
        with urllib.request.urlopen("http://papercomment.tech/_getCoinData/"+symbol) as url:
            data = json.loads(url.read().decode())
            return jsonify(data)    

    return jsonify(None)

@app.route('/CoinDataPage/<user>' , methods = ['GET', 'POST']  )
def CoinDataPage(user):

    return render_template('CoinDataPage.html.j2', app = app, form=None, user=user, jsV=jsV)    


@app.route('/CoinDataPage' , methods = ['GET', 'POST']  )
def CoinDataPageUndefinedUser():

    form = UploadForm()
    if form.validate_on_submit():
        if(getCoinDataDirectList(form.user.data) and getCoinDataDirectList(form.user.data)['list_symbol']):
            return redirect("/CoinDataPage/"+form.user.data)

    return render_template('CoinDataPage.html.j2', app = app, form=form, user=None, jsV=jsV)