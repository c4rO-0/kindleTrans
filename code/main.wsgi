#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
sys.path.insert(0, "/var/www/kindleTrans")
sys.path.insert(0, "/var/www/kindleTrans/code")
# sys.path.insert(0, "/var/www/kindleTrans/venv-kindle/lib/python3.6/site-packages")
activate_this = '/var/www/kindleTrans/venv-kindle/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

from main import app as application
application = app