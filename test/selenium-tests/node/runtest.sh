#!/bin/bash
#
# run selenium tests

set -e -u

echo "installing selenium if necessary"
npm ls | grep ' selenium-webdriver@' &>/dev/null || npm install --save selenium-webdriver
echo "installing chromedriver if necessary"
npm ls | grep ' chromedriver@' &>/dev/null || npm install --save chromedriver

echo "removing temporary directories"
mkdir -p images

export PATH=$PATH:node_modules/.bin/

for browser in chrome firefox; do
    SELENIUM_BROWSER=$browser node common/runtest.js tests/*.js
done
