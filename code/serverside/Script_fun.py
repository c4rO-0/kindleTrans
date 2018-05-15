#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#---------------------------------
# 函数

import os
import time
from Script_UserSession import *

def funQueryNumTran():
    """
        获取目前已转化电子书数目

    """
    # 读取文件夹
    dirs = os.listdir(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','uploads')) )
    num1 = len(dirs)

    with open(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','archive','toc.dat')),'r') as f:
        lines = f.readlines()
        f.close()

    num2 = len(lines)

    return num1 + num2



