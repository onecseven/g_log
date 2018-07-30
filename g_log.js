const fs = require("fs");
const Console = require("console").Console;
const path = require("path");
const helpers = require("./helpers.js");

Object.defineProperty(global, "__stack", {
  get: function() {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack) {
      return stack;
    };
    var err = new Error();
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

Object.defineProperty(global, "__line", {
  get: function() {
    let line = __stack[2].getLineNumber();
    let file = __stack[2].getFileName();
    return `${file} @ ${line}`;
  }
});


Object.defineProperty(global, "__file", {
  get: function() {
    let file = __stack[2].getFileName();
    return `${file}`;
  }
});

Object.defineProperty(global, "__dir", {
  get: function() {
    let file = __stack[2].getFileName();
    let arr = file.split("").reverse();
    let result = file.split("");
    for (let i = 0; i < arr.length; i++) {
      const elem = arr[i];
      if (elem !== "/") {
        result.pop();
      } else if (elem === "/") {
        result.pop();
        break;
      }
    }
    return result.join("");
  }
});


//try catch for conf generation in require

var log = async function(...output) {
  let currentLine = __line; // YOU CAN'T PUT THIS AFTER AN AWAIT
  let dirPath = __dir;      // IT WILL LOSE REFERENCE
  let root = helpers.findRoot(dirPath);
  let colorConfPath = path.join(root, "/.g_log.conf");
  let settingsPath = path.join(root, "/.g_settings.conf");
  var settings = await helpers.findSettings(settingsPath)
  try {
    var colorConf = await helpers.openColorConf(colorConfPath, root)
  } catch(e){
    var colorConf = await helpers.makeColorConf(colorConfPath, root)
  }
  let currentColor = colorConf[String(dirPath)];
  if (currentColor === undefined) {
    helpers.assignColor(colorConfPath, dirPath) //new folder
    var colorConf = await helpers.openColorConf(colorConfPath, root)
    currentColor = colorConf[String(dirPath)];
  } 
  for (let i = 0; i < output.length; i++) {
    const elem = output[i];
    helpers.colors[currentColor].write(elem);
    if (i === output.length - 1 && settings.showLineNum) helpers.colors[currentColor].write('- '+currentLine)
  }
  if (settings.saveLogs) helpers.saveToLog(output, dirPath, currentLine, dirPath)
  if (settings.web) {
    helpers.colors[currentColor].broadcast(output, currentLine, dirPath)
  }
  return
};

exports.log = log;
//debuggers

// let here = topLevelCrawl('/home/one-q/code/');
// console.log(__dirname)
// console.log(here)
// console.log(__line);
// const output = fs.WriteStream('./stdout.log');
// const errorOutput = fs.createWriteStream('./stderr.log');
// const logger = new Console({ stdout: output, stderr: errorOutput });
// const count = 'hi guys';
// logger.trace(`hi wow ${count}`);
