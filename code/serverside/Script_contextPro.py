#!/usr/bin/env python3
# -*- coding: utf-8 -*-


#==============================
#         jinja 函数
from main import app


from Script_UserSession import *
from Script_fun import *

#-------------filter-----------------

# @app.template_filter('XXXX')
# def XXXX():

#-------------context_processor-----------------
@app.context_processor
def sessionUtilityProcessor():
#     # 返回登录状态
    def J2SessionQueryFileUpload():
        """
            查询上传文件信息

            out :
                _   dict    {
                            filename        : str
                            saveFileName    : str
                            filePath        : str
                            isCoverUpload   : bool
                            }
        """
        return sessionQueryFileUpload()

    def J2SessionQueryTOC():
        """
        查询目录
        out  :
            TOC [[idx, index, title]
                    ...
                ]
                indx 书籍标号
                index  单个书籍里chapter的标号
                title 目录
        """
        return sessionQueryTOC()


    def J2sessionQueryChapterMaxLength():
        """
        查询最长目录限制

        out :
            _   ChapterMaxLength 查询最长目录限制
        """

        
        return sessionQueryChapterMaxLength()

    def J2sessionQueryTitleFilter():
        """
        查询目录匹配字符串

        out :
            _   TitleFilter 正则表达式
        """

        
        return sessionQueryTitleFilter()



    def J2FunQueryNumTran():
        """
            查询转化的书的数目

        """
        return funQueryNumTran()        

    return dict(\
    J2SessionQueryFileUpload=J2SessionQueryFileUpload, \
    J2SessionQueryTOC=J2SessionQueryTOC, \
    J2sessionQueryChapterMaxLength = J2sessionQueryChapterMaxLength, \
    J2sessionQueryTitleFilter=J2sessionQueryTitleFilter, \
    J2FunQueryNumTran=J2FunQueryNumTran \
    )
