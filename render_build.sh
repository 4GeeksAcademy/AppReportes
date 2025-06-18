#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

pipenv install -r requirements.txt

# pipenv run migrate
pipenv run upgrade
