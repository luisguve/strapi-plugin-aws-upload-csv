'use strict';

module.exports = {
  async upload(ctx) {
    const config = await strapi.service('plugin::aws-upload-csv.config').getConfig()
    const axios = await strapi.service('plugin::aws-upload-csv.config').getAxiosClient()
    if (!axios) {
      return ctx.badRequest("Config is not set properly", config)
    }

    const {data} = ctx.request.body
    if (!data) {
      return ctx.badRequest("Invalid payload", {data})
    }
    try {
      const res = await axios.post(config.lambdaUrl, {data})
      console.log(JSON.stringify({data: res.data}))
    } catch(err) {
      if (err.response) {
        console.log(err.response)
      } else {
        console.log(err.code)
      }
      return ctx.internalServerError("Error submitting data to lambda")
    }
    ctx.body = {
      ok: true
    }
  }
}