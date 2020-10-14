Current release: [Click here](https://github.com/grimkor/fs-stat-tracker/releases)

# FS Stat Tracker

FS Stat Tracker is a stat tracker for Fantasy Strike. By running in the background the FS Stat Tracker will record match and game results as they occur feeding back win:loss and rank for ranked and casual.

FS Stat Tracker achieves this by reading the game logs and storing results in a local database. All data is stored locally and not shared over the internet.

![Screenshot](img/fs-stat-tracker_overview.png)

## Installation

There is no installation required for this, I have purposefully built this to run as a portable executable file.
Currently, there is only a Windows version of this however other versions can become available if there is demand.

The current release can be found here: [current release](https://github.com/grimkor/fs-stat-tracker/releases)

### How to use the FS Stat Tracker

It is important to run this program each time before running Fantasy Strike. With that in mind there is not much to it other than to extract the executable file and double-click.

Once the program has opened you will need to go to "Config" and fill in the "Log file" setting. This is typically found in `%USERPROFILE%/AppData/LocalLow/Sirlin Games/Fantasy Strike/output_log.txt`.

**Make sure you hit save!**

####** IMPORTANT NOTE **
The FS File Tracker stores its data in a database file found in the following locations:

**Windows**: _%USERPROFILE%/fs-stat-tracker.db_
\
**Linux**: _/home/user/fs-stat-tracker.db_

Deleting this file will mean deleting all tracked results.

## Development

### Install and run

You will need to install and use yarn for the following steps. Details on how to install yarn will not be enclosed.

`yarn install`
\
`yarn start`

Once running a database file will be created in

**Windows**: _%USERPROFILE%/fs-stat-tracker.db_

**Linux**: _/home/user/fs-stat-tracker.db_

After running go to config and point to the log file. This is typically found in `%USERPROFILE%/AppData/LocalLow/Sirlin Games/Fantasy Strike/output_log.txt`. Make sure to hit save.

### Building

`yarn install`
\
`yarn build`

Output should be in _<project_root>/dist_

### TODO

- ~~add player table to separzate config from player data~~
  - ~~Track rank from logs~~
  - ~~Move the following to the player table:~~
    - ~~rank~~
    - ~~max rank~~
    - ~~player name~~
- crash logs
- tests
- match history tab
- see if we can restart the logger process if it exits unexpectedly
