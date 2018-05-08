#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from flask_socketio import SocketIO, emit
from main import socketio

@socketio.on('connect')                                                         
def connect():                                                                  
    # emit('message', {'hello': "Hello"})   
    print("connect")
    

def hello():
    socketio.emit('message', {'goodbye': "Goodbye"})