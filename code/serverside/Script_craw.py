#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import urllib.request  

import execjs 

import os

from bs4 import BeautifulSoup

from urllib import parse

import re
 

headers ={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'}  

# ==================class=======================


# ===================func======================

def requestHtml(url, headerIn=None):
    if headerIn is not None:
        req = urllib.request.Request(url=url,headers=headers)  
    else:
        req = urllib.request.Request(url=url)  
    res = urllib.request.urlopen(req)  
    return res.read().decode('utf-8') 

def searchDouban(bookName):
    url = 'https://www.douban.com/search?cat=1001&q='+parse.quote(bookName)
    print(url)
    return requestHtml(url,headers)


def get_js(jsPath):  
    f = open(jsPath, 'r', encoding='UTF-8')  
    line = f.readline()  
    htmlstr = ''  
    while line:  
        htmlstr = htmlstr + line  
        line = f.readline()  
    return htmlstr  

def doubanBook(bookName):
    strhtml = searchDouban(bookName )

    soupHtml=BeautifulSoup(strhtml,"lxml")
    booklink = soupHtml.find('div',class_="title").a.get('href')

    if(booklink is not None):

        print(booklink)
        bookPage=requestHtml(booklink,headers)
        soupBookPage = BeautifulSoup(bookPage,"lxml")
        if(soupBookPage.find(id='info') is not None):
            author = soupBookPage.find(id='info').a.get_text()
            author = re.sub('\s+', ' ', author.strip())
        else:
            author = 'c4r'
    return author

if __name__ == '__main__':

    auther = doubanBook('圣女的救济(圣女の救済)')
    print(auther)
