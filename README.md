LITTLE-BUG
==========

LITTLE BUG Web Interface


SETUP

To start the LITTLE BUG web server automatically, add a cron job to the root user crontab:

```
# crontab -u root -e
```
... and add this line:
```
@reboot PORT=80 NODE_PATH=/usr/local/lib/node_modules /usr/local/bin/forever start -c /usr/bin/node -l /home/littlebug/web/LITTLE-BUG/log/log.log -o /home/littlebug/web/LITTLE-BUG/log/out.log -e /home/littlebug/web/LITTLE-BUG/log/error.log -a /home/littlebug/web/LITTLE-BUG/bin/www
```
Verify cron job:
```
# crontab -u root -l
```
