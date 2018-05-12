#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from flask.ext.babel import gettext
#---------------------------------
# 检验password和用户名
import UsernamPasswordValidation
#---------------------------------
# 注册
from config import regestionLengthNameMin, regestionLengthNameMax, regestionLengthPasswdMin, regestionLengthPasswdMax
# 处理字符串



def CheckUserNamePasswd(userName, userPasswd):
    """
        检测用户输入的用户名和密码是否合法
        1. 用户名：5-18位
            可以包含字母（大小写不敏感）或数字或_(下划线)
        2. 密码：6-18位
            可以包含字母（大小写敏感）或数字或常用符号（!@#$%^&*()_英文半角）
        3. 用户名不与密码相同（比较时大小写不敏感）
        
        in :
            UserName    str 用户名
            userPasswd  str 密码
        out :
            _   bool    是否通过
            _   str     没有通过原因

    """
    para = { 'UsrLenMin':regestionLengthNameMin ,  'UsrLenMax':regestionLengthNameMax ,\
     'PasLenMin':regestionLengthPasswdMin , 'PasLenMax':regestionLengthPasswdMax }

    f = UsernamPasswordValidation.UsernamPasswordValidation(userName,userPasswd,para)
    e = f.GetAllErrors()
    print("script_str : " , e, file=sys.stderr)
    if(len(e) == 0):
        Info = True
        strWarning = ""
    else:
        strWarning = ""
        for i_info, i_strWarning in e:
            if( i_info == 1):
                strWarning += gettext(u'username need contain %(lengthMin)s-%(lengthMax)s characters. ',\
                    lengthMin = regestionLengthNameMin,lengthMax =regestionLengthNameMax) 
            elif( i_info == 2 ):
                strWarning += gettext(u'Illegal character %(w)s', w=i_strWarning)
            elif( i_info == 3):
                strWarning += gettext(u'Password need contain %(lengthMin)s-%(lengthMax)s characters. ',\
                    lengthMin = regestionLengthPasswdMin,lengthMax =regestionLengthPasswdMax)
            elif( i_info == 4):
                strWarning += gettext(u'Illegal character %(w)s\n', w=i_strWarning)     
            elif( i_info == 5):
                strWarning += gettext(u'Password is similar to username. They are almost the same. ')
            else:
                gettext(u'Unknown user & password error number : %(errornumber)s. ',errornumber=i_info)

        Info = False

        # print(strWarning)
    return Info, strWarning






#
# # 处理字符串
#
# def CheckUserName(userName):
#     """
#     检查申请的用户名是否合法
#
#     in  :
#         userName str 输入的用户名
#     out :
#         _   bool    申请的用户名是否合法. True 合法 False 不合法
#     """
#
#     # 等待Hengyue修改
#     # 暂时返回True
#
#     return True
#
# def CheckUserPasswd(userPasswd):
#     """
#     检查申请的用户密码是否合法
#
#     in  :
#         userPasswd str 输入的用户密码
#     out :
#         _   bool    申请的用户密码是否合法. True 合法 False 不合法
#     """
#
#     # 等待Hengyue修改
#     # 暂时返回True
#
#     return True
