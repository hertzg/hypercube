const spawnBuffered = require("../spawnBuffered");

const spawn = callback => spawnBuffered(["--list-langs"], callback);

module.exports = spawn;
