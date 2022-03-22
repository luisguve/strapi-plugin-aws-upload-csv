'use strict';

/**
 *  service.
 */

const pluginId = require("../pluginId")

const axios = require("axios")
const { aws4Interceptor } = require("aws4-axios");

const STORE_KEY = "aws-upload-csv"

module.exports = {
  axiosClient: null,
  DEFAULT_CONFIG: {
    region: "",
    accessKeyId: "",
    secretAccessKey: "",
    lambdaUrl: ""
  },
  /**
   * Retrieve the strapi data storage for the plugin
   */
  getStore: function() {
    return strapi.store({
      type: "plugin",
      name: pluginId
    })
  },
  isValidConfig: function(config) {
    return (
      config.region          !== "" &&
      config.accessKeyId     !== "" &&
      config.secretAccessKey !== "" &&
      config.lambdaUrl       !== ""
    )
  },
  getConfig: async function() {
    const pluginStore = this.getStore()
    const config = await pluginStore.get({ key: STORE_KEY})
    if (!config) {
      return this.DEFAULT_CONFIG
    }
    return config
  },
  setConfig: async function(newConfigInput) {
    const config = await this.getConfig()
    for (const key in newConfigInput) {
      if (newConfigInput[key] === null) {
        delete newConfigInput[key]
      }
    }
    const newConfig = {...config, ...newConfigInput}
    const pluginStore = this.getStore()
    pluginStore.set({ key: STORE_KEY, value: newConfig})
    this.setAxiosClient(newConfig)
  },
  getAxiosClient: async function() {
    if (!this.axiosClient) {
      const config = await this.getConfig()
      this.setAxiosClient(config)
    }
    return this.axiosClient
  },
  setAxiosClient: function(config) {
    if (this.isValidConfig(config)) {
      const interceptor = aws4Interceptor(
        {
          region: config.region,
          service: "execute-api",
        },
        {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        }
      )
      const client = axios.create();
      client.interceptors.request.use(interceptor);
      this.axiosClient = client
    }
  }
}
