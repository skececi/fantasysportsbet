#!/bin/bash
flask_app=$PWD/app/http/api/endpoints.py
flask_env=development
port=4433

FLASK_APP=$flask_app FLASK_ENV=$flask_env python3 -m flask run --port $port