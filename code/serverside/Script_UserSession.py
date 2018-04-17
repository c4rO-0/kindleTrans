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
#       status
#       user
# 4. 之后为形容词/名词, 以区分不同操作对象
#       language    ->  Used
#       status      ->  Logged
#       user        ->  Name    -> Current 
#                               -> Remember (未完)
#       
#
#══════════════════════════════════════════════════════════════════════════════════════════════════════════════════    

#<------------语言相关----------->

def sessionQueryLangurageUsed():
    """
    查询用户所用语言

    out :
        _   str 语言码. 用户未指定,返回默认语言
    """

    from config import default_lang
    return session.get('lang', default_lang)

def sessionSaveLanguageUsed(lang):
    """
    保存用户指定语言.(该函数不会检查语言合法性)
    
    in :
        lang    str 语言码
    """

    session['lang'] = lang



#<------------登录信息----------->

def sessionQueryStatusLogged():
    """
    查询用户登录状态

    out :
        _  bool 是否登录
    """

    return session.get('logStatus')


def sessionSaveStatusLogged():
    """
    保存登录状态
    """
    session['logStatus'] = True


def sessionDelStatusLogged():
    """
    删除登录状态. 登出
    """
    session['logStatus'] = False   
    session.pop('logStatus', None)


def sessionQueryUserNameCurrent():
    """
    查询当前登录的用户名. Current : 当前登录的 Remember : 曾经登录记住的

    out :
        _   str/None 如果用户名被保存过返回用户名, 否则返回None
    """
    return session.get('usernameCurrent', None)

def sessionSaveUserNameCurrent(usernameCurrent, rememberMe = False):
    """
    储存当前登录的用户名. Current : 当前登录的 Remember : 曾经登录记住的

    in  :
        usernameCurrent str 登录的用户名
        rememberMe      bool    是否记住当前用户
    """

    session['usernameCurrent'] = usernameCurrent

    # rememberMe未完...

def sessionDelUserNameCurrent():
    """
    删除当前登录用户名
    """

    session.pop("usernameCurrent", None)


#==============================
#         jinja 函数
from main import app

#-------------filter-----------------

# @app.template_filter('XXXX')
# def XXXX():

#-------------context_processor-----------------
@app.context_processor

def sessionUtilityProcessor():
    # 返回登录状态
    def J2SessionQueryStatusLogged():
        """
        查询用户登录状态

        out :
            _  bool 是否登录
        """        
        return sessionQueryStatusLogged()
    def J2SessionQueryUserNameCurrent():
        """
        查询当前登录的用户名. Current : 当前登录的 Remember : 曾经登录记住的

        out :
            _   str/None 如果用户名被保存过返回用户名, 否则返回None
        """        
        return sessionQueryUserNameCurrent()
 
    return dict(\
    J2SessionQueryStatusLogged=J2SessionQueryStatusLogged, \
    J2SessionQueryUserNameCurrent=J2SessionQueryUserNameCurrent)
