const path = require('path');
function isRelative(filepath) {
  return filepath.charAt(0) === '.';
}

function toAbsolutePath(plugin) {
  return isRelative(plugin) ? path.join(process.cwd(), plugin) : plugin;
}


module.exports = function getThemeConfig(configFile) {
  const customizedConfig = require(configFile);
  const config = Object.assign({ plugins: [] }, customizedConfig);
  config.plugins = config.plugins.map(toAbsolutePath);

  return config;
};
