'use strict';

const { worldStates, socketLogger: logger, warframeData: { locales } } = require('../../lib/utilities');

const worldstate = (socket) => {
  // on worldstate updates
  const keys = Object.keys(worldStates);
  keys.forEach((platform) => {
    locales.forEach((locale) => {
      worldStates[platform][locale].on('update', (data) => {
        const packet = { platform, data, language: locale };
        socket.emit('ws-update', packet);
        require('./parseEvents')({ worldstate: data, platform, socket });
      });
    });
  });

  // on initial worldstate request?
  // can't handle lang yet, but take it anyway
  socket.on('ws-init', async ({ platform, language }) => {
    logger.debug(`socket ${socket.id} sent 'ws-init'`);
    socket.emit('ws-supply', { platform, language, ws: await worldStates[platform || 'pc'].getData() });
  });
};

module.exports = worldstate;
