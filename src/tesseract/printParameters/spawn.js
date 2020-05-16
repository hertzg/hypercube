const spawnBuffered = require("../spawnBuffered");

const spawn = callback => spawnBuffered(["--print-parameters"], callback);

module.exports = spawn;
