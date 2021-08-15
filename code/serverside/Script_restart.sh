#!/bin/bash

# quit screen
screen -S kindle  -X quit

# create screen and run
kindleRoot='/home/public/kindleTrans'
screen -S kindle  -dm bash -c "cd $kindleRoot; deactivate; source */bin/activate;clear; cd code; nohup python main.py >> ./log/flask.log 2>&1 &"