/*
 *
 * Settings Page
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Box } from "@strapi/design-system/Box"
import { Typography } from '@strapi/design-system/Typography';
import { Status } from '@strapi/design-system/Status';
import { TextInput } from '@strapi/design-system/TextInput';
import { Button } from '@strapi/design-system/Button';
import { Tooltip } from '@strapi/design-system/Tooltip';
import { Stack } from '@strapi/design-system/Stack';
import { Textarea } from '@strapi/design-system/Textarea';
import axios from "../../utils/axiosInstance"

const SettingsPage = () => {
  const [config, setConfig] = useState({
    initial: null,
    current: {
      region: null,
      accessKeyId: null,
      secretAccessKey: null,
      lambdaUrl: null
    }
  })
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState(null)
  const url = `/aws-upload-csv/config`
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await axios.get(url)
        setConfig({
          ...config,
          initial: data.config
        })
      } catch(err) {
        console.log(err)
        if (!status) {
          setStatus(
            <Status variant="danger">
              <Typography>
                The config could not be loaded. Please check console
              </Typography>
            </Status>
          )
        }
      }
    }
    fetchConfig()
  }, [])
  const handleChange = (param, value) => {
    const newConfig = {
      ...config,
      current: {
        ...config.current,
        [param]: value
      }
    }
    setConfig(newConfig)
  }
  const isNewConfig = () => {
    if (!config.initial) {
      return true
    }

    let region = config.current.region !== null
    let lambdaUrl = config.current.lambdaUrl !== null
    let accessKeyId = config.current.accessKeyId !== null
    let secretAccessKey = config.current.secretAccessKey !== null

    if (region) {
      region =
        config.current.region !== config.initial.region
    }
    if (accessKeyId) {
      accessKeyId =
        config.current.accessKeyId !== config.initial.accessKeyId
    }
    if (secretAccessKey) {
      secretAccessKey =
        config.current.secretAccessKey !== config.initial.secretAccessKey
    }
    if (lambdaUrl) {
      lambdaUrl =
        config.current.lambdaUrl !== config.initial.lambdaUrl
    }
    return (
      region || accessKeyId || secretAccessKey || lambdaUrl
    )
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("submitting", {config})
    if (
      !( // at least one of the fields should not be null
        config.current.region !== null ||
        config.current.accessKeyId !== null ||
        config.current.secretAccessKey !== null ||
        config.current.lambdaUrl !== null
      )
    ) {
      return
    }

    setSending(true)
    try {
      if (isNewConfig()) {
        await axios.post(url, JSON.stringify({ config: config.current }))
      }
      const newInitial = {...config.current}
      for (const key in newInitial) {
        if (newInitial[key] === null) {
          delete newInitial[key]
        }
      }
      const newConfig = {
        ...config,
        initial: {...config.initial, ...newInitial}
      }
      setConfig(newConfig)
      setStatus(
        <Status variant="success">
          <Typography>
            The config has been updated correctly
          </Typography>
        </Status>
      )
    } catch(err) {
      console.log(err)
      setStatus(
        <Status variant="danger">
          <Typography>
            The config could not be set. Please check console
          </Typography>
        </Status>
      )
    } finally {
      setSending(false)
    }
  }
  return (
    <Box background="neutral100" padding={8}>
      <Box paddingBottom={3} paddingTop={3}>
        <Typography variant="alpha" fontWeight="bold">AWS Lambda settings</Typography>
      </Box>
      <Box background="neutral0" padding={6}>
        <Stack size={4}>
          <Typography variant="beta">
            Set the following parameters in order to authenticate requests while uploading data
          </Typography>
          <Stack size={0}>
            <Typography variant="epsilon">
              Current configuration:
            </Typography>
            <Typography>
              Region: {" "}
              <Typography fontWeight="bold">
                {
                  !config.initial ? "loading..." :
                  config.initial.region || "unset"
                }
              </Typography>
            </Typography>
            <Typography>
              Access key ID: {" "}
              <Typography fontWeight="bold">
                {
                  !config.initial ? "loading..." :
                  config.initial.accessKeyId ?
                  config.initial.accessKeyId.substr(0,45)+"..." : "unset"
                }
              </Typography>
            </Typography>
            <Typography>
              Access key secret: {" "}
              <Typography fontWeight="bold">
                {
                  !config.initial ? "loading..." :
                  config.initial.secretAccessKey ?
                  config.initial.secretAccessKey.substr(0,45)+"..." : "unset"
                }
              </Typography>
            </Typography>
            <Typography>
              Lambda URL: {" "}
              <Typography fontWeight="bold">
                {
                  !config.initial ? "loading..." :
                  config.initial.lambdaUrl || "unset"
                }
              </Typography>
            </Typography>
          </Stack>
        </Stack>
        <Box paddingTop={4} paddingBottom={2}>
          <form onSubmit={handleSubmit}>
            <Stack size={2}>
              <TextInput
                label="Region"
                name="region"
                onChange={e => handleChange("region", e.target.value)}
                value={
                  config.current.region !== null ?
                    config.current.region
                  : config.initial ? config.initial.region : ""
                }
                required
              />
              <TextInput
                label="Access Key ID"
                name="accessKeyId"
                onChange={e => handleChange("accessKeyId", e.target.value)}
                value={
                  config.current.accessKeyId !== null ?
                    config.current.accessKeyId
                  : config.initial ? config.initial.accessKeyId : ""
                }
                required
              />
              <TextInput
                label="Access Key secret"
                name="secretAccessKey"
                onChange={e => handleChange("secretAccessKey", e.target.value)}
                value={
                  config.current.secretAccessKey !== null ?
                    config.current.secretAccessKey
                  : config.initial ? config.initial.secretAccessKey : ""
                }
                required
              />
              <TextInput
                label="Lambda URL"
                name="lambdaUrl"
                onChange={e => handleChange("lambdaUrl", e.target.value)}
                value={
                  config.current.lambdaUrl !== null ?
                    config.current.lambdaUrl
                  : config.initial ? config.initial.lambdaUrl : ""
                }
                required
              />
              <Box>
                <Button
                  type="submit"
                  loading={sending ? true : undefined}
                >Submit</Button>
              </Box>
            </Stack>
          </form>
        </Box>
        {
          status &&
          <Box>
            {status}
          </Box>
        }
      </Box>
    </Box>
  )
};

export default memo(SettingsPage);
