hi this is g_log

so g_log is like console log, but it colors your logs depending on
which folder they came from. you just call them and it'll assign
colors automatically to all the folders at the same level as package.json
in a file called .g_log.conf. you can place that file anywhere in your
file structure and assign colors to directories manually.

you can install it like

$npm install --save-dev  g_log

and then do

const {log} = require("g_log")

and you'll be able to do:

log('Anything!');

BY DEFAULT

//we save logs to text files
//show line num and source file
//no web terminals

you can change any of these settings at
.g_settings.conf (it'll be in the same folder as package.json)
and it'll stop doing them.

if you want to use the web view, run watch.js and change
the web setting in the settings file to true, and it'll spit
out your console logs in a browser window.