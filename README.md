# dokku-simple-import-export


## usage

Export from existing server (should have node.js installed on it)
```
~$ cd /home/dokku
~$ node dokku-export.js
```
this should create a dokku.dump.json in /home/dokku directory


Import in new server (should have node.js installed on it)
copy the previous dokku.dump.json in cd /home/dokku and run import command :

```
~$ cd /home/dokku
~$ node dokku-import.js dokku_dump.json .
```