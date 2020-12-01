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

@app.route('/_getCoinDataList/<user>' , methods = ['GET', 'POST']  )
def getCoinDataList(user):

    # Opening JSON file 
    rootpath_server = '/home/public/autoDigiCoin/'
    # rootpath_server = '/home/bsplu/workspace/autoDigiCoin/'

    if(os.path.exists(rootpath_server)):
        
        list_symbol = [f for f in os.listdir(os.path.join(rootpath_server, 'log/')) if (os.path.isdir(os.path.join(rootpath_server, 'log/', f)) and user in f)  ]

        # list_symbol.pop(0)

        return jsonify({
            'list_symbol': list_symbol
        })

    else:
        try:
            with urllib.request.urlopen("http://papercomment.tech/_getCoinDataList") as url:
                data = json.loads(url.read().decode())
                return jsonify(data)  
        except :
            return jsonify(None)

    return jsonify(None)


@app.route('/_getCoinData/<symbol>' , methods = ['GET', 'POST']  )
def getCoinData(symbol):

    # Opening JSON file 
    
    rootpath_server = '/home/public/autoDigiCoin/'
    # rootpath_server = '/home/bsplu/workspace/autoDigiCoin/'

    if(os.path.exists(rootpath_server)):
        path = os.path.join(rootpath_server, 'log', symbol, 'coinData.json')
        if(os.path.exists(path)):
            with open(path,'r') as f:
                orderInfo = json.load(f) 

                return jsonify(orderInfo)  
    else: 
        with urllib.request.urlopen("http://papercomment.tech/_getCoinData/"+symbol) as url:
            data = json.loads(url.read().decode())
            return jsonify(data)    

    return jsonify(None)

@app.route('/CoinDataPage/<user>' , methods = ['GET', 'POST']  )
def CoinDataPage(user):

    return render_template('CoinDataPage.html.j2', app = app, user=user, jsV=jsV)    