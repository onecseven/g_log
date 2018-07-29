const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;
const color = require("colors/safe");
/*
TODO:
cli argument to set your own root
version without fs promises?
version that works with es6 imports?
*/

//haha
Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};

let colorConfTemplate = {
  red: 0,
  green: 1,
  yellow: 2,
  blue: 3,
  magenta: 4,
  cyan: 5,
  white: 6
};

let settingsTemplate = {
  saveLogs: true,
  showLineNum: true,
  web: false,
};

let colors = {
  red: {
    write: log => console.log(color.red(log)),
    broadcast: (preArr, line, dir) => {
      let arr = sanitize(preArr);
      const io = require("socket.io-client");
      const socket = io("http://localhost:3000");
      let toSend = {
        timestamp: new Date().toString(),
        log: arr,
        origin: line,
        dir: dir
      };
      socket.emit("red", toSend);
      socket.on("killsig", () => socket.close());
    }
  },
  green: {
    write: log => console.log(color.green(log)),
    broadcast: (preArr, line, dir) => {
      let arr = sanitize(preArr);
      const io = require("socket.io-client");
      const socket = io("http://localhost:3000");
      let toSend = {
        timestamp: new Date().toString(),
        log: arr,
        origin: line,
        dir: dir
      };
      socket.emit("green", toSend);
      socket.on("killsig", () => socket.close());
    }
  },
  yellow: {
    write: log => console.log(color.yellow(log)),
    broadcast: (preArr, line, dir) => {
      let arr = sanitize(preArr);
      const io = require("socket.io-client");
      const socket = io("http://localhost:3000");
      let toSend = {
        timestamp: new Date().toString(),
        log: arr,
        origin: line,
        dir: dir
      };
      socket.emit("yellow", toSend);
      socket.on("killsig", () => socket.close());
    }
  },
  blue: {
    write: log => console.log(color.blue(log)),
    broadcast: (preArr, line, dir) => {
      let arr = sanitize(preArr);
      const io = require("socket.io-client");
      const socket = io("http://localhost:3000");
      let toSend = {
        timestamp: new Date().toString(),
        log: arr,
        origin: line,
        dir: dir
      };
      socket.emit("blue", toSend);
      socket.on("killsig", () => socket.close());
    }
  },
  magenta: {
    write: log => console.log(color.magenta(log)),
    broadcast: (preArr, line, dir) => {
      let arr = sanitize(preArr);
      const io = require("socket.io-client");
      const socket = io("http://localhost:3000");
      let toSend = {
        timestamp: new Date().toString(),
        log: arr,
        origin: line,
        dir: dir
      };
      socket.emit("magenta", toSend);
      socket.on("killsig", () => socket.close());
    }
  },
  cyan: {
    write: log => console.log(color.cyan(log)),
    broadcast: (preArr, line, dir) => {
      let arr = sanitize(preArr);
      const io = require("socket.io-client");
      const socket = io("http://localhost:3000");
      let toSend = {
        timestamp: new Date().toString(),
        log: arr,
        origin: line,
        dir: dir
      };
      socket.emit("cyan", toSend);
      socket.on("killsig", () => socket.close());
    }
  },
  white: {
    write: log => console.log(color.green(log)),
    broadcast: (preArr, line, dir) => {
      let arr = sanitize(preArr);
      const io = require("socket.io-client");
      const socket = io("http://localhost:3000");
      let toSend = {
        timestamp: new Date().toString(),
        log: arr,
        origin: line,
        dir: dir
      };
      socket.emit("white", toSend);
      socket.on("killsig", () => socket.close());
    }
  }
};

//helper functions

const topLevelCrawl = async function(dir, filelist = []) {
  try {
  var gitignore = await fsPromises
    .readFile(".gitignore")
    .toString()
    .split("\n");
  } catch {
    var gitignore = [];
  }
  gitignore.push("node_modules");
  gitignore.push(".git");
  let files = await fsPromises.readdir(dir); // -> gets list of things in given dir
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let check = await fsPromises.stat(path.join(dir, file));
    if (check.isDirectory()) filelist.push(file);
  }
  return filelist.filter(elem => !gitignore.includes(elem));
};

const findRoot = function(dir) {
  let current = fs.readdirSync(dir);
  if (dir === "/") return false;
  if (!current.includes(".g_log.conf") && !current.includes("package.json")) {
    return findRoot(path.join(dir, "/../"));
  } else if (
    current.includes("package.json") ||
    current.includes(".g_log.conf")
  ) {
    return dir;
  }
};

const saveToLog = async function(preArr, dir, line) {
  let arr = sanitize(preArr);
  let logDir = path.join(dir, "/.here.log");
  let toSave = {
    timestamp: new Date().toString(),
    log: arr,
    origin: line,
    dir: dir
  };
  var settings = JSON.stringify(toSave, null, 2);
  await fsPromises.appendFile(logDir, settings);
};

const sanitize = function (arr){
  return arr.map(elem => {
    if (typeof elem === 'string'){
      return elem;
    } else {
      return JSON.stringify(elem)
    }
  })
}

const genColorConf = async function(root) {
  let dirList = await topLevelCrawl(root); //?
  let results = colorConfTemplate;
  let wow = {};
  for (let key in results) {
    for (let index = 0; index < dirList.length; index++) {
      const currentDir = path.join(root, dirList[index]);
      if (index === results[key]) {
        wow[currentDir] = key;
      }
    }
  }
  let haveColors = Object.values(wow);
  let allColors = Object.keys(colorConfTemplate)
  let missingColors = allColors.diff(haveColors);
  wow['unassigned'] = missingColors;
  return wow;
};

const openColorConf = async function(confPath, root){
  try {
    var filehandle = await fsPromises.open(confPath, "r+");
    var unparsed = await filehandle.readFile("utf8");
    var conf = JSON.parse(unparsed);
    return conf;
  } catch (e) {
    throw new Error('no conf')  
  }
}

const makeColorConf = async function(confPath, root) {
    var noparse = await genColorConf(root);
    var colors = JSON.stringify(noparse, null, 2);
    try {
      await fsPromises.unlink(confPath)
    } catch (e){
      //nothing to see here folks
    }
    await fsPromises.appendFile(confPath, colors);   
    //lol error handling
    return JSON.parse(colors);
};

const assignColor = async function(confPath, dir){
  try {
    var filehandle = await fsPromises.open(confPath, "r+");
    var unparsed = await filehandle.readFile("utf8");
    var conf = JSON.parse(unparsed);
    let color = conf['unassigned'].pop();
    conf[dir] = color;
    await fsPromises.unlink(confPath)
    await fsPromises.appendFile(confPath, JSON.stringify(conf, null, 2));   
    return;
  } catch (e) {
    console.log('error assigning color to new folder', e);
  }
}


const findSettings = async function(settingsPath) {
  try {
    var filehandle = await fsPromises.open(settingsPath, "r+");
    var unparsed = await filehandle.readFile("utf8");
    var conf = JSON.parse(unparsed);
    return conf;
  } catch (e) {
    var settings = JSON.stringify(settingsTemplate, null, 2);
    try {
      await fsPromises.unlink(settingsPath)
    } catch (e){
    }
    await fsPromises.appendFile(settingsPath, settings);
    return JSON.parse(settings);
  }
};

exports.findSettings = findSettings;
exports.topLevelCrawl = topLevelCrawl;
exports.findRoot = findRoot;
exports.saveToLog = saveToLog;
exports.openColorConf = openColorConf;
exports.makeColorConf = makeColorConf;
exports.colors = colors;
exports.assignColor = assignColor;