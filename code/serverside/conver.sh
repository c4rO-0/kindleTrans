#!/bin/bash

if [ $# -eq 0 ] ; then
	echo "no input file"
	exit 2
fi

if [ $# -gt 2 ] ; then
	
	echo "two many arguments" $# $*
	exit 2
fi

name=$1
if [ -e $name ] ; then

	if [ $# -eq 2 ] ; then
		fileCode=$2
	else
		fileCode=$(/usr/bin/file -bi $name | sed -e 's/.*[ ]charset=//' |tr '[a-z]' '[A-Z')
	fi
	
	echo $fileCode
	# 转化
	info=$(iconv -f $fileCode -t UTF-8 $name > $name.p)
	echo '-----------'
	echo $info
	# if [ $info -ne 0 ] ; then
	# 	echo "iconv error"
	# 	exit info
	# fi
	cp $name.p $name
	exit 0

else
	echo "file not existed"
	exit 2
fi






