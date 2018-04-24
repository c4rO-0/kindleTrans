#!/bin/bash

if [ $# -eq 0 ] ; then
	echo "no input file"
	exit 2
fi
name=$1

if [ -e $name ] ; then
	# fileCode=$("file -bi "$name" | sed -e 's/.*[ ]charset=//' |tr '[a-z]' '[A-Z'")
	fileCode=$("file *.txt")
	echo $fileCode 
else
	echo "file not existed"
	exit 2
fi


