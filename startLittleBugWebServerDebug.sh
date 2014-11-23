#!/bin/bash
PORT=3003 NODE_ENV=debug forever start -l ~/web/LITTLE-BUG/log/out.log -o ~/web/LITTLE-BUG/log/out.log -e ~/web/LITTLE-BUG/log/out.log -a ~/web/LITTLE-BUG/bin/www
