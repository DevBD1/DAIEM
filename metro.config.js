const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for PowerPoint files
config.resolver.assetExts.push('pptx');

module.exports = config; 