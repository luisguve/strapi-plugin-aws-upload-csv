'use strict';

module.exports = {
  async getConfig(ctx) {
    const config = await strapi.service('plugin::aws-upload-csv.config').getConfig()
    return { config }
  },
  async setConfig(ctx) {
    const { config } = ctx.request.body
    await strapi.service('plugin::aws-upload-csv.config').setConfig(config)
    return { ok: true }
  }
}
