#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#---------------------------------
from config import *
from main  import *
from flask import Flask, render_template, request, redirect,  url_for, g, send_from_directory
from flask.ext.babel import gettext
from config import DEFAULT_TITLE_FILTER
#---------------------------------


@app.route('/AboutUsPage' , methods = ['GET', 'POST']  )
def AboutUsPage():

    return render_template('AboutUsPage.html.j2', app = app)