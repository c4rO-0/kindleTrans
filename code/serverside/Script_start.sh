#!/bin/bash


if [ "$1" == "-h" ]; then
	echo '| bash Script_start.sh [-k]'
	echo '|     : start to run kindle.'
	echo '| -k  : kill kindle'
	exit 0
elif [ "$1" == "-k" ]; then
    # quit screen
    screen -S kindle -X quit;
else
    # quit screen
    screen -S kindle -X quit;

    # create screen and run
    kindleRoot=$( dirname $( dirname $(dirname "$0") ) )

    screen -S kindle -dm bash -c "cd $kindleRoot; deactivate; source */bin/activate;clear; cd code; python main.py >> ./log/flask.log 2>&1"
fi