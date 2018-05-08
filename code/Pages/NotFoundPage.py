#!/usr/bin/env python3
# -*- coding: utf-8 -*-

#---------------------------------
from main  import *
from flask import render_template, request, redirect

@app.route('/404',  methods = ['GET', 'POST']  )
def NotFound():
    #....
    return render_template('404.html.j2', app=app, error=None)

@app.route('/404/<error>')
def NotFounderror(error):
    #....
    return render_template('404.html.j2', app=app, error=error)