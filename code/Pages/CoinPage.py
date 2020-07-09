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

@app.route('/_getCoinData' , methods = ['GET', 'POST']  )
def getCoinData():

    # Opening JSON file 
    
    path_server = '/home/public/autoDigiCoin/log/coinData.json'
    # path_local = '../example/coinData.json'
    if(os.path.isfile(path_server) ):
        path = path_server
        with open(path,'r') as f:
            orderInfo = json.load(f) 
            # {
            #   "time": 1594223420, 
            #   "marketInfo": {
            #     "balance": {"n_eth_f": 0.9045, "n_eth_t": 0.3722652, "n_btc_f": 0.0141319009, "n_btc_t": 0.0032464102568, "n_eth_eff": 1.9433415168578114}, 
            #     "kline": {"timestamp": 1594223100, "highest": 0.02608, "lowest": 0.026043, "volume": 5.5469703675, "open": 0.026069, "close": 0.026071, "amount": 212.8445, "count": 299}, 
            #     "p_average_up": 0.026082737013846388, 
            #     "p_average_dn": 0.026065489660793154, 
            #     "line_k": -9.578262755749129e-06, "line_b": 0.026085693669012023
            #   }, 
            #   "unprocHookInfo": {"n_buy": 3, "n_sell": 9, "p_buy_high": 0.025912, "p_sell_low": 0.026258}, 
            #   "filledHookOrderInfo": {"n_buy": 0, "n_sell": 4, "p_buy_high": null, "p_sell_low": 0.026132}, 
            #   "lastHookOrder": 295.7312, 
            #   "unprocNailInfo": {"n_buy": 37, "n_sell": 0, "p_buy_high": 0.025975, "p_sell_low": null}, 
            #   "cutNailInfo": {"n_buy": 2, "n_sell": 0, "p_buy_high": 0.025126, "p_sell_low": null}, 
            #   "filledNailOrderInfo": {"n_buy": 3, "n_sell": 0, "p_buy_high": 0.02607, "p_sell_low": null}, 
            #   "lastNailOrder": 174.18878333333333
            # }
            # print(orderInfo)
            return jsonify(orderInfo)        
    else:
        # path = path_local
        with urllib.request.urlopen("http://papercomment.tech/_getCoinData") as url:
            data = json.loads(url.read().decode())
            return jsonify(data)      



    return jsonify(None)

@app.route('/CoinDataPage' , methods = ['GET', 'POST']  )
def CoinDataPage():

    return render_template('CoinDataPage.html.j2', app = app, jsV=jsV)    