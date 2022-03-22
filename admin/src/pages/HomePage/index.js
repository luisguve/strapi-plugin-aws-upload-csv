/*
 *
 * HomePage
 *
 */

import React, { memo, useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
import { Box } from "@strapi/design-system/Box"
import { Status } from '@strapi/design-system/Status';
import { Stack } from '@strapi/design-system/Stack';
import { Typography } from '@strapi/design-system/Typography'
import { Button } from '@strapi/design-system/Button'
import Papa from "papaparse"
import axios from "../../utils/axiosInstance"

const HomePage = () => {

  const [file, setFile] = useState(null)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState(null)

  const handleError = (err, ctx) => {
    console.log(err)
    setStatus(
      <Status variant="danger">
        <Typography>
          {ctx}
        </Typography>
      </Status>
    )
  }

  const submitFileContents = async (fileContents) => {
    setSending(true)
    try {
      const url = "/aws-upload-csv/upload"
      const { data } = await axios.post(url, {
        data: fileContents.data,
        fields: fileContents.meta.fields
      })
      setStatus(
        <Status variant="success">
          <Typography>
            {`${file.name}`} submitted successfully
          </Typography>
        </Status>
      )
      setFile(null)
    } catch(err) {
      handleError(err, "Could not upload data. Check console")
    } finally {
      setSending(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file) {
      return
    }
    setStatus(null)
    Papa.parse(file, {
      header: true,
      complete: submitFileContents,
      error: (err) => {handleError(err, "Could not parse CSV file. Check console")}
    })
  }

  return (
    <Box background="neutral100" padding={8}>
      <Box paddingBottom={3} paddingTop={3}>
        <Typography variant="alpha" fontWeight="bold">Submit data to DynamoDB</Typography>
      </Box>
      <Box background="neutral0" padding={4}>
        <Stack size={4}>
          <label>
            <Stack size={0}>
              <Box paddingBottom={1}>
                CSV File
              </Box>
              <Box>
                <input
                  type="file"
                  accept=".csv"
                  onChange={e => setFile(e.target.files[0])}
                />
              </Box>
            </Stack>
          </label>
          <Box>
            <Button
              onClick={handleSubmit}
              disabled={file === null}
              loading={sending}
            >
              Submit
            </Button>
          </Box>
        </Stack>
        {
          status &&
          <Box paddingTop={4}>
            {status}
          </Box>
        }
      </Box>
    </Box>
  )
};

export default memo(HomePage);
