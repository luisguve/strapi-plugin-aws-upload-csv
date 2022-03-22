'use strict';

module.exports = {
  type: "admin",
  routes: [
    {
      method: 'GET',
      path: '/config',
      handler: 'admin__config.getConfig',
      config: {
        policies: [],
      }
    },
    {
      method: 'POST',
      path: '/config',
      handler: 'admin__config.setConfig',
      config: {
        policies: [],
      }
    },
    {
      method: 'POST',
      path: '/upload',
      handler: 'admin__upload.upload',
      config: {
        policies: [],
      }
    }
  ]
}