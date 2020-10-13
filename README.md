# Fantasy Strike Stat Tracker
Stat tracker using the game logs to track wins and losses for both ranked and casual matches.

## Development

## Install and run
You will need to install and use yarn for the following steps. Details on how to install yarn will not be enclosed.

`yarn install`

`yarn start`

Once running a database file will be created in 

**Windows**: _%USERPROFILE%/fs-stat-tracker.db_

**Linux**: _/home/user/fs-stat-tracker.db_

After running go to config and point to the log file. This is typically found in `%USERPROFILE%/AppData/LocalLow/Sirlin Games/Fantasy Strike/output_log.txt`. Make sure to hit save.

### TODO
* add player table to separate config from player data (WIP)
    * Track rank from logs
    * Move the following to the player table:
        * rank
        * max rank
        * player name
* match history tab
* crash logs
* see if we can restart the logger process if it exits unexpectedly
