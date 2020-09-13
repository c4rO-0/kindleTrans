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

#=================================


@app.route('/MonkeyPage' , methods = ['GET', 'POST']  )
def MonkeyPage():

    return render_template('MonkeyPage.html.j2', app = app, jsV=jsV)    