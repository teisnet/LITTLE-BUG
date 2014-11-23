#!/bin/bash
PORT=80 NODE_ENV=production forever start -l ~/web/LITTLE-BUG/log/out.log -o ~/web/LITTLE-BUG/log/out.log -e ~/web/LITTLE-BUG/log/out.log -a ~/web/LITTLE-BUG/bin/www
