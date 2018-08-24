from main import db
from datetime import datetime
from dateutil import tz

# 类的定义

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True)
#     email = db.Column(db.String(120), unique=True)

#     def __init__(self, username, email):
#         self.username = username
#         self.email = email

#     def __repr__(self):
#         return '<User %r>' % self.username  


class manageMoney(db.Model):
    '''
    存钱管理. 对应manageMoney页面
    '''
    # 每一条是一次记录
    ## 包括 :
    ##     - ID
    ##     - opName : 操作人
    ##     - IP : 操作人ip地址
    ##     - opTime : 操作的实时时间 | 在网页上记录的时间
    ##     - recordTime : 记录时间 | 实际存钱时间
    ##     - opMode : 操作种类 |  存钱 0  取钱 1
    ##     - opMount : 操作数量 | 钱数
    ##     - currency : 货币种类 | 默认是人民币和欧元, 也可以是别的
    ##     - opLog : 操作说明

    id = db.Column(db.Integer, primary_key=True)
    opName = db.Column(db.String(10))
    IP = db.Column(db.String(100))
    opTime = db.Column(db.Integer)
    recordTime = db.Column(db.Integer)
    opMode = db.Column(db.Integer)
    opMount = db.Column(db.Float)
    currency = db.Column(db.String(5))
    opLog = db.Column(db.Text)


    def __init__(self, opName, IP, opTime, recordTime, opMode, opMount, currency, opLog):
        '''
        ID
        opName : 操作人
        IP : 操作人ip地址
        opTime : 操作的实时时间 | 在网页上记录的时间
        recordTime : 记录时间 | 实际存钱时间
        opMode : 操作种类 | 取钱 存钱
        opMount : 操作数量 | 钱数
        currency : 货币种类 | 默认是人民币和欧元, 也可以是别的
        opLog : 操作说明
        '''
        self.opName = opName
        self.IP = IP
        self.opTime = opTime
        self.recordTime = recordTime
        self.opMode = opMode
        self.opMount = opMount
        self.currency = currency
        self.opLog = opLog

    def __repr__(self):
        if (self.opMode == 1):
            strMode = "取钱"
        else:
            strMode = "存钱"

        tzlocal = tz.tzoffset('UTC', 28800) # 转化为北京时间
        strDate = datetime.fromtimestamp(float(self.recordTime)/1000.,tzlocal).strftime('%Y-%m-%d')

        


        return '<%s|'%(self.opName ) + strMode +'|%f'%(self.opMount)+'|%s'%(self.currency)+'|'+strDate +'|%s>'%(self.opLog)