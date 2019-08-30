#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#---------------------------------
# 备份上传的小说

import os
import time

# 读取文件夹
dirs = os.listdir(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','uploads')) )
# 当前时间
timeCurrent = time.time()
# 循环所有文件夹
for dir in dirs:
   # 获取时间
   timeDot = float(dir.rsplit('-')[0])
   # 判断时间差 超过一天

   if ((timeCurrent-timeDot)/(60.*60.*24.) > 1. ):
        # 文件已经超过一天, 进行归档
        ## 首先判断是否含有mobi文件
        files = os.listdir(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','uploads', dir)) )
        if( 'project-1.mobi' in files):
            # 得到书名
            title = None
            share = None
            if(os.path.exists(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','uploads', dir, '.project.ini')))):
                with open(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','uploads', dir, '.project.ini')), 'r', encoding='UTF-8') as f:
                    lines = f.readlines()
                    for line in lines:
                        if(len(line) > 6 and line[0:6] == 'title='):
                            title = line.strip('\n')[6:]    
                        if(len(line) > 6 and line[0:6] == 'share='):
                            if(line.strip('\n')[6:] == 'true'):
                                share = True
                            else:
                                share = False

            # print(title , share)
            # print((title is not None) and share == True)
            if (title is not None) and share == True:
                # 开始备份
                ## 删除除txt和mobi的其他文件
                for file in files:
                    if(file.rsplit('.',1)[1] not in ['txt', 'mobi'] and file != 'project-TOC.html'):
                        # 删除 
                        os.remove(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','uploads', dir, file )))
                ## 备份
                if (not os.path.exists(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','archive'))) ):
                    os.makedirs(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','archive')))         
                
                os.system('tar -czf ' + os.path.abspath(os.path.join(os.path.dirname(__file__),'..','archive', dir )) + ".tar.gz -C "  + os.path.abspath(os.path.join(os.path.dirname(__file__),'..','uploads', dir)) + " ." ) 
                # print('tar -czf ' + os.path.abspath(os.path.join(os.path.dirname(__file__),'..','archive', dir )) + ".tar.gz -C "  + os.path.abspath(os.path.join(os.path.dirname(__file__),'..','uploads', dir)) + " ." )
                ## 写入记录
                with open(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','archive', 'toc.dat')), 'a+', encoding='UTF-8') as f:
                    f.write(dir+"\t"+title+"\n")
                    f.close()

        # 归档完成, 删除文件夹
        os.system('rm -rf ' + os.path.abspath(os.path.join(os.path.dirname(__file__),'..','uploads', dir)))

   