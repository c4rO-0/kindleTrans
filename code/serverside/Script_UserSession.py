from flask import session


# 对session操作
#──────────────────────────
# discription:
# session 目前存储 :
#--------------------------
# key           : lang
# type          : str
# value         : en, zh
# description   : 界面语言
#-------------------------
# key           : logStatus
# type          : bool
# value         : True, False
# description   : 用户是否已经登录
#──────────────────────────
# Interface:
# 命名规则 :
# 1. 以session开头, 以区分操作db文件
# 2. 动作作为第二个单词, 
#       query   : 查询
#       save    : 保存
#       del     : 删除
# 3. 名词作为第三个单词, 表示被操作物
#       language
# 4. 之后为形容词/名词, 以区分不同操作对象
#       language    ->  Used
#       status      ->  Logged
#       user        ->  Name    -> Current 
#                               -> Remember (未完)
#       
#
#══════════════════════════════════════════════════════════════════════════════════════════════════════════════════    

#<------------上传----------->

def sessionQueryFileUpload():
    """
    查询上传文件信息

    out :
        _   dict    {
                    filename        : str
                    saveFileName    : str
                    filePath        : str
                    }
    """

    return session.get('fileUpload', None)



def sessionSaveFileUpload(fileUpload):
    """
    保存上传文件信息

    in :
        fileUpload   dict   {
                            filename        : str
                            saveFileName    : str
                            filePath        : str
                            }
    out :
        _   int 0 成功
                1 变量已经含有
                2 value 为空
                3 key 不对
    """

    for value in fileUpload.values():
        if(value == "" or value == None):
            return 2

    for key in fileUpload.keys():
        if( not (key in ['filename', 'saveFileName', 'filePath'])):
            return 3

    if sessionQueryFileUpload == None:
        return 1
    else:
        session['fileUpload'] = fileUpload
        return 0

def sessionDelFileUpload():
    """
    删除上传文件信息
    """
    session.pop('fileUpload', None)


def sessionSaveTOC(TOC):
    """
    储存目录
    in  :
        TOC [[idx, index, title]
                ...
            ]
            indx 书籍标号
            index  单个书籍里chapter的标号
            title 目录
    out :
    """

    session['TOC'] = TOC

def sessionQueryTOC():
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

    return session.get('TOC', None)


#==============================
#         jinja 函数
from main import app

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

    return dict(\
    J2SessionQueryFileUpload=J2SessionQueryFileUpload, \
    J2SessionQueryTOC=J2SessionQueryTOC \
    )
