#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#---------------------------------
# 备份上传的小说

import os

# 读取文件夹
dirs = os.listdir(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','uploads')) )
for file in dirs:
   print(file)