from main import db

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
    ##     - opMode : 操作种类 | 取钱 存钱
    ##     - opMount : 操作数量 | 钱数
    ##     - currency : 货币种类 | 默认是人民币和欧元, 也可以是别的
    ##     - opLog : 操作说明

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)

    def __init__(self, username, email):
        self.username = username
        self.email = email

    def __repr__(self):
        return '<User %r>' % self.username  