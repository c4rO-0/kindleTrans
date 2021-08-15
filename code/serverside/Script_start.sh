#!/bin/bash

# quit screen
screen -S kindle -X quit;

# create screen and run
kindleRoot=$( dirname $( dirname $(dirname "$0") ) )

screen -S kindle -dm bash -c "cd $kindleRoot; deactivate; source */bin/activate;clear; cd code; python main.py >> ./log/flask.log 2>&1"